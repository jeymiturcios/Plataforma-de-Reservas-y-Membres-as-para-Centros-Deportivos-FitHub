import pool from "../db/index.js";

export const validarUsuario = (req, res, next) => {
  const { nombre, correo, telefono } = req.body;

  if (!nombre || nombre.trim().length < 3) {
    return res.status(400).json({ error: "Nombre inválido" });
  }

  if (!correo || !correo.includes("@")) {
    return res.status(400).json({ error: "Correo inválido" });
  }

  if (!telefono || telefono.trim().length < 8) {
    return res.status(400).json({ error: "Teléfono inválido" });
  }

  next();
};

export const validarReservaDuplicada = async (req, res, next) => {
  try {
    const { cliente_id, actividad_id } = req.body;

    if (!cliente_id || !actividad_id) {
      return res.status(400).json({
        error: "cliente_id y actividad_id son obligatorios"
      });
    }

    const existe = await pool.query(
      `SELECT reserva_id
       FROM reserva
       WHERE cliente_id = $1 AND actividad_id = $2`,
      [cliente_id, actividad_id]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: "Reserva duplicada"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validarCupo = async (req, res, next) => {
  try {
    const { actividad_id } = req.body;

    const actividad = await pool.query(
      `SELECT cupo_maximo
       FROM actividad
       WHERE actividad_id = $1`,
      [actividad_id]
    );

    if (actividad.rows.length === 0) {
      return res.status(404).json({
        error: "Actividad no encontrada"
      });
    }

    const reservas = await pool.query(
      `SELECT COUNT(*) AS total
       FROM reserva
       WHERE actividad_id = $1`,
      [actividad_id]
    );

    const totalReservas = parseInt(reservas.rows[0].total, 10);
    const cupoMaximo = actividad.rows[0].cupo_maximo;

    if (totalReservas >= cupoMaximo) {
      return res.status(400).json({
        error: "Cupo lleno"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};