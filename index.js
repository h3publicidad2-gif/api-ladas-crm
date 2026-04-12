const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 TOKEN CRM
const TOKEN = "hJO4RliVmytk0ArWEHtBACBN5mwdoF";

// 🌐 URL BASE
const BASE_URL = "https://crmtrc.online/api";

// 🔥 MAPEO DE LADAS → COLAS
const colas = {
  "871": 17, // Laguna
  "55": 15,  // CDMX
  "81": 18,  // Nuevo León
  "618": 16, // Durango
  "222": 19, // Puebla
  "667": 20  // Sinaloa
};

// 🚀 ENDPOINT
app.post("/asignar", async (req, res) => {
  try {
    let numero = req.body.numero;

    if (!numero) {
      return res.status(400).json({ error: "No hay número" });
    }

    // 🔥 LIMPIAR TODO
    numero = numero.toString().replace(/\D/g, "");

    // 🔥 FIX DEFINITIVO (ANTI CRM + WHATSAPP)
    if (numero.startsWith("521")) {
      numero = numero.substring(3);
    } else if (numero.startsWith("52")) {
      numero = numero.substring(2);
    }

    // 🔥 ASEGURAR 10 DÍGITOS
    if (numero.length > 10) {
      numero = numero.slice(-10);
    }

    if (numero.length !== 10) {
      return res.json({
        error: "Número inválido",
        numero
      });
    }

    // 🔍 DETECTAR LADA REAL
    let lada = numero.substring(0, 3);

    if (!colas[lada]) {
      lada = numero.substring(0, 2);
    }

    const colaId = colas[lada];

    if (!colaId) {
      return res.json({
        error: "Sin cola asignada",
        numero,
        lada
      });
    }

    // 🔥 BUSCAR TICKET (CON RETRY)
    let ticketId = null;

    for (let i = 0; i < 6; i++) {
      const search = await axios.get(`${BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
        params: { search: numero }
      });

      const tickets = search.data.tickets;

      if (tickets && tickets.length > 0) {
        ticketId = tickets[0].id;
        break;
      }

      await new Promise(r => setTimeout(r, 1500));
    }

    if (!ticketId) {
      return res.json({
        error: "Ticket no encontrado aún",
        numero
      });
    }

    // 🔥 TRANSFERIR A COLA
    await axios.post(
      `${BASE_URL}/tickets/${ticketId}/transfer`,
      { queueId: colaId },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );

    // ✅ RESPUESTA FINAL
    res.json({
      ok: true,
      numero,
      lada,
      colaId,
      ticketId
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

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

// 🚀 SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
