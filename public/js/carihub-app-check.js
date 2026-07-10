/**
 * CariHub App Check — BLK-10a monitor-safe bootstrap.
 * Loaded before carihub-core.js. Fail-open: never blocks Firebase init.
 *
 * Flags (defaults safe for production static hosting):
 *   CARIHUB_APP_CHECK_ENABLED = false
 *   CARIHUB_APP_CHECK_MODE    = off  (off | monitor | enforce)
 */
(function (global) {
  'use strict';

  var SUPPORTED_MODES = ['off', 'monitor', 'enforce'];
  var ACTIVATION_FLAG = '__CARIHUB_APP_CHECK_ACTIVATED__';

  var DEFAULTS = {
    enabled: false,
    mode: 'off',
    provider: 'recaptcha-v3',
    siteKey: null,
    debug: false
  };

  var lastState = {
    status: 'off',
    mode: 'off',
    enabled: false,
    activated: false,
    error: null,
    provider: null
  };

  function parseBool(value, fallback) {
    if (value === true || value === false) return value;
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return fallback;
  }

  function normalizeMode(mode) {
    var normalized = String(mode || 'off').toLowerCase();
    return SUPPORTED_MODES.indexOf(normalized) >= 0 ? normalized : 'off';
  }

  function readQueryDebugFlag() {
    try {
      return new URLSearchParams(global.location.search).get('appCheckDebug') === '1';
    } catch (e) {
      return false;
    }
  }

  /**
   * Resolve runtime config. Override via window.CariHubAppCheckConfig for tests/dev.
   * Production defaults remain off unless explicitly enabled.
   */
  function resolveConfig(override) {
    var source = override || global.CariHubAppCheckConfig || {};
    var enabled = parseBool(source.enabled, DEFAULTS.enabled);
    var mode = normalizeMode(source.mode != null ? source.mode : DEFAULTS.mode);

    if (!enabled) {
      mode = 'off';
    } else if (mode === 'off') {
      enabled = false;
    }

    return {
      enabled: enabled,
      mode: mode,
      provider: source.provider || DEFAULTS.provider,
      siteKey: source.siteKey || DEFAULTS.siteKey,
      debug: parseBool(source.debug, DEFAULTS.debug) || readQueryDebugFlag()
    };
  }

  function logDebug(config, message, detail) {
    if (!config.debug) return;
    if (detail !== undefined) {
      console.info('[CariHub App Check] ' + message, detail);
    } else {
      console.info('[CariHub App Check] ' + message);
    }
  }

  function logWarn(message, detail) {
    if (detail !== undefined) {
      console.warn('[CariHub App Check] ' + message, detail);
    } else {
      console.warn('[CariHub App Check] ' + message);
    }
  }

  function buildState(partial) {
    lastState = Object.assign({}, lastState, partial || {});
    return lastState;
  }

  function createProvider(firebase, config) {
    if (!firebase.appCheck) return null;
    if (config.provider === 'recaptcha-v3' && firebase.appCheck.ReCaptchaV3Provider) {
      return new firebase.appCheck.ReCaptchaV3Provider(config.siteKey);
    }
    return null;
  }

  /**
   * Initialize App Check after Firebase App exists. Never throws; fail-open on all errors.
   */
  function initAppCheck(firebase, app, overrideConfig) {
    var config = resolveConfig(overrideConfig);

    if (!config.enabled || config.mode === 'off') {
      return buildState({
        status: 'off',
        mode: 'off',
        enabled: false,
        activated: false,
        error: null,
        provider: null
      });
    }

    if (!firebase || !app) {
      logWarn('Firebase app not ready; skipping App Check (fail-open)');
      return buildState({
        status: 'skipped',
        mode: config.mode,
        enabled: config.enabled,
        activated: false,
        error: 'firebase_not_ready',
        provider: config.provider
      });
    }

    if (global[ACTIVATION_FLAG]) {
      logDebug(config, 'App Check already activated; skipping duplicate init');
      return buildState({
        status: 'already_active',
        mode: config.mode,
        enabled: config.enabled,
        activated: true,
        error: null,
        provider: config.provider
      });
    }

    if (typeof firebase.appCheck !== 'function') {
      logWarn('firebase-app-check-compat.js not loaded; continuing without App Check (fail-open)');
      return buildState({
        status: 'skipped',
        mode: config.mode,
        enabled: config.enabled,
        activated: false,
        error: 'app_check_sdk_missing',
        provider: config.provider
      });
    }

    if (!config.siteKey) {
      logWarn('siteKey absent; App Check not activated (fail-open). Configure in Firebase Console.');
      return buildState({
        status: 'skipped',
        mode: config.mode,
        enabled: config.enabled,
        activated: false,
        error: 'site_key_missing',
        provider: config.provider
      });
    }

    try {
      var provider = createProvider(firebase, config);
      if (!provider) {
        logWarn('App Check provider unavailable; continuing (fail-open)', config.provider);
        return buildState({
          status: 'skipped',
          mode: config.mode,
          enabled: config.enabled,
          activated: false,
          error: 'provider_unavailable',
          provider: config.provider
        });
      }

      firebase.appCheck(app).activate(provider, true);
      global[ACTIVATION_FLAG] = true;

      var activeStatus = config.mode === 'enforce' ? 'active-enforce' : 'active-monitor';
      logDebug(config, 'App Check activated (' + config.mode + ')');

      if (config.mode === 'monitor') {
        firebase
          .appCheck(app)
          .getToken(false)
          .then(function (result) {
            logDebug(config, 'monitor token sample', result && result.token ? 'present' : 'empty');
          })
          .catch(function (err) {
            logWarn('monitor getToken failed (fail-open)', err);
          });
      }

      return buildState({
        status: activeStatus,
        mode: config.mode,
        enabled: true,
        activated: true,
        error: null,
        provider: config.provider
      });
    } catch (err) {
      logWarn('init failed (fail-open)', err);
      return buildState({
        status: 'error',
        mode: config.mode,
        enabled: config.enabled,
        activated: false,
        error: err && err.message ? err.message : 'init_failed',
        provider: config.provider
      });
    }
  }

  function resetForTests() {
    delete global[ACTIVATION_FLAG];
    lastState = {
      status: 'off',
      mode: 'off',
      enabled: false,
      activated: false,
      error: null,
      provider: null
    };
  }

  global.CariHubAppCheck = {
    CONFIG_KEYS: {
      ENABLED: 'CARIHUB_APP_CHECK_ENABLED',
      MODE: 'CARIHUB_APP_CHECK_MODE'
    },
    DEFAULTS: DEFAULTS,
    SUPPORTED_MODES: SUPPORTED_MODES.slice(),
    resolveConfig: resolveConfig,
    initAppCheck: initAppCheck,
    getState: function () {
      return Object.assign({}, lastState);
    },
    resetForTests: resetForTests
  };
})(typeof window !== 'undefined' ? window : globalThis);
