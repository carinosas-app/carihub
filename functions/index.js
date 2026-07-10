const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { createVerifyTurnstileCallable } = require("./turnstile/verify-turnstile");

admin.initializeApp();

exports.verifyTurnstile = createVerifyTurnstileCallable();

exports.vencerPerfiles = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "America/Mexico_City",
  },
  async () => {

    const db = admin.firestore();

    const ahora = new Date();

    const snapshot = await db.collection("usuarios").get();

    const batch = db.batch();

    snapshot.forEach((doc) => {

      const data = doc.data();

      if (!data.fechaVencimiento) return;

      const fechaVencimiento =
        data.fechaVencimiento.toDate();

      console.log("Usuario:", doc.id);
      console.log("Fecha vencimiento:", fechaVencimiento);
      console.log("Ahora:", ahora);

      if (fechaVencimiento <= ahora) {

        batch.update(doc.ref, {
          activo: false,
          vencido: true,
          estadoPago: "vencido",
          fechaVencidoAutomatico:
            admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Vencido:", doc.id);
      }
    });

    await batch.commit();

    console.log("Proceso terminado");

    return null;
  }
);