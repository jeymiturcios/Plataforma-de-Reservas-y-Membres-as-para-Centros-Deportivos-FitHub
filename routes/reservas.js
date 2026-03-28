// 1. GET General (/all) - Lista de todas las reservas
router.get("/all", async (req, res, next) => {
  try {
    // Nota: Usamos JOIN para que Johan vea nombres en lugar de solo IDs
    const result = await pool.query(`
      SELECT r.*, a.nombre_actividad, p.nombre as nombre_cliente
      FROM reserva r
      JOIN actividad a ON r.actividad_id = a.actividad_id
      JOIN persona p ON r.persona_id = p.persona_id
      ORDER BY r.fecha_reserva DESC
    `);

    // B. Validación de "Base de Datos Vacía"
    if (result.rows.length === 0) {
      return res.status(200).json({ 
        message: "No hay reservas registradas en el sistema.", 
        data: [] 
      });
    }

    res.json(result.rows);
  } catch (error) {
    // C. Manejo de Errores del Servidor (500)
    next(error);
  }
});

// 2. GET por ID (/:id) - Detalle de una reserva específica
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM reserva WHERE reserva_id = $1", [id]);

    // A. Validación de "No Encontrado" (404)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "La reserva solicitada no fue encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 3. GET con Filtro - Reservas por fecha específica
// Ejemplo en Postman: /api/reservas/filtro/fecha?dia=2026-03-27
router.get("/filtro/fecha", async (req, res, next) => {
  try {
    const { dia } = req.query; // Capturamos la fecha desde el Query String (?dia=...)
    
    if (!dia) {
      return res.status(400).json({ error: "Debes proporcionar una fecha válida (?dia=YYYY-MM-DD)" });
    }

    const result = await pool.query(
      "SELECT * FROM reserva WHERE fecha_reserva::date = $1", 
      [dia]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No se encontraron reservas para el día ${dia}` });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;

const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reservas");

       
        if (rows.length === 0) {
            return res.status(200).json({ 
                message: "Consulta exitosa, pero la tabla de reservas está vacía actualmente.",
                data: [] 
            });
        }

        res.status(200).json(rows);
    } catch (error) {
        
        res.status(500).json({ 
            error: "Error interno del servidor al obtener las reservas",
            sqlError: error.message 
        });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM reservas WHERE id = ?", [id]);

    
        if (rows.length === 0) {
            return res.status(404).json({ 
                error: `La reserva con ID ${id} no fue encontrada.` 
            });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        
        res.status(500).json({ 
            error: "Error al procesar la búsqueda por ID",
            sqlError: error.message 
        });
    }
});



      
        res.status(500).json({ 
            error: "Error al filtrar las reservas por sede",
            sqlError: error.message 
        });
    }
});

module.exports = router;
