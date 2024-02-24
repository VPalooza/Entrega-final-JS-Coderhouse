document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("table tbody");
    const comprarBoton = document.getElementById("comprar");

    function recuperarCarrito() {
        return JSON.parse(localStorage.getItem("miCarrito")) || [];
    }

    let carrito = recuperarCarrito();

    function armarFilaHTML(producto) {
        return `<tr>
            <td><img src="${producto.imagen}" /></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td data-id="${producto.id}" class="eliminar-item" title="Eliminar"><button><i class="fa-solid fa-circle-xmark"></i></button></td>
        </tr>`;
    }

    function actualizarTabla() {
        tableBody.innerHTML = carrito.length > 0 ? (
            carrito.map(producto => armarFilaHTML(producto)).join('')
        ) : (
            "<tr><td colspan='4'>El carrito está vacío</td></tr>"
        );
        actualizarTotalEnTabla();
    }
    
    function calcularTotal() {
        let total = 0;
        carrito ? (
            carrito.forEach(producto => total += producto.precio || 0)
        ) : null;
        return total.toFixed(2);
    }
    
    function actualizarTotalEnTabla() {
        const totalElement = document.querySelector("table tfoot tr td:nth-child(3)");
        totalElement.textContent = `$ ${calcularTotal()}`;
    }

    function eliminarItemDelCarrito(itemId) {
        const indice = carrito.findIndex((producto) => producto.id === itemId);
        
        indice !== -1 ? (
            carrito.splice(indice, 1),
            localStorage.setItem("miCarrito", JSON.stringify(carrito)),
            actualizarTabla()
        ) : null;
    }
    

    // Event listener para eliminar un ítem del carrito
    tableBody.addEventListener("click", (event) => {
        event.target.tagName === "I" ? (
            eliminarItemDelCarrito(parseInt(event.target.parentElement.parentElement.dataset.id))
        ) : null;
    });

    // Event listener para el botón de comprar
    comprarBoton.addEventListener("click", () => {
        graciasCompra();
        localStorage.removeItem("miCarrito");
        carrito = [];
        actualizarTabla();
        comprarBoton.setAttribute("disabled", "true");
    });

    // Actualizar la tabla al cargar la página
    actualizarTabla();
});


function graciasCompra(){
    Swal.fire({
        icon: 'success',
        title: 'Compra exitosa',
        text: 'Muchas gracias por comprar con nosotros. 🤩',
        confirmButtonText: '¡Muy bien!',
    })
}
