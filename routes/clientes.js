import { Router } from "express";
const router = Router();
import pool from "../db/index.js";

// UPDATE (PUT) - Modificar datos personales completos
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      nombre, correo, telefono, 
      dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave 
    } = req.body;

    const actualizado = await pool.query(
      `UPDATE persona 
       SET nombre = $1, correo = $2, telefono = $3, 
           dir_departamento = $4, dir_ciudad = $5, 
           dir_colonia = $6, dir_calle_ave = $7
       WHERE persona_id = $8
       RETURNING *`,
      [nombre, correo, telefono, dir_departamento, dir_ciudad, dir_colonia, dir_calle_ave, id]
    );

    if (actualizado.rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(actualizado.rows[0]);
  } catch (error) {
    next(error);
  }
});

// UPDATE (PATCH) - Cambiar solo el estado del cliente (Activo/Inactivo)
router.patch("/:id/estado", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado_cliente } = req.body;

    const estadoAct = await pool.query(
      `UPDATE cliente 
       SET estado_cliente = $1
       WHERE persona_id = $2
       RETURNING *`,
      [estado_cliente, id]
    );

    if (estadoAct.rows.length === 0) {
      return res.status(404).json({ message: "Registro de cliente no encontrado" });
    }
    res.json(estadoAct.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE lógico de cliente
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cambia el estado_cliente a 'Inactivo' (eliminación lógica)
    const result = await pool.query(
      `UPDATE cliente SET estado_cliente = 'Inactivo' WHERE persona_id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado lógicamente', cliente: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
