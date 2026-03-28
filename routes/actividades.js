import { Router } from "express";
const router = Router();
import pool from "../db/index.js";

// POST /api/actividades
router.post("/", async (req, res, next) => {
  try {
    const {
      sede_id, entrenador_id, nombre_actividad, tipo_actividad,
      descripcion, cupo_maximo, costo, fecha_hora_inicio, fecha_hora_fin, estado_actividad
    } = req.body;

    const result = await pool.query(
      `INSERT INTO actividad 
       (sede_id, entrenador_id, nombre_actividad, tipo_actividad, descripcion, 
        cupo_maximo, costo, fecha_hora_inicio, fecha_hora_fin, estado_actividad)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [sede_id, entrenador_id, nombre_actividad, tipo_actividad, descripcion,
       cupo_maximo, costo, fecha_hora_inicio, fecha_hora_fin, estado_actividad]
    );

    res.status(201).json({ mensaje: "Actividad creada correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// GET /all
router.get("/all", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM actividad ORDER BY actividad_id ASC");

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "No hay actividades registradas en FitHub todavía.", 
        data: [] 
      });
    }

    res.json(result.rows);
  } catch (error) {
    next(error); 
  }
});

// GET /filtro/sede
router.get("/filtro/sede", async (req, res, next) => {
  try {
    const { sede_id } = req.query;
    
    if (!sede_id) {
      return res.status(400).json({ error: "Debes proporcionar un sede_id para filtrar" });
    }

    const result = await pool.query("SELECT * FROM actividad WHERE sede_id = $1", [sede_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron actividades para esta sede" });
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
    const result = await pool.query("SELECT * FROM actividad WHERE actividad_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "La actividad solicitada no fue encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      nombre_actividad, tipo_actividad, descripcion, 
      cupo_maximo, costo, fecha_hora_inicio, fecha_hora_fin, estado_actividad 
    } = req.body;

    const result = await pool.query(
      `UPDATE actividad 
       SET nombre_actividad = $1, tipo_actividad = $2, descripcion = $3, 
           cupo_maximo = $4, costo = $5, fecha_hora_inicio = $6, 
           fecha_hora_fin = $7, estado_actividad = $8
       WHERE actividad_id = $9
       RETURNING *`,
      [nombre_actividad, tipo_actividad, descripcion, cupo_maximo, costo, 
       fecha_hora_inicio, fecha_hora_fin, estado_actividad, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }
    res.json({ mensaje: "Actividad actualizada correctamente", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE lógico
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE actividad SET estado_actividad = 'Cancelada' WHERE actividad_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }
    res.json({ message: "Actividad eliminada lógicamente", actividad: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;