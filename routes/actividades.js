import { Router } from "express";
const router = Router();
import pool from "../db";

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

export default router;