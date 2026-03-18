import pool from "../db/index.js";

// VALIDAR USUARIO (para tu ruta /usuarios)
export const validarUsuario = (req, res, next) => {
  const { nombre, email, telefono } = req.body;

  if (!nombre || nombre.length < 3) {
    return res.status(400).json({ error: "Nombre inválido" });
  }

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!telefono || telefono.length < 8) {
    return res.status(400).json({ error: "Teléfono inválido" });
  }

  next();
};

// VALIDAR RESERVA DUPLICADA
export const validarReservaDuplicada = async (req, res, next) => {
  try {
    const { persona_id, actividad_id } = req.body;

    const existe = await pool.query(
      `SELECT * FROM reservas 
       WHERE persona_id = $1 AND actividad_id = $2`,
      [persona_id, actividad_id]
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

// VALIDAR CUPO
export const validarCupo = async (req, res, next) => {
  try {
    const { actividad_id } = req.body;

    const actividad = await pool.query(
      "SELECT cupo_maximo FROM actividades WHERE actividad_id = $1",
      [actividad_id]
    );

    const reservas = await pool.query(
      "SELECT COUNT(*) FROM reservas WHERE actividad_id = $1",
      [actividad_id]
    );

    const total = parseInt(reservas.rows[0].count);
    const max = actividad.rows[0].cupo_maximo;

    if (total >= max) {
      return res.status(400).json({
        error: "Cupo lleno"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};