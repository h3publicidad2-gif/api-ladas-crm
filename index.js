import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔥 CONFIG
const CRM_URL = "https://crmtcrc.online"; // cambia si es necesario
const TOKEN = "TU_TOKEN_AQUI"; // si no tienes, luego lo quitamos

// 🔥 Detectar lada
function obtenerLada(numero) {
  numero = numero.replace(/\D/g, "");

  if (numero.startsWith("521")) {
    return numero.substring(3, 6);
  }

  if (numero.startsWith("52")) {
    return numero.substring(2, 5);
  }

  return numero.substring(0, 3);
}

// 🔥 Mapear lada → fila
function obtenerFila(lada) {
  const mapa = {
    "871": "Asesor Laguna",
    "55": "Asesor CDMX",
    "81": "Asesor Nuevo Leon",
    "222": "Asesor Puebla",
    "667": "Asesor Sinaloa"
  };

  return mapa[lada] || "Asesor CDMX"; // default
}

// 🔥 Endpoint principal
app.post("/asignar", async (req, res) => {
  try {
    const { numero } = req.body;

    if (!numero) {
      return res.status(400).json({ error: "Número requerido" });
    }

    const lada = obtenerLada(numero);
    const fila = obtenerFila(lada);

    console.log("📞 Número:", numero);
    console.log("📍 Lada:", lada);
    console.log("👤 Fila:", fila);

    // 🔥 AQUI ASIGNAS EN EL CRM
    // ⚠️ ESTE ENDPOINT PUEDE CAMBIAR SEGÚN TU CRM
    await axios.post(
      `${CRM_URL}/api/tickets/assign`,
      {
        numero: numero,
        fila: fila
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    return res.json({
      ok: true,
      lada,
      fila
    });

  } catch (error) {
    console.error("❌ Error:", error.message);

    return res.status(500).json({
      error: "Error asignando",
      detalle: error.message
    });
  }
});

// 🔥 SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 API corriendo en puerto ${PORT}`);
});
