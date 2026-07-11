/**
 * BLK-10b — Turnstile server config and Cloudflare siteverify helper.
 * Secrets read only from Firebase Secret Manager at runtime (never in repo).
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SUPPORTED_ACTIONS = new Set(["login", "registration", "passwordReset"]);

/**
 * @param {string|undefined} raw
 * @param {boolean} fallback
 * @returns {boolean}
 */
function parseBool(raw, fallback) {
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return fallback;
}

/**
 * Server-side feature flags (default OFF / fail-open).
 * @param {string|undefined} secretValue
 * @returns {{ enabled: boolean, enforce: boolean, secretPresent: boolean }}
 */
function getServerConfig(secretValue) {
  return {
    enabled: parseBool(process.env.CARIHUB_TURNSTILE_ENABLED, false),
    enforce: parseBool(process.env.CARIHUB_TURNSTILE_ENFORCE, false),
    secretPresent: !!(secretValue && String(secretValue).trim()),
  };
}

/**
 * @param {string} secret
 * @param {string} token
 * @param {string|undefined} action
 * @param {string|undefined} remoteip
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<{ success: boolean, action?: string, errorCodes?: string[] }>}
 */
async function verifyWithCloudflare(secret, token, action, remoteip, fetchImpl) {
  const fetchFn = fetchImpl || global.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("fetch_unavailable");
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  const response = await fetchFn(SITEVERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    return { success: false, errorCodes: ["http_" + response.status] };
  }

  const payload = await response.json();
  const success = !!payload.success;
  const cfAction = payload.action ? String(payload.action) : undefined;

  if (success && action && cfAction && cfAction !== action) {
    return { success: false, action: cfAction, errorCodes: ["action_mismatch"] };
  }

  return {
    success,
    action: cfAction,
    errorCodes: Array.isArray(payload["error-codes"]) ? payload["error-codes"] : [],
  };
}

module.exports = {
  SITEVERIFY_URL,
  SUPPORTED_ACTIONS,
  parseBool,
  getServerConfig,
  verifyWithCloudflare,
};
