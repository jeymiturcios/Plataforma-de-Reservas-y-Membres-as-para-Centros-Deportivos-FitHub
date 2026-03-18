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

module.exports = router;