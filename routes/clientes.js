// routes/clientes.js

const express = require("express");
const router = express.Router();
const pool = require("../db");

// DELETE lógico de cliente
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cambia el estado_cliente a 'Inactivo' (eliminación lógica)
    const result = await pool.query(
      `UPDATE cliente SET estado_cliente = 'Inactivo' WHERE persona_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado lógicamente', cliente: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
