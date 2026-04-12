const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = "hJO4RliVmytk0ArWEHtBACBN5mwdoF";

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

    numero = numero.toString().replace(/\D/g, "");

    if (numero.startsWith("52")) {
      numero = numero.substring(2);
    }

    let lada = numero.substring(0, 3);
    if (!colas[lada]) {
      lada = numero.substring(0, 2);
    }

    const colaId = colas[lada];

    if (!colaId) {
      return res.json({ error: "Sin cola", lada });
    }

    // 🔍 1. BUSCAR TICKET
    const ticketsRes = await axios.get(
      `https://crmtrc.online/api/tickets`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const tickets = ticketsRes.data.tickets || [];

    const ticket = tickets.find(t =>
      t.contact?.number?.includes(numero)
    );

    if (!ticket) {
      return res.json({
        error: "No se encontró ticket",
        numero
      });
    }

    // 🔥 2. ACTUALIZAR COLA
    const updateRes = await axios.put(
      `https://crmtrc.online/api/tickets/${ticket.id}`,
      {
        queueId: colaId
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    res.json({
      ok: true,
      numero,
      lada,
      colaId,
      ticketId: ticket.id,
      update: updateRes.data
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
