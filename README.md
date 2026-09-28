# clase-10---APIs-peticiones-y-librerias
# Mi Simulador de Tienda

Este es mi proyecto del curso de JavaScript. Es una tienda simulada donde se ven productos, se pueden agregar, eliminar y buscar. En esta ultima entrega los productos ya no estan escritos a mano en el codigo: se traen de un archivo JSON con `fetch`, y los avisos al usuario los hice con librerias.

## Que hace

- Al cargar la pagina trae los productos desde `data/productos.json`
- Mientras carga muestra "Cargando productos..." y si algo falla muestra el error en pantalla
- Muestra los productos en pantalla (nombre y precio)
- Tiene un formulario para agregar un producto nuevo
- Cada producto tiene un boton para eliminarlo
- Tiene un buscador que filtra la lista mientras escribis
- Al tocar "Vaciar todo" pregunta si estas seguro antes de borrar
- Los avisos (producto agregado, eliminado, errores) salen como notificaciones en la esquina
- Los cambios quedan guardados en el localStorage, asi que si recargas no se pierden
- A los 4 segundos de entrar aparece un cartel con un cupon de descuento

## Como lo hice

La funcion `cargarProductos()` es `async`. Hace el `fetch` al JSON con `await`, revisa `response.ok` (porque `fetch` no tira error solo cuando la respuesta es un 404) y despues convierte los datos con `await response.json()`. Todo eso esta adentro de un `try/catch/finally`:

- en el `try` va la peticion
- en el `catch` muestro el error en pantalla y con una notificacion
- en el `finally` vuelvo a habilitar el boton de agregar, que lo deshabilito mientras carga para que nadie agregue algo antes de que lleguen los datos

Si ya habia productos guardados en el localStorage, uso esos en vez de los del JSON (con el operador `??`), asi se respetan los cambios que hizo el usuario.

Para las librerias use dos, las dos desde CDN:

- **Toastify** para los avisos que no interrumpen (agregado, eliminado, errores, carga)
- **SweetAlert2** para la confirmacion de "Vaciar todo", porque es una accion que no se puede deshacer

Con eso saque todos los avisos nativos del navegador.

## Cosas que usé

- `fetch` con `async/await` y `try/catch/finally`
- `response.ok` y `response.json()`
- Archivo JSON local como base de datos
- Toastify y SweetAlert2 (via CDN)
- `getElementById`, `createElement` e `innerHTML` con template strings
- `addEventListener` (click y keyup)
- `localStorage` con `JSON.stringify()` / `JSON.parse()`
- `filter()` y `forEach()`
- Ternario, `&&`, `??`, `?.` y destructuring
- `setTimeout()` para el cupon de bienvenida

## Estructura del proyecto

```
├── index.html
├── css/
│   └── style.css
├── data/
│   └── productos.json
└── js/
    └── main.js
```

## Como probarlo

Como el proyecto usa `fetch` para leer un archivo local, hay que abrirlo con un servidor y no con doble clic en el `index.html` (el navegador lo bloquea). Yo lo probe con la extension **Live Server** de VS Code: click derecho sobre `index.html` y "Open with Live Server".

## Pendiente / a mejorar

- Poder editar un producto ya agregado, no solo eliminarlo
- Conectarlo a una API real de internet en vez de un JSON local