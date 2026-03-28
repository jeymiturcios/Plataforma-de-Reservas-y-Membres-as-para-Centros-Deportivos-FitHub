import { Router } from "express";
const router = Router();
import pool from "../db/index.js";

// POST /api/pagos
router.post("/", async (req, res, next) => {
  try {
    const { reserva_id, membresia_id, monto, fecha_pago, metodo_pago, tipo_pago, referencia } = req.body;

    const result = await pool.query(
      `INSERT INTO pago (reserva_id, membresia_id, monto, fecha_pago, metodo_pago, tipo_pago, referencia)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [reserva_id, membresia_id, monto, fecha_pago, metodo_pago, tipo_pago, referencia]
    );

    res.status(201).json({ mensaje: "Pago registrado correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// GET /all
router.get("/all", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM pago ORDER BY pago_id ASC");

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No se han registrado pagos.", data: [] });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /filtro/cliente
router.get("/filtro/cliente", async (req, res, next) => {
  try {
    const { id_cliente } = req.query;

    if (!id_cliente) {
      return res.status(400).json({ error: "Falta el ID del cliente (?id_cliente=X)" });
    }

    const result = await pool.query(
      "SELECT * FROM pago WHERE persona_id = $1 ORDER BY pago_id DESC", [id_cliente]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No se encontraron pagos del cliente ID: ${id_cliente}` });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM pago WHERE pago_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "El registro de pago no existe" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/// PATCH /:id
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { referencia, metodo_pago, monto } = req.body;

    console.log("Body recibido:", req.body); // ← para verificar

    const result = await pool.query(
      `UPDATE pago 
       SET referencia = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE referencia END,
           metodo_pago = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE metodo_pago END,
           monto = CASE WHEN $3::NUMERIC IS NOT NULL THEN $3::NUMERIC ELSE monto END
       WHERE pago_id = $4
       RETURNING *`,
      [referencia ?? null, metodo_pago ?? null, monto ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.json({ mensaje: "Pago actualizado correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE lógico
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE pago SET referencia = 'Eliminado' WHERE pago_id = $1 RETURNING *`, [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    res.json({ mensaje: "Pago eliminado lógicamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;