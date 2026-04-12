const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔥 CONFIG
const CRM_URL = "https://crmtcrc.online"; // tu CRM
const TOKEN = ""; // déjalo vacío por ahora

// 🔥 Detectar lada
function obtenerLada(numero) {
  numero = numero.replace(/\D/g, "");

  if (numero.startsWith("521")) return numero.substring(3, 6);
  if (numero.startsWith("52")) return numero.substring(2, 5);

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

  return mapa[lada] || "Asesor CDMX";
}

// 🔥 ENDPOINT PRINCIPAL
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

    // 🔥 POR AHORA SOLO RESPONDE (NO CRM TODAVÍA)
    return res.json({
      ok: true,
      lada,
      fila
    });

  } catch (error) {
    console.error("❌ Error:", error.message);

    return res.status(500).json({
      error: "Error",
      detalle: error.message
    });
  }
});

// 🔥 TEST RUTA (para navegador)
app.get("/", (req, res) => {
  res.send("🔥 API funcionando correctamente");
});

// 🔥 PUERTO (IMPORTANTE PARA RAILWAY)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
