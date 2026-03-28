import { Router } from "express";
const router = Router();
import pool from "../db/index.js";
import { validarReservaDuplicada, validarCupo } from "../middleware/validation.js";

// POST
router.post("/", validarReservaDuplicada, validarCupo, async (req, res, next) => {
  try {
    const { cliente_id, actividad_id, precio_aplicado, observacion } = req.body;

    const nueva = await pool.query(
      `INSERT INTO reserva 
       (cliente_id, actividad_id, fecha_reserva, precio_aplicado, estado_reserva, observacion)
       VALUES ($1, $2, NOW(), $3, 'confirmada', $4)
       RETURNING *`,
      [cliente_id, actividad_id, precio_aplicado, observacion]
    );

    res.status(201).json({ mensaje: "Reserva creada correctamente", data: nueva.rows[0] });
  } catch (error) {
    next(error);
  }
});

// GET /all
router.get("/all", async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT r.*, a.nombre_actividad, p.nombre AS nombre_cliente
      FROM reserva r
      JOIN actividad a ON r.actividad_id = a.actividad_id
      JOIN persona p ON r.cliente_id = p.persona_id
      ORDER BY r.fecha_reserva DESC
    `);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No hay reservas registradas.", data: [] });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /filtro/fecha  ← antes de /:id
router.get("/filtro/fecha", async (req, res, next) => {
  try {
    const { dia } = req.query;

    if (!dia) {
      return res.status(400).json({ error: "Debes proporcionar una fecha válida (?dia=YYYY-MM-DD)" });
    }

    const result = await pool.query(
      "SELECT * FROM reserva WHERE fecha_reserva::date = $1", [dia]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No se encontraron reservas para el día ${dia}` });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /:id  ← siempre después de rutas específicas
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM reserva WHERE reserva_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cliente_id, actividad_id, precio_aplicado, estado_reserva, observacion } = req.body;

    const result = await pool.query(
      `UPDATE reserva 
       SET cliente_id = $1, actividad_id = $2, precio_aplicado = $3,
           estado_reserva = $4, observacion = $5
       WHERE reserva_id = $6
       RETURNING *`,
      [cliente_id, actividad_id, precio_aplicado, estado_reserva, observacion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json({ mensaje: "Reserva actualizada correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/estado
router.patch("/:id/estado", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado_reserva, observacion } = req.body;

    const result = await pool.query(
      `UPDATE reserva 
       SET estado_reserva = COALESCE($1, estado_reserva),
           observacion = COALESCE($2, observacion)
       WHERE reserva_id = $3
       RETURNING *`,
      [estado_reserva, observacion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json({ mensaje: "Estado actualizado correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE lógico
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE reserva SET estado_reserva = 'Cancelada' WHERE reserva_id = $1 RETURNING *`, [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json({ mensaje: "Reserva eliminada.", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;