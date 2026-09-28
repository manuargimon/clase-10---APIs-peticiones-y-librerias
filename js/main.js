let productos = [];

const contenedorItems = document.getElementById("contenedorItems");
const inputNombre = document.getElementById("inputNombre");
const inputPrecio = document.getElementById("inputPrecio");
const btnAgregar = document.getElementById("btnAgregar");
const btnVaciar = document.getElementById("btnVaciar");
const inputBuscar = document.getElementById("inputBuscar");
const promoBanner = document.getElementById("promoBanner");

function guardarStorage() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function notificar(texto, color) {
  Toastify({
    text: texto,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: { background: color }
  }).showToast();
}

setTimeout(() => {
  promoBanner.textContent = "🔔 Cupon de bienvenida: 15% OFF con el codigo BIENVENIDO15";
  promoBanner.classList.remove("oculto");
}, 4000);

function renderizarProductos(lista) {
  contenedorItems.innerHTML = lista.length === 0 ? "<p class='vacio'>No hay productos para mostrar</p>" : "";

  lista.forEach(producto => {
    const { id, nombre, precio } = producto;

    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div>
        <h3>${nombre}</h3>
        <p>$${precio}</p>
      </div>
      <button class="btnEliminar" data-id="${id}">Eliminar</button>
    `;
    contenedorItems.appendChild(item);
  });
}

async function cargarProductos() {
  try {
    btnAgregar.disabled = true;
    contenedorItems.innerHTML = "<p class='cargando'>Cargando productos...</p>";

    const response = await fetch("./data/productos.json");

    if (!response.ok) {
      throw new Error(`No se pudo cargar el catalogo (error ${response.status})`);
    }

    const data = await response.json();
    productos = JSON.parse(localStorage.getItem("productos")) ?? data;

    renderizarProductos(productos);
    notificar("Productos cargados", "#27ae60");
  } catch (error) {
    contenedorItems.innerHTML = `<p class='error'>No se pudieron cargar los productos: ${error.message}</p>`;
    notificar("Hubo un problema al traer los productos", "#e74c3c");
  } finally {
    btnAgregar.disabled = false;
  }
}

function agregarProducto(nombre, precioTexto) {
  try {
    const precio = Number(precioTexto);

    if (isNaN(precio)) {
      throw new Error("El precio tiene que ser un numero");
    }

    const nuevoProducto = { id: Date.now(), nombre, precio };

    productos.push(nuevoProducto);
    guardarStorage();
    renderizarProductos(productos);
    notificar("Producto agregado", "#27ae60");
  } catch (error) {
    notificar(error.message, "#e74c3c");
  } finally {
    inputNombre.value = "";
    inputPrecio.value = "";
    inputNombre.focus();
  }
}

function eliminarProducto(idTexto) {
  const id = Number(idTexto);
  productos = productos.filter(p => p.id !== id);
  guardarStorage();
  renderizarProductos(productos);
  notificar("Producto eliminado", "#2980b9");
}

function vaciarLista() {
  productos = [];
  guardarStorage();
  renderizarProductos(productos);
  notificar("Se vacio la lista", "#2980b9");
}

btnAgregar.addEventListener("click", () => {
  const nombre = inputNombre.value;
  const precio = inputPrecio.value;
  const camposCompletos = nombre !== "" && precio !== "";

  camposCompletos ? agregarProducto(nombre, precio) : notificar("Completa nombre y precio", "#e74c3c");
});

contenedorItems.addEventListener("click", (event) => {
  const esBotonEliminar = event.target.classList.contains("btnEliminar");
  const id = event.target?.dataset?.id;

  esBotonEliminar && eliminarProducto(id);
});

btnVaciar.addEventListener("click", () => {
  Swal.fire({
    title: "¿Vaciar la lista?",
    text: "Se van a borrar todos los productos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, vaciar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    result.isConfirmed && vaciarLista();
  });
});

inputBuscar.addEventListener("keyup", () => {
  const texto = inputBuscar.value.toLowerCase();
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
  renderizarProductos(filtrados);
});

cargarProductos();