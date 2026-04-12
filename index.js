import express from "express";

const app = express();
app.use(express.json());

// 🔥 FUNCIÓN PARA LIMPIAR NÚMERO (ANTI +521 / ESPACIOS / ETC)
function limpiarNumero(numero) {
  if (!numero) return "";

  return numero
    .replace(/\D/g, "")        // quitar todo lo que no sea número
    .replace(/^521/, "52")     // quitar el 1 después del +52
    .replace(/^52/, "");       // quitar lada país
}

// 🔥 DETECTAR LADA
function obtenerLada(numero) {
  return numero.substring(0, 3);
}

// 🔥 RUTA PRINCIPAL
app.post("/asignar", (req, res) => {
  try {
    const numeroRaw = req.body.numero;

    if (!numeroRaw) {
      return res.status(400).json({
        error: "Número no enviado"
      });
    }

    const numero = limpiarNumero(numeroRaw);
    const lada = obtenerLada(numero);

    let asesor = "Sin asignar";
    let fila = "Sin asignar";

    // 🔥 AQUÍ CONFIGURAS TUS LADAS
    if (lada === "871") {
      asesor = "Asesor Laguna";
      fila = "Asesor Laguna";
    } 
    else if (lada === "81") {
      asesor = "Asesor Nuevo Leon";
      fila = "Asesor Nuevo Leon";
    } 
    else if (lada === "55") {
      asesor = "Asesor CDMX";
      fila = "Asesor CDMX";
    } 
    else if (lada === "618") {
      asesor = "Asesor Durango";
      fila = "Asesor Durango";
    } 
    else if (lada === "222") {
      asesor = "Asesor Puebla";
      fila = "Asesor Puebla";
    } 
    else if (lada === "669") {
      asesor = "Asesor Sinaloa";
      fila = "Asesor Sinaloa";
    } 
    else {
      asesor = "General";
      fila = "General";
    }

    // 🔥 RESPUESTA PARA EL CRM
    return res.json({
      numero_original: numeroRaw,
      numero_limpio: numero,
      lada,
      asesor,
      fila   // 👈 ESTA ES LA CLAVE PARA EL CRM
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error interno"
    });
  }
});

// 🔥 PUERTO (RAILWAY)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
