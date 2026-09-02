let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const gridProductos = document.getElementById("grid-productos");
  const cartBtn = document.getElementById("cart-btn");
  const closeModal = document.getElementById("close-modal");
  const cartModal = document.getElementById("cart-modal");
  const btnCheckout = document.getElementById("btn-checkout");

  const metodoEntregaSelect = document.getElementById("metodo-entrega");
  const clienteDireccionInput = document.getElementById("cliente-direccion");

  metodoEntregaSelect.addEventListener("change", (e) => {
    if (e.target.value === "envio") {
      clienteDireccionInput.classList.remove("hidden");
    } else {
      clienteDireccionInput.classList.add("hidden");
    }
  });

  function renderizarProductos() {
    gridProductos.innerHTML = "";

    productos.forEach((prod) => {
      const card = document.createElement("div");
      card.classList.add("card-producto");

      card.innerHTML = `
        ${prod.imagen ? `<img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">` : ''}
        <div class="card-body">
          <div>
            <h3>${prod.nombre}</h3>
            <span class="badge-porciones">🍰 ${prod.porciones}</span>
            <p>${prod.descripcion}</p>
          </div>
          <div class="card-footer">
            <span class="precio">$${prod.precio.toLocaleString("es-AR")}</span>
            <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">
              Agregar
            </button>
          </div>
        </div>
      `;

      gridProductos.appendChild(card);
    });
  }

  cartBtn.addEventListener("click", () => cartModal.classList.add("active"));
  closeModal.addEventListener("click", () => cartModal.classList.remove("active"));

  btnCheckout.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const nombre = document.getElementById("cliente-nombre").value.trim();
    const metodoEntrega = metodoEntregaSelect.value;
    const direccion = clienteDireccionInput.value.trim();
    const metodoPago = document.getElementById("metodo-pago").value;

    if (!nombre) {
      alert("Por favor ingresa tu nombre.");
      return;
    }

    if (metodoEntrega === "envio" && !direccion) {
      alert("Por favor ingresa tu dirección de entrega.");
      return;
    }

    let mensaje = `¡Hola Cacao y Luna! 🍰\nQuiero realizar el siguiente pedido:\n\n`;
    let total = 0;

    carrito.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      mensaje += `• ${item.cantidad}x ${item.nombre} ($${subtotal.toLocaleString("es-AR")})\n`;
    });

    mensaje += `\n*Total:* $${total.toLocaleString("es-AR")}\n`;
    mensaje += `\n*Cliente:* ${nombre}`;
    mensaje += `\n*Entrega:* ${metodoEntrega === "envio" ? `Envío a domicilio (${direccion})` : "Retiro en local"}`;
    mensaje += `\n*Método de Pago:* ${metodoPago}`;

    const telefono = "5492612712021"; // Cambiar por el número real
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  });

  renderizarProductos();
});

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const existe = carrito.find((item) => item.id === id);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarritoUI();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find((p) => p.id === id);

  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      carrito = carrito.filter((p) => p.id !== id);
    }
  }

  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = totalCantidad;

  cartItems.innerHTML = "";

  if (carrito.length === 0) {
    cartItems.innerHTML = `<p style="text-align: center; color: #7d6b82; padding: 20px 0;">El carrito está vacío 🧁</p>`;
  } else {
    carrito.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.nombre}</h4>
          <p>$${(item.precio * item.cantidad).toLocaleString("es-AR")}</p>
        </div>
        <div class="cart-item-controls">
          <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)">-</button>
          <span>${item.cantidad}</span>
          <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)">+</button>
        </div>
      `;

      cartItems.appendChild(div);
    });
  }

  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  cartTotal.textContent = `$${totalPrecio.toLocaleString("es-AR")}`;
}