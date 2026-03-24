// routes/actividades.js

const express = require("express");
const router = express.Router();
const pool = require("../db");

// DELETE lógico de actividad
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cambia el estado_actividad a 'Cancelada' (eliminación lógica)
    const result = await pool.query(
      `UPDATE actividad SET estado_actividad = 'Cancelada' WHERE actividad_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json({ message: 'Actividad eliminada lógicamente', actividad: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
