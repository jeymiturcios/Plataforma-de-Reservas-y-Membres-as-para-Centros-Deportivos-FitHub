// routes/reservas.js

const express = require("express");
const router = express.Router();
const pool = require("../db");

const {
  validarReservaDuplicada,
  validarCupo
} = require("../middleware/validation");

// CREATE (POST)
router.post("/", validarReservaDuplicada, validarCupo, async (req, res, next) => {
  try {
    const { persona_id, actividad_id } = req.body;
    const nueva = await pool.query(
      `INSERT INTO reservas (persona_id, actividad_id, estado)
       VALUES ($1, $2, 'creada')
       RETURNING *`,
      [persona_id, actividad_id]
    );
    res.json(nueva.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE lógico de reserva
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cambia el estado_reserva a 'Cancelada' (eliminación lógica)
    const result = await pool.query(
      `UPDATE reserva SET estado_reserva = 'Cancelada' WHERE reserva_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva eliminada lógicamente', reserva: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;