import { Router } from "express";
const router = Router();
import pool from "../db/index.js";

// UPDATE (PATCH) - Corregir referencia o método de pago
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { referencia, metodo_pago, monto } = req.body;

    const pagoAct = await pool.query(
      `UPDATE pago 
       SET referencia = COALESCE($1, referencia), 
           metodo_pago = COALESCE($2, metodo_pago),
           monto = COALESCE($3, monto)
       WHERE pago_id = $4
       RETURNING *`,
      [referencia, metodo_pago, monto, id]
    );

    if (pagoAct.rows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
    res.json(pagoAct.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE lógico de pago
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // No hay campo de estado en pago, así que solo marcamos como "Eliminado" en referencia
    const result = await pool.query(
      `UPDATE pago SET referencia = 'Eliminado' WHERE pago_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.json({ message: "Pago eliminado lógicamente", pago: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
