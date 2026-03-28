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

router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM membresia ORDER BY costo ASC");

  
    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "No hay membresías registradas actualmente.", 
        data: [] 
      });
    }

    res.json(result.rows);
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: "Error interno al obtener el catálogo de membresías" });
  }
});





router.get("/filtro/precio", async (req, res) => {
  try {
    const { maximo } = req.query;
    
    if (!maximo) {
      return res.status(400).json({ error: "Falta el parámetro de precio máximo (?maximo=X)" });
    }

    const result = await pool.query(
      "SELECT * FROM membresia WHERE costo <= $1 ORDER BY costo DESC", 
      [maximo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: `No se encontraron planes que cuesten ${maximo} o menos.` 
      });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al filtrar por presupuesto" });
  }
});

