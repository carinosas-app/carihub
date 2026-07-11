/**
 * CariHub Turnstile — BLK-10b scaffold (default OFF, fail-open).
 *
 * Flags (production-safe defaults):
 *   CARIHUB_TURNSTILE_ENABLED = false
 *   CARIHUB_TURNSTILE_MODE    = off  (off | monitor | enforce)
 *   Surfaces: login, registration, passwordReset — all false
 */
(function (global) {
  'use strict';

  var SUPPORTED_MODES = ['off', 'monitor', 'enforce'];
  var SUPPORTED_ACTIONS = ['login', 'registration', 'passwordReset'];
  var TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  var SCRIPT_LOAD_FLAG = '__CARIHUB_TURNSTILE_SCRIPT_LOADING__';

  var DEFAULTS = {
    enabled: false,
    mode: 'off',
    siteKey: null,
    debug: false,
    surfaces: {
      login: false,
      registration: false,
      passwordReset: false
    },
    verifyCallableName: 'verifyTurnstile'
  };

  var lastState = {
    status: 'off',
    mode: 'off',
    enabled: false,
    lastAction: null,
    lastResult: null
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

  function normalizeAction(action) {
    var normalized = String(action || '').trim();
    return SUPPORTED_ACTIONS.indexOf(normalized) >= 0 ? normalized : null;
  }

  function readQueryDebugFlag() {
    try {
      return new URLSearchParams(global.location.search).get('turnstileDebug') === '1';
    } catch (e) {
      return false;
    }
  }

  function resolveConfig(override) {
    var source = override || global.CariHubTurnstileConfig || {};
    var enabled = parseBool(source.enabled, DEFAULTS.enabled);
    var mode = normalizeMode(source.mode != null ? source.mode : DEFAULTS.mode);
    var surfacesIn = source.surfaces && typeof source.surfaces === 'object' ? source.surfaces : {};

    if (!enabled) {
      mode = 'off';
    } else if (mode === 'off') {
      enabled = false;
    }

    return {
      enabled: enabled,
      mode: mode,
      siteKey: source.siteKey || DEFAULTS.siteKey,
      debug: parseBool(source.debug, DEFAULTS.debug) || readQueryDebugFlag(),
      surfaces: {
        login: parseBool(surfacesIn.login, DEFAULTS.surfaces.login),
        registration: parseBool(surfacesIn.registration, DEFAULTS.surfaces.registration),
        passwordReset: parseBool(surfacesIn.passwordReset, DEFAULTS.surfaces.passwordReset)
      },
      verifyCallableName: source.verifyCallableName || DEFAULTS.verifyCallableName
    };
  }

  function logDebug(config, message, detail) {
    if (!config.debug) return;
    if (detail !== undefined) {
      console.info('[CariHub Turnstile] ' + message, detail);
    } else {
      console.info('[CariHub Turnstile] ' + message);
    }
  }

  function logWarn(message, detail) {
    if (detail !== undefined) {
      console.warn('[CariHub Turnstile] ' + message, detail);
    } else {
      console.warn('[CariHub Turnstile] ' + message);
    }
  }

  function isSurfaceEnabled(config, action) {
    if (!config.enabled || config.mode === 'off') return false;
    if (!action) return false;
    return !!config.surfaces[action];
  }

  function loadTurnstileScript() {
    return new Promise(function (resolve, reject) {
      if (global.turnstile && typeof global.turnstile.render === 'function') {
        resolve(global.turnstile);
        return;
      }
      if (global[SCRIPT_LOAD_FLAG]) {
        var waitTimer = setInterval(function () {
          if (global.turnstile && typeof global.turnstile.render === 'function') {
            clearInterval(waitTimer);
            resolve(global.turnstile);
          }
        }, 50);
        setTimeout(function () {
          clearInterval(waitTimer);
          if (global.turnstile) resolve(global.turnstile);
          else reject(new Error('turnstile_script_timeout'));
        }, 10000);
        return;
      }
      global[SCRIPT_LOAD_FLAG] = true;
      var script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = function () {
        if (global.turnstile) resolve(global.turnstile);
        else reject(new Error('turnstile_script_missing_global'));
      };
      script.onerror = function () {
        reject(new Error('turnstile_script_load_failed'));
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }

  function defaultContainerForAction(action) {
    if (typeof document === 'undefined') return null;
    return document.querySelector('[data-turnstile-action="' + action + '"]');
  }

  function renderWidget(action, containerEl, overrideConfig) {
    var config = resolveConfig(overrideConfig);
    if (!isSurfaceEnabled(config, action)) {
      return Promise.resolve({ status: 'skipped', token: null });
    }
    if (!config.siteKey) {
      logWarn('siteKey absent; widget not rendered (fail-open)');
      return Promise.resolve({ status: 'skipped', token: null, error: 'site_key_missing' });
    }
    var container = containerEl || defaultContainerForAction(action);
    if (!container) {
      logWarn('Turnstile container missing for action ' + action + ' (fail-open)');
      return Promise.resolve({ status: 'skipped', token: null, error: 'container_missing' });
    }
    return loadTurnstileScript()
      .then(function (turnstile) {
        return new Promise(function (resolve) {
          try {
            container.innerHTML = '';
            container.removeAttribute('hidden');
            turnstile.render(container, {
              sitekey: config.siteKey,
              action: action,
              callback: function (token) {
                resolve({ status: 'token', token: token });
              },
              'error-callback': function () {
                resolve({ status: 'error', token: null, error: 'widget_error' });
              },
              'expired-callback': function () {
                resolve({ status: 'expired', token: null, error: 'token_expired' });
              }
            });
          } catch (err) {
            logWarn('widget render failed (fail-open)', err);
            resolve({ status: 'error', token: null, error: err && err.message ? err.message : 'render_failed' });
          }
        });
      })
      .catch(function (err) {
        logWarn('Turnstile script unavailable (fail-open)', err);
        return { status: 'skipped', token: null, error: err && err.message ? err.message : 'script_failed' };
      });
  }

  function getCallable(config) {
    if (!global.firebase || typeof global.firebase.app !== 'function') return null;
    if (typeof global.firebase.functions !== 'function') return null;
    try {
      var functions = global.firebase.functions();
      if (!functions || typeof functions.httpsCallable !== 'function') return null;
      return functions.httpsCallable(config.verifyCallableName);
    } catch (err) {
      logWarn('Firebase Functions unavailable (fail-open)', err);
      return null;
    }
  }

  function verifyServerSide(action, token, overrideConfig) {
    var config = resolveConfig(overrideConfig);
    if (!token) {
      return Promise.resolve({ ok: true, skipped: true, reason: 'no_token' });
    }
    var callable = getCallable(config);
    if (!callable) {
      logWarn('verifyTurnstile callable unavailable (fail-open)');
      return Promise.resolve({ ok: true, skipped: true, reason: 'callable_unavailable' });
    }
    return callable({ token: token, action: action })
      .then(function (result) {
        var data = result && result.data ? result.data : {};
        return {
          ok: data.ok !== false,
          skipped: !!data.skipped,
          verified: !!data.verified,
          action: data.action || action,
          reason: data.reason || null
        };
      })
      .catch(function (err) {
        logWarn('server verification failed (fail-open)', err);
        return { ok: true, skipped: true, reason: 'verify_error_fail_open' };
      });
  }

  /**
   * Gate an auth-sensitive action. Default path: immediate ok/skipped.
   * Enforce mode blocks only when surface enabled, token present, and verify fails.
   */
  function gateAction(action, options) {
    options = options || {};
    var config = resolveConfig(options.config);
    var normalizedAction = normalizeAction(action);
    lastState.lastAction = normalizedAction;

    if (!normalizedAction) {
      return Promise.resolve({
        ok: true,
        skipped: true,
        enforced: false,
        action: action,
        reason: 'unknown_action'
      });
    }

    if (!config.enabled || config.mode === 'off' || !isSurfaceEnabled(config, normalizedAction)) {
      var offResult = {
        ok: true,
        skipped: true,
        enforced: false,
        action: normalizedAction,
        reason: 'disabled'
      };
      lastState.lastResult = offResult;
      lastState.status = 'off';
      return Promise.resolve(offResult);
    }

    return renderWidget(normalizedAction, options.container || null, config)
      .then(function (widgetResult) {
        logDebug(config, 'widget result', widgetResult);
        if (!widgetResult.token) {
          var misconfigErrors = {
            site_key_missing: true,
            container_missing: true,
            script_failed: true
          };
          var isMisconfig =
            widgetResult.status === 'skipped' ||
            (widgetResult.error && misconfigErrors[widgetResult.error]);
          if (config.mode === 'enforce' && !isMisconfig) {
            return {
              ok: false,
              skipped: false,
              enforced: true,
              action: normalizedAction,
              reason: widgetResult.error || 'token_missing'
            };
          }
          return {
            ok: true,
            skipped: true,
            enforced: false,
            action: normalizedAction,
            reason: isMisconfig ? 'misconfig_fail_open' : 'monitor_no_token'
          };
        }
        return verifyServerSide(normalizedAction, widgetResult.token, config).then(function (verifyResult) {
          if (config.mode === 'enforce' && verifyResult.ok === false) {
            return {
              ok: false,
              skipped: false,
              enforced: true,
              action: normalizedAction,
              reason: verifyResult.reason || 'verify_failed'
            };
          }
          if (config.mode === 'enforce' && !verifyResult.skipped && verifyResult.ok) {
            return {
              ok: true,
              skipped: false,
              enforced: true,
              action: normalizedAction,
              reason: 'verified'
            };
          }
          return {
            ok: true,
            skipped: verifyResult.skipped !== false,
            enforced: false,
            action: normalizedAction,
            reason: verifyResult.reason || 'monitor'
          };
        });
      })
      .then(function (result) {
        lastState.lastResult = result;
        lastState.status = result.ok ? config.mode : 'blocked';
        lastState.mode = config.mode;
        lastState.enabled = config.enabled;
        return result;
      });
  }

  function resetForTests() {
    delete global[SCRIPT_LOAD_FLAG];
    lastState = {
      status: 'off',
      mode: 'off',
      enabled: false,
      lastAction: null,
      lastResult: null
    };
  }

  global.CariHubTurnstile = {
    CONFIG_KEYS: {
      ENABLED: 'CARIHUB_TURNSTILE_ENABLED',
      MODE: 'CARIHUB_TURNSTILE_MODE',
      SITE_KEY: 'CARIHUB_TURNSTILE_SITE_KEY'
    },
    DEFAULTS: DEFAULTS,
    SUPPORTED_MODES: SUPPORTED_MODES.slice(),
    SUPPORTED_ACTIONS: SUPPORTED_ACTIONS.slice(),
    resolveConfig: resolveConfig,
    isSurfaceEnabled: isSurfaceEnabled,
    renderWidget: renderWidget,
    verifyServerSide: verifyServerSide,
    gateAction: gateAction,
    getState: function () {
      return Object.assign({}, lastState);
    },
    resetForTests: resetForTests
  };
})(typeof window !== 'undefined' ? window : globalThis);
