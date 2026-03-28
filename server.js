import express from "express";
import pool from "./db/index.js";
import personasRouter from "./routes/personas.js";
import clientesRouter from "./routes/clientes.js";
import reservasRouter from "./routes/reservas.js";
import actividadesRouter from "./routes/actividades.js";
import pagosRouter from "./routes/pagos.js";
import membresiaRouter from "./routes/membresia.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error de conexión a la BD" });
  }
});

// Rutas de la API
app.use("/api/personas", personasRouter);

app.use("/api/clientes", clientesRouter);
app.use("/api/reservas", reservasRouter);
app.use("/api/actividades", actividadesRouter);
app.use("/api/pagos", pagosRouter);
app.use("/api/membresias", membresiaRouter);

// Manejo de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});