const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const {
  getServerConfig,
  verifyWithCloudflare,
  SUPPORTED_ACTIONS,
} = require("./server-config");

const TURNSTILE_SECRET = defineSecret("TURNSTILE_SECRET_KEY");

/**
 * Callable: verifyTurnstile
 * Default path (flags off / no secret): fail-open { ok: true, skipped: true }.
 * Enforce path requires CARIHUB_TURNSTILE_ENABLED=true, CARIHUB_TURNSTILE_ENFORCE=true,
 * and TURNSTILE_SECRET_KEY configured in Secret Manager (not in repo).
 */
function createVerifyTurnstileCallable() {
  return onCall(
    {
      secrets: [TURNSTILE_SECRET],
      region: "us-central1",
    },
    async (request) => {
      const data = request.data || {};
      const token = data.token ? String(data.token) : "";
      const action = data.action ? String(data.action) : "";
      const cfg = getServerConfig(TURNSTILE_SECRET.value());

      if (!cfg.enabled || !cfg.enforce) {
        return {
          ok: true,
          skipped: true,
          verified: false,
          action: action || null,
          reason: "server_enforcement_disabled",
        };
      }

      if (!cfg.secretPresent) {
        console.warn("[CariHub Turnstile] TURNSTILE_SECRET_KEY missing — fail-open");
        return {
          ok: true,
          skipped: true,
          verified: false,
          reason: "secret_missing_fail_open",
        };
      }

      if (!token) {
        throw new HttpsError("invalid-argument", "Turnstile token required");
      }

      if (!action || !SUPPORTED_ACTIONS.has(action)) {
        throw new HttpsError("invalid-argument", "Invalid Turnstile action");
      }

      const remoteip =
        request.rawRequest && request.rawRequest.ip ?
          String(request.rawRequest.ip) :
          undefined;

      const verification = await verifyWithCloudflare(
        TURNSTILE_SECRET.value(),
        token,
        action,
        remoteip
      );

      if (!verification.success) {
        throw new HttpsError(
          "permission-denied",
          "Turnstile verification failed",
          { errorCodes: verification.errorCodes || [] }
        );
      }

      return {
        ok: true,
        skipped: false,
        verified: true,
        action,
        reason: "verified",
      };
    }
  );
}

module.exports = {
  createVerifyTurnstileCallable,
  TURNSTILE_SECRET,
};
