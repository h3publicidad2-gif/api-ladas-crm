const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = "TU_TOKEN_AQUI";
const BASE_URL = "https://crmtrc.online/api";

// 🔥 COLAS
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

    // 🔥 LIMPIAR TODO
    numero = numero.toString().replace(/\D/g, "");

    // 🔥 NORMALIZAR MEXICO (QUITAR EL 1)
    if (numero.startsWith("521")) {
      numero = "52" + numero.substring(3);
    }

    // 🔥 QUITAR 52
    if (numero.startsWith("52")) {
      numero = numero.substring(2);
    }

    // 🔥 VALIDAR LONGITUD
    if (numero.length !== 10) {
      return res.json({
        error: "Número inválido",
        numero
      });
    }

    // 🔍 SACAR LADA REAL
    let lada = numero.substring(0, 3);

    if (!colas[lada]) {
      lada = numero.substring(0, 2);
    }

    const colaId = colas[lada];

    if (!colaId) {
      return res.json({
        error: "Sin cola",
        numero,
        lada
      });
    }

    // 🔥 BUSCAR TICKET
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

    // 🔥 MOVER A COLA
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
      error: "Error",
      detalle: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("API funcionando 🔥");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor en puerto " + PORT);
});
