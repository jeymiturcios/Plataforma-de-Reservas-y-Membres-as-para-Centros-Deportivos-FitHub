import express from "express";
import pool from "../db/index.js";
import { validarUsuario } from "../middleware/validation.js";

const router = express.Router();

// GET /api/personas
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM persona ORDER BY persona_id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});
// PUT /api/personas/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      nombre, correo, telefono, 
      dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave 
    } = req.body;

    const result = await pool.query(
      `UPDATE persona 
       SET nombre = $1, correo = $2, telefono = $3, 
           dir_departamento = $4, dir_ciudad = $5, 
           dir_colonia = $6, dir_calle_ave = $7
       WHERE persona_id = $8
       RETURNING *`,
      [nombre, correo, telefono, dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json({ mensaje: "Persona actualizada correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
// POST /api/personas
router.post("/", validarUsuario, async (req, res, next) => {
  try {
    const { nombre, correo, fecha_nacimiento, telefono,
            dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave } = req.body;

    const result = await pool.query(
      `INSERT INTO persona (nombre, correo, fecha_nacimiento, telefono,
        dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nombre, correo, fecha_nacimiento, telefono,
       dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave]
    );

    res.status(201).json({ mensaje: "Persona creada correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});
// DELETE /api/personas/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM persona WHERE persona_id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json({ mensaje: "Persona eliminada correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;