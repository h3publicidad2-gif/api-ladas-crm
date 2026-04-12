const express = require("express");
const cors = require("cors");

const app = express();

// Permitir peticiones externas
app.use(cors());
app.use(express.json());

// 🔥 MAPEO DE LADAS → COLAS
const colas = {
  "871": "Asesor Laguna",
  "55": "Asesor CDMX",
  "81": "Asesor Nuevo Leon",
  "618": "Asesor Durango",
  "222": "Asesor Puebla",
  "667": "Asesor Sinaloa"
};

// 🚀 ENDPOINT PRINCIPAL
app.post("/asignar", (req, res) => {
  let numero = req.body.numero;

  if (!numero) {
    return res.status(400).json({ error: "No hay número" });
  }

  // 🔥 LIMPIAR FORMATO DEL NÚMERO
  numero = numero.toString().replace(/\D/g, ""); // quita +, espacios, etc

  // quitar prefijo México (52)
  if (numero.startsWith("52")) {
    numero = numero.substring(2);
  }

  // 🔍 detectar lada
  let lada = numero.substring(0, 3);

  // si no existe con 3 dígitos, intenta con 2
  if (!colas[lada]) {
    lada = numero.substring(0, 2);
  }

  const cola = colas[lada] || "Sin asignar";

  res.json({
    numero,
    lada,
    cola
  });
});

// 🔍 RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
