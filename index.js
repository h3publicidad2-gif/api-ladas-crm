const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 TOKEN DE CRMTRC
const TOKEN = "hJO4RliVmytk0ArWEHtBACBN5mwdoF";

// 🔥 MAPEO DE LADAS → ID DE COLAS
const colas = {
  "871": 17, // Laguna
  "55": 15,  // CDMX
  "81": 18,  // Nuevo León
  "618": 16, // Durango
  "222": 19, // Puebla
  "667": 20  // Sinaloa
};

// 🚀 ENDPOINT PRINCIPAL
app.post("/asignar", async (req, res) => {
  try {
    let numero = req.body.numero;

    if (!numero) {
      return res.status(400).json({ error: "No hay número" });
    }

    // 🔥 LIMPIAR NÚMERO
    numero = numero.toString().replace(/\D/g, "");

    // quitar prefijo México
    if (numero.startsWith("52")) {
      numero = numero.substring(2);
    }

    // 🔍 detectar lada
    let lada = numero.substring(0, 3);

    if (!colas[lada]) {
      lada = numero.substring(0, 2);
    }

    const colaId = colas[lada];

    if (!colaId) {
      return res.json({
        numero,
        lada,
        error: "No hay cola asignada"
      });
    }

    // 🚨 AQUÍ ESTÁ EL CAMBIO IMPORTANTE (ENDPOINT CORRECTO)
    const response = await axios.post(
      "https://crmtrc.online/api/tickets/transferQueue",
      {
        whatsappId: 1,          // ⚠️ normalmente es 1
        contactNumber: numero, // ⚠️ no es "number"
        queueId: colaId
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      ok: true,
      numero,
      lada,
      colaId,
      crmResponse: response.data
    });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Error al asignar",
      detalle: error.response?.data || error.message
    });
  }
});

// 🔍 TEST
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
