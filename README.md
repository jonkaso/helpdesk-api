# helpdesk-api

API REST hecha con Node.js y Express para llevar las incidencias y los clientes de un servicio de soporte. Ejercicio 2 del examen de PSP.

Los datos no van a una base de datos: se leen y se guardan en `DATOS_API/incidencias.json` y `DATOS_API/clientes.json`.

## Cómo arrancarla

```bash
npm install
npm start
```

Queda escuchando en `http://127.0.0.1:5082/`. En consola sale cada petición en verde si ha ido bien y en rojo si ha dado error 4xx.

## Endpoints

### Incidencias

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/incidencias` | Lista todas |
| GET | `/api/incidencias/:codigo` | Devuelve una (p. ej. `H001`), 404 si no existe |
| POST | `/api/incidencias` | Crea una nueva con código `H00X` y estado `Pendiente` |

### Clientes

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/clientes` | Lista todos |
| GET | `/api/clientes/:id` | Devuelve uno, 404 si no existe |
| POST | `/api/clientes` | Crea uno nuevo |
| PUT | `/api/clientes/:id` | Actualiza nombre, email y teléfono |
| DELETE | `/api/clientes/:id` | Lo borra (204) |

## Probarla

En `pruebas.http` están todas las peticiones listas para lanzarlas con la extensión REST Client de VS Code.
