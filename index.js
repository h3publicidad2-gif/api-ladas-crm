const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Mapa de vendedores por lada
const vendedores = {
  "871": "Pedro",
  "55": "Maria",
  "81": "Luis"
};

// 🔹 Endpoint para asignación por lada
app.post("/asignar", (req, res) => {
  const numero = req.body.numero;

  if (!numero) {
    return res.json({ error: "No hay número" });
  }

  let lada = numero.substring(0, 3);

  // Si no encuentra lada de 3 dígitos, intenta con 2
  if (!vendedores[lada]) {
    lada = numero.substring(0, 2);
  }

  const vendedor = vendedores[lada] || "Sin asignar";

  res.json({
    numero,
    lada,
    vendedor
  });
});

// 🔹 Ruta base para verificar que funciona
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🔹 Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
