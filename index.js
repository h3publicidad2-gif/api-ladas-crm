const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = "hJO4RliVmytk0ArWEHtBACBN5mwdoF";
const BASE_URL = "https://crmtrc.online/api";

// 🔥 MAPEO DE LADAS → COLAS
const colas = {
  "871": 17,
  "55": 15,
  "81": 18,
  "618": 16,
  "222": 19,
  "667": 20
};

app.post("/asignar", async (req, res) => {
  try {
    let numero = req.body.numero;

    if (!numero) {
      return res.status(400).json({ error: "No hay número" });
    }

    // limpiar número
    numero = numero.toString().replace(/\D/g, "");

    if (numero.startsWith("52")) {
      numero = numero.substring(2);
    }

    // detectar lada
    let lada = numero.substring(0, 3);
    if (!colas[lada]) {
      lada = numero.substring(0, 2);
    }

    const colaId = colas[lada];

    if (!colaId) {
      return res.json({ error: "Sin cola", numero });
    }

    // 🔥 1. BUSCAR TICKET
    const search = await axios.get(`${BASE_URL}/tickets`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      params: { search: numero }
    });

    const tickets = search.data.tickets;

    if (!tickets || tickets.length === 0) {
      return res.json({
        error: "No se encontró ticket",
        numero
      });
    }

    const ticketId = tickets[0].id;

    // 🔥 2. TRANSFERIR
    await axios.post(
      `${BASE_URL}/tickets/${ticketId}/transfer`,
      { queueId: colaId },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );

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

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
