const express = require("express");
const app = express();

app.use(express.json());

const vendedores = {
  "871": "Pedro",
  "55": "Maria",
  "81": "Luis"
};

app.post("/asignar", (req, res) => {
  const numero = req.body.numero;

  if (!numero) {
    return res.json({ error: "No hay número" });
  }

  let lada = numero.substring(0, 3);

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

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
