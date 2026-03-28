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


router.get("/filtro/cliente", async (req, res, next) => {
  try {
    const { id_cliente } = req.query; 
    
    if (!id_cliente) {
      return res.status(400).json({ error: "Falta el ID del cliente (?id_cliente=X)" });
    }

    const result = await pool.query(
      "SELECT * FROM pago WHERE persona_id = $1 ORDER BY pago_id DESC", 
      [id_cliente]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: `No se encontraron pagos asociados al cliente con ID: ${id_cliente}` 
      });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

