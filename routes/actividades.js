import { Router } from "express";
const router = Router();
import pool from "../db/index.js";

// UPDATE (PUT) - Reprogramar actividad completa
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      nombre_actividad, tipo_actividad, descripcion, 
      cupo_maximo, costo, fecha_hora_inicio, fecha_hora_fin, estado_actividad 
    } = req.body;

    const actividadAct = await pool.query(
      `UPDATE actividad 
       SET nombre_actividad = $1, tipo_actividad = $2, descripcion = $3, 
           cupo_maximo = $4, costo = $5, fecha_hora_inicio = $6, 
           fecha_hora_fin = $7, estado_actividad = $8
       WHERE actividad_id = $9
       RETURNING *`,
      [nombre_actividad, tipo_actividad, descripcion, cupo_maximo, costo, fecha_hora_inicio, fecha_hora_fin, estado_actividad, id]
    );

    if (actividadAct.rows.length === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }
    res.json(actividadAct.rows[0]);
  } catch (error) {
    next(error);
  }
});

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

export default router;


// 1. GET General (/all)
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




router.get("/filtro/sede", async (req, res, next) => {
  try {
    const { id_sede } = req.query;
    
    if (!id_sede) {
      return res.status(400).json({ error: "Debes proporcionar un id_sede para filtrar" });
    }

    const result = await pool.query("SELECT * FROM actividad WHERE id_sede = $1", [id_sede]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron actividades para esta sede" });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});