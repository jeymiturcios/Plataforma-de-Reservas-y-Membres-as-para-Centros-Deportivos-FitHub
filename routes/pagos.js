// routes/pagos.js

const express = require("express");
const router = express.Router();
const pool = require("../db");

// DELETE lógico de pago
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // No hay campo de estado en pago, así que solo marcamos como "Eliminado" en referencia
    const result = await pool.query(
      `UPDATE pago SET referencia = 'Eliminado' WHERE pago_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago eliminado lógicamente', pago: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
