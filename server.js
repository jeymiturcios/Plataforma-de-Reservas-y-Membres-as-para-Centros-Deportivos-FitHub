import express from 'express';
import cors from 'cors';
import { validarUsuario } from './middleware/validation.js';
import { errorHandler } from './middleware/errorHandler.js';

import clientesRouter from './routes/clientes.js';
import actividadesRouter from './routes/actividades.js';
import reservasRouter from './routes/reservas.js';
import pagosRouter from './routes/pagos.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.post('/test', (req, res) => {
  console.log(req.body);
  res.json({
    mensaje: 'Datos recibidos',
    data: req.body
  });
});

app.post('/usuarios', validarUsuario, (req, res) => {
  res.json({
    mensaje: 'Usuario válido',
    data: req.body
  });
});

app.use('/clientes', clientesRouter);
app.use('/actividades', actividadesRouter);
app.use('/reservas', reservasRouter);
app.use('/pagos', pagosRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
