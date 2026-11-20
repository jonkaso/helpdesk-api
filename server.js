const express = require('express');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

const app = express();
const PUERTO = 5082;

app.use(express.json());

// Pinto cada petición en consola: verde si va bien (2xx), rojo si es error del cliente (4xx)
app.use((req, res, next) => {
  res.on('finish', () => {
    const linea = `${req.method} ${req.originalUrl} ${res.statusCode}`;
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(pc.green(linea));
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      console.log(pc.red(linea));
    } else {
      console.log(linea);
    }
  });
  next();
});

// Los datos se guardan en ficheros JSON dentro de DATOS_API
const RUTA_INCIDENCIAS = path.join(__dirname, 'DATOS_API', 'incidencias.json');
const RUTA_CLIENTES = path.join(__dirname, 'DATOS_API', 'clientes.json');

const leer = (ruta) => JSON.parse(fs.readFileSync(ruta, 'utf8'));
const guardar = (ruta, datos) =>
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), 'utf8');

let incidencias = leer(RUTA_INCIDENCIAS);
let clientes = leer(RUTA_CLIENTES);

// ---------- INCIDENCIAS ----------
app.get('/api/incidencias', (req, res) => {
  res.status(200).json(incidencias);
});

app.get('/api/incidencias/:codigo', (req, res) => {
  const incidencia = incidencias.find((i) => i.codigo === req.params.codigo);
  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }
  res.json(incidencia);
});

app.post('/api/incidencias', (req, res) => {
  const { titulo, prioridad, fecha, descripcion } = req.body;

  const ultimo = incidencias.reduce(
    (max, i) => Math.max(max, parseInt(i.codigo.slice(1), 10)),
    0
  );

  const nueva = {
    codigo: 'H' + String(ultimo + 1).padStart(3, '0'),
    titulo,
    prioridad,
    fecha,
    descripcion,
    estado: 'Pendiente',
  };

  incidencias.push(nueva);
  guardar(RUTA_INCIDENCIAS, incidencias);
  res.status(201).json(nueva);
});

// ---------- CLIENTES ----------
app.get('/api/clientes', (req, res) => {
  res.json(clientes);
});

app.get('/api/clientes/:id', (req, res) => {
  const cliente = clientes.find((c) => c.id === Number(req.params.id));
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  res.json(cliente);
});

app.post('/api/clientes', (req, res) => {
  const { nombre, email, telefono } = req.body;
  const id = clientes.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const nuevo = { id, nombre, email, telefono };
  clientes.push(nuevo);
  guardar(RUTA_CLIENTES, clientes);
  res.status(201).json(nuevo);
});

app.put('/api/clientes/:id', (req, res) => {
  const pos = clientes.findIndex((c) => c.id === Number(req.params.id));
  if (pos === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  const { nombre, email, telefono } = req.body;
  clientes[pos] = { id: clientes[pos].id, nombre, email, telefono };
  guardar(RUTA_CLIENTES, clientes);
  res.json(clientes[pos]);
});

app.delete('/api/clientes/:id', (req, res) => {
  const pos = clientes.findIndex((c) => c.id === Number(req.params.id));
  if (pos === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  clientes.splice(pos, 1);
  guardar(RUTA_CLIENTES, clientes);
  res.status(204).end();
});

app.listen(PUERTO, () => {
  console.log(pc.cyan(`API escuchando en http://127.0.0.1:${PUERTO}/`));
});