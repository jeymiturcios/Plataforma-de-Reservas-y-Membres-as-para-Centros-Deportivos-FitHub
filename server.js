import express from "express";
import pool from "./db/index.js";
import {
  validarUsuario,
  validarReservaDuplicada,
  validarCupo
} from "./middleware/validation.js";
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

app.post("/personas", validarUsuario, async (req, res, next) => {
  try {
    const {
      nombre,
      correo,
      fecha_nacimiento,
      telefono,
      dir_departamento,
      dir_ciudad,
      dir_colonia,
      dir_calle_ave
    } = req.body;

    const nuevaPersona = await pool.query(
      `INSERT INTO persona
       (nombre, correo, fecha_nacimiento, telefono, dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        nombre,
        correo,
        fecha_nacimiento,
        telefono,
        dir_departamento,
        dir_ciudad,
        dir_colonia,
        dir_calle_ave
      ]
    );

    res.status(201).json({
      mensaje: "Persona creada correctamente",
      data: nuevaPersona.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.post("/reservas", validarReservaDuplicada, validarCupo, async (req, res, next) => {
  try {
    const {
      cliente_id,
      actividad_id,
      precio_aplicado,
      observacion
    } = req.body;

    const nuevaReserva = await pool.query(
      `INSERT INTO reserva
       (cliente_id, actividad_id, fecha_reserva, precio_aplicado, estado_reserva, observacion)
       VALUES ($1, $2, NOW(), $3, 'confirmada', $4)
       RETURNING *`,
      [cliente_id, actividad_id, precio_aplicado, observacion]
    );

    res.status(201).json({
      mensaje: "Reserva creada correctamente",
      data: nuevaReserva.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});