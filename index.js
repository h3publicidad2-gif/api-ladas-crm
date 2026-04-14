const express = require("express");
const app = express();

// 👇 IMPORTANTE para leer JSON
app.use(express.json());

// 👇 ENDPOINT PRINCIPAL
app.post("/lada", (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({
      error: "Número requerido"
    });
  }

  // 👇 LIMPIAR NÚMERO (quitar +52, espacios, etc)
  const cleanNumber = number.replace(/\D/g, "");

  // 👇 OBTENER LADA (primeros 3 dígitos después de 52)
  let lada = "";

  if (cleanNumber.startsWith("52")) {
    lada = cleanNumber.substring(2, 5);
  } else {
    lada = cleanNumber.substring(0, 3);
  }

  // 👇 RESPUESTA
  res.json({
    number,
    lada
  });
});

// 👇 RUTA TEST (para ver si la API vive)
app.get("/", (req, res) => {
  res.send("API Ladas funcionando 🚀");
});

// 👇 PUERTO CORRECTO PARA RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
