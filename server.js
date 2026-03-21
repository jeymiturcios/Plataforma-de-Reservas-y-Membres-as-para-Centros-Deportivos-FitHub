import express from 'express';
import { validarUsuario } from './middleware/validation.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// RUTA DE PRUEBA (POSTMAN)
app.post('/test', (req, res) => {
  console.log(req.body);
  res.json({
    mensaje: 'Datos recibidos',
    data: req.body
  });
});

//RUTA CON VALIDACIONES
app.post('/usuarios', validarUsuario, (req, res) => {
  res.json({
    mensaje: "Usuario válido",
    data: req.body
  });
});

// MANEJO DE ERRORES 
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});