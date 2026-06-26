// ── Servidor Express — Atalaya Studio ────────────────────
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app     = express();
// Render (y otros hostings) asignan el puerto por variable de entorno.
// En local usa 3000 como respaldo.
const PUERTO  = process.env.PORT || 3000;
const RUTA_COMENTARIOS = path.join(__dirname, 'comentario.json');

// ── Middlewares ───────────────────────────────────────────
app.use(cors());                    // permite peticiones desde el frontend
app.use(express.json());            // parsea el body como JSON
//app.use(express.static(__dirname)); // sirve index.html y los JS
app.use(express.static(path.join(__dirname, '..')));
// ── Helpers ───────────────────────────────────────────────

// Lee el archivo comentario.json y devuelve el arreglo
function leerComentarios() {
    try {
        const contenido = fs.readFileSync(RUTA_COMENTARIOS, 'utf-8');
        // Si el archivo está vacío, devuelve arreglo vacío
        return contenido.trim() ? JSON.parse(contenido) : [];
    } catch {
        return []; // si no existe o falla, empieza vacío
    }
}

// Guarda el arreglo en comentario.json con formato legible
function guardarComentarios(comentarios) {
    fs.writeFileSync(RUTA_COMENTARIOS, JSON.stringify(comentarios, null, 2), 'utf-8');
}

// ── Rutas ─────────────────────────────────────────────────

// POST /api/comentarios — recibe el formulario y guarda
app.post('/api/comentarios', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    // Validación básica en el servidor
    if (!nombre || !email || !mensaje) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios: nombre, email y mensaje.'
        });
    }

    // Construimos el nuevo comentario con fecha
    const nuevoComentario = {
        id: Date.now(),
        nombre,
        email,
        mensaje,
        fecha: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })
    };

    // Leemos, añadimos y guardamos
    const comentarios = leerComentarios();
    comentarios.push(nuevoComentario);
    guardarComentarios(comentarios);

    console.log('📩 Nuevo mensaje recibido:', nuevoComentario);

    return res.status(200).json({
        ok: true,
        mensaje: '¡Mensaje guardado correctamente!'
    });
});

// GET /api/comentarios — lista todos los mensajes guardados
app.get('/api/comentarios', (req, res) => {
    const comentarios = leerComentarios();
    res.json(comentarios);
});

// ── Inicio del servidor ───────────────────────────────────
app.listen(PUERTO, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PUERTO}`);
    console.log(`📂 Mensajes se guardan en: ${RUTA_COMENTARIOS}`);
});