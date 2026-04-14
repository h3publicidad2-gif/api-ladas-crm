const express = require("express");
const cors = require("cors");

const app = express();

// ✅ HABILITAR CORS (esto quita el problema de Hoppscotch)
app.use(cors());

// ✅ PARA LEER JSON
app.use(express.json());

// ✅ BASE SIMPLE DE LADAS (puedes crecer esto después)
const ladas = {
  "871": { ciudad: "Torreón", estado: "Coahuila" },
  "55": { ciudad: "Ciudad de México", estado: "CDMX" },
  "81": { ciudad: "Monterrey", estado: "Nuevo León" },
  "33": { ciudad: "Guadalajara", estado: "Jalisco" }
};

// ✅ ENDPOINT PRINCIPAL
app.post("/lada", (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({
      error: "Número requerido"
    });
  }

  // limpiar número
  const cleanNumber = number.replace(/\D/g, "");

  let lada = "";

  if (cleanNumber.startsWith("52")) {
    lada = cleanNumber.substring(2, 5);
  } else {
    lada = cleanNumber.substring(0, 3);
  }

  const info = ladas[lada] || {
    ciudad: "Desconocida",
    estado: "Desconocido"
  };

  res.json({
    number,
    lada,
    ciudad: info.ciudad,
    estado: info.estado
  });
});

// ✅ RUTA BASE
app.get("/", (req, res) => {
  res.send("API Ladas PRO funcionando 🚀");
});

// ✅ PUERTO RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
