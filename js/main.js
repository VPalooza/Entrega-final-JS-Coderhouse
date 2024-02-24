// Carrito

function recuperarCarrito() {
    return localStorage.getItem("miCarrito") === null ? [] : JSON.parse(localStorage.getItem("miCarrito"));
}

const URL = "./js/productos.json"

const productos = []

const carrito = recuperarCarrito() || [];

// Enlazarse con elementos

const contenedor = document.querySelector(".container");

const btnCarrito = document.querySelector("i#carrito-icon");

// Funciones para hacer dinámico el código HTML+CSS

function retornarItemLista(producto) {
    return ` <div class="caja caja1">
<h2>${producto.nombre}</h2>
<ul>
<img src=${producto.imagen} />
<li class="item-ingredientes"><b>Ingredientes</b>: ${producto.ingredientes}</li>
<li class="item-porciones"><b>Porciones</b>: ${producto.porciones}</li>
<li class="item-precio"><b>Precio</b>:${producto.precio}</li>
</ul>
<button class="comprar" id="${producto.id}">AÑADIR AL CARRITO</button>
</div>`;
}

function devuelveError() {
    return `<div class="error-carta">
    <i class="fa-solid fa-circle-exclamation fa-beat"></i>
    <p class="text-error-carta">
        ¡Lo sentimos! Ha ocurrido un error.
    </p>
</div>`;
}

// Funciones para filtro de búsqueda

const searchInput = document.querySelector("#buscar-cosas");

function performSearch() {
    const searchTerm = searchInput.value.trim().toUpperCase();
    const resultado = productos.filter(
        (producto) =>
        producto.nombre.toUpperCase().includes(searchTerm) ||
        producto.ingredientes.toUpperCase().includes(searchTerm)
    );

    resultado.length > 0 ? llenarCarrito(resultado) : llenarCarrito([]);
}

searchInput.addEventListener("keypress", (e) => {
    (e.key === "Enter" && searchInput.value.trim() !== "") ? performSearch() : null;
});

document.querySelector("#buscar-item-boton").addEventListener("click", () => {
    (searchInput.value.trim() !== "") ? performSearch() : null;
});

searchInput.addEventListener("input", () => {
    (searchInput.value.trim() === "") ? llenarCarrito(productos) : null;
});

// Funciones para la compra y añadidura de elementos al carrito

function clickBotonesComprar() {
    const botonesCompra = document.querySelectorAll("button.comprar");

    for (let boton of botonesCompra) {
        boton.addEventListener("click", () => {
            const productoSeleccionado = productos.find(
                (producto) => producto.id === parseInt(boton.id)
            );
            carrito.push(productoSeleccionado);
            updateCartBadge();
            localStorage.setItem("miCarrito", JSON.stringify(carrito));
            notificar(`${productoSeleccionado.nombre} se ha añadido al carrito `, 'rgb(231, 137, 94)')
        });
    }
}

// Funciones para crear las cartas de los productos
function createCajaElement(producto) {
    const cajaElement = document.createElement("div");
    cajaElement.classList.add("caja", "caja1");

    cajaElement.innerHTML = retornarItemLista(producto);

    return cajaElement;
}

function llenarCarrito(array) {
    const container = document.querySelector(".container");

    // Limpiar el contenedor
    container.innerHTML = "";

    if (array.length > 0) {
        // Mostrar los productos si hay alguno
        array.forEach((producto) => {
            const cajaElement = createCajaElement(producto);
            container.appendChild(cajaElement);
        });
        clickBotonesComprar();
        
        // Remover la caja de error si existe
        const errorCaja = document.querySelector(".error-carta");
        if (errorCaja) {
            errorCaja.remove();
        }
    } else {
        // Mostrar la caja de error solo si no hay productos
        const errorCaja = document.querySelector(".error-carta");
        if (!errorCaja) {
            const newErrorCaja = document.createElement("div");
            newErrorCaja.classList.add("error-carta");
            newErrorCaja.innerHTML = devuelveError();
            // Insertar la caja de error dentro del contenedor
            container.appendChild(newErrorCaja);
        }
    }
}


// llenarCarrito(productos);

function obtenerProductos() {
    return fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            return response.json();
        })
        .then((data) => {
            productos.push(...data);
            llenarCarrito(productos);
        })
        .catch((error) => {
            console.error(error);
            const errorCaja = document.querySelector(".error-carta");
            if (!errorCaja) {
                const newErrorCaja = document.createElement("div");
                newErrorCaja.classList.add("error-carta");
                newErrorCaja.innerHTML = devuelveError();
                contenedor.appendChild(newErrorCaja);
            }
        });
}

obtenerProductos(); // !!! FUNCIÓN PRINCIPAL

// Tooltip para mostrar info sobre el icono del carrito
btnCarrito.addEventListener("mousemove", () => {
    carrito.length > 0 ? btnCarrito.title = carrito.length + " producto(s) en el carrito" :
        btnCarrito.title = "Ir al carrito";
});

btnCarrito.addEventListener("click", () => {
    carrito.length > 0 ? location.href = "./pages/checkout.html" :
        advertenciaCarrito();
})

function updateCartBadge() {
    const cartBadge = document.querySelector(".cart-badge");

    !cartBadge ? (() => {
        const marketIcon = document.querySelector(".market-icon");
        const badgeElement = document.createElement("span");
        badgeElement.className = "cart-badge";
        marketIcon.appendChild(badgeElement);
    })() : null;

    const updatedBadge = document.querySelector(".cart-badge");
    carrito.length > 0 ? (
        updatedBadge.style.display = "block",
        updatedBadge.textContent = carrito.length
    ) : (
        updatedBadge.style.display = "none"
    );
}


updateCartBadge();

function advertenciaCarrito() {
    Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: '⛔¡Debes agregar al menos un producto!',
        confirmButtonText: 'Entendido',
    })
}

function notificar(mensaje, estilo) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        style: {
            background: estilo
        },
    }).showToast()
}
