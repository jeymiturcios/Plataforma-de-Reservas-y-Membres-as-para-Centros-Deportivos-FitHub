// routes/reservas.js

import { Router } from "express";
const router = Router();
import pool from "../db/index.js";

import { validarReservaDuplicada, validarCupo } from "../middleware/validation";

// CREATE (POST)
router.post("/", validarReservaDuplicada, validarCupo, async (req, res, next) => {
  try {

    const { cliente_id, actividad_id, precio_aplicado, observacion } = req.body;

    const nueva = await pool.query(
      `INSERT INTO reserva (cliente_id, actividad_id, fecha_reserva, precio_aplicado, estado_reserva, observacion)
       VALUES ($1, $2, NOW(), $3, 'confirmada', $4)
       RETURNING *`,
      [cliente_id, actividad_id, precio_aplicado, observacion] 
    );
    res.json(nueva.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Actualización Total (PUT)
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cliente_id, actividad_id, precio_aplicado, estado_reserva, observacion } = req.body;

    const actualizada = await pool.query(
      `UPDATE reserva 
       SET cliente_id = $1, actividad_id = $2, precio_aplicado = $3, 
           estado_reserva = $4, observacion = $5
       WHERE reserva_id = $6
       RETURNING *`,
      [cliente_id, actividad_id, precio_aplicado, estado_reserva, observacion, id]
    );

    if (actualizada.rows.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json(actualizada.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Actualización de Estado y Observación (PATCH)
router.patch("/:id/estado", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado_reserva, observacion } = req.body;

    const parcheada = await pool.query(
      `UPDATE reserva 
       SET estado_reserva = COALESCE($1, estado_reserva), 
           observacion = COALESCE($2, observacion)
       WHERE reserva_id = $3
       RETURNING *`,
      [estado_reserva, observacion, id]
    );

    if (parcheada.rows.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json(parcheada.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;