// Apartado Se encarga ÚNICAMENTE de la interfaz: validar y mostrar mensajes.

// Valida los campos del formulario.
// Devuelve { valido, datos } si todo está bien,
// o { valido: false, error } si algo falla.
export function validarFormulario(formulario) {
    const nombre  = formulario.querySelector('#nombre').value.trim();
    const email   = formulario.querySelector('#correo').value.trim();
    const mensaje = formulario.querySelector('#comentario').value.trim();

    if (!nombre || !email || !mensaje) {
        return { valido: false, error: 'Por favor completa todos los campos.' };
    }

    if (!email.includes('@')) {
        return { valido: false, error: 'Ingresa un correo válido.' };
    }

    return { valido: true, datos: { nombre, email, mensaje } };
}

// Muestra un mensaje usando una NOTIFICACIÓN del ordenador (estilo Google/Chrome).
// Si el usuario no concede permiso o el navegador no las soporta,
// cae de respaldo en la ventana de mensaje clásica (alert).
// tipo: 'ok' o 'error'.
export function mostrarEstado(texto, tipo) {
    const titulo = tipo === 'ok' ? '✅ Comentario enviado' : '⚠️ Atención';
    const opciones = { body: texto };

    // 1) El navegador no soporta notificaciones → ventana clásica
    if (!('Notification' in window)) {
        alert(`${titulo}\n${texto}`);
        return;
    }

    // 2) Ya tenemos permiso concedido → mostramos la notificación
    if (Notification.permission === 'granted') {
        new Notification(titulo, opciones);
        return;
    }

    // 3) Aún no se ha decidido → pedimos permiso y luego mostramos
    if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permiso) => {
            if (permiso === 'granted') {
                new Notification(titulo, opciones);
            } else {
                alert(`${titulo}\n${texto}`); // respaldo si lo rechaza
            }
        });
        return;
    }

    // 4) El permiso está denegado → respaldo con ventana clásica
    alert(`${titulo}\n${texto}`);
}
 
// Pinta la lista de comentarios dentro de #lista-comentarios.
// Usa textContent (no innerHTML) para evitar inyección de código (XSS),
// ya que el contenido lo escriben los usuarios.
export function mostrarComentarios(lista) {
    const contenedor = document.getElementById('lista-comentarios');
    if (!contenedor) return;
 
    contenedor.innerHTML = ''; // limpiamos antes de volver a pintar
 
    // Estado vacío
    if (!lista || lista.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'comentarios-vacio';
        vacio.textContent = 'Aún no hay comentarios. ¡Sé el primero!';
        contenedor.appendChild(vacio);
        return;
    }
 
    // Mostramos los más recientes primero
    [...lista].reverse().forEach((c) => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'comentario';
 
        const cabecera = document.createElement('div');
        cabecera.className = 'comentario-cabecera';
 
        const nombre = document.createElement('span');
        nombre.className = 'comentario-nombre';
        nombre.textContent = c.nombre;
 
        const fecha = document.createElement('time');
        fecha.className = 'comentario-fecha';
        fecha.textContent = c.fecha || '';
 
        cabecera.append(nombre, fecha);
 
        const mensaje = document.createElement('p');
        mensaje.className = 'comentario-mensaje';
        mensaje.textContent = c.mensaje;
 
        tarjeta.append(cabecera, mensaje);
        contenedor.appendChild(tarjeta);
    });
}