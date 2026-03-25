import { Router } from "express";
import pool from "../db/index.js";

const router = Router();

// Endpoint para actualizar el estado de una membresía
router.patch("/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_membresia } = req.body; // El nuevo estado que viene del frontend

    const resultado = await pool.query(
      `UPDATE membresia 
       SET estado_membresia = $1 
       WHERE membresia_id = $2 
       RETURNING *`,
      [estado_membresia, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Membresía no encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la membresía" });
  }
});

export default router;