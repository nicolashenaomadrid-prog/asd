// === CONSTANTES ===
const WHATSAPP_NUMBER = "573226494630"; // Formato internacional sin +

// === CLASE PRODUCTO ===
class Producto {
  constructor(id, nombre, precio, imagen, categoria, notas) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
    this.categoria = categoria;
    this.notas = notas;
  }
}

// === CLASE CARRITO ===
class Carrito {
  constructor() {
    this.items = [];
  }

  agregarProducto(producto, cantidad = 1) {
    const existingItem = this.items.find(item => item.producto.id === producto.id);
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    this.renderizar();
    this.mostrarNotificacion(`¡${producto.nombre} añadido al carrito!`);
  }

  eliminarProducto(id) {
    const product = this.items.find(item => item.producto.id === id)?.producto;
    this.items = this.items.filter(item => item.producto.id !== id);
    this.renderizar();
    if (product) this.mostrarNotificacion(`${product.nombre} eliminado`);
  }

  actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      this.eliminarProducto(id);
    } else {
      const item = this.items.find(item => item.producto.id === id);
      if (item) {
        item.cantidad = nuevaCantidad;
      }
      this.renderizar();
    }
  }

  calcularTotal() {
    return this.items.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

  contarItems() {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  vaciarCarrito() {
    this.items = [];
    this.renderizar();
  }

  finalizarCompraWhatsApp() {
    if (this.items.length === 0) {
      this.mostrarNotificacion("El carrito está vacío");
      return;
    }

    let mensaje = "Hola AURUM, me gustaría realizar el siguiente pedido:%0A%0A";
    this.items.forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.producto.nombre} (${item.producto.precio.toLocaleString('es-CO')} COP)%0A`;
    });
    mensaje += `%0ATotal: ${this.calcularTotal().toLocaleString('es-CO')} COP%0A%0A¡Quedo atento!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank');
    
    this.vaciarCarrito();
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('visible');
    this.mostrarNotificacion("¡Redirigiendo a WhatsApp!");
  }

  renderizar() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Tu carrito de lujo está vacío</p>
        </div>`;
    } else {
      cartItemsContainer.innerHTML = this.items.map(item => cartItemTemplate(item)).join('');
    }

    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.textContent = `${this.calcularTotal().toLocaleString('es-CO')} COP`;

    const cartCounterElement = document.getElementById('cart-counter');
    cartCounterElement.textContent = this.contarItems();
  }

  mostrarNotificacion(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${mensaje}</span>
    `;
    
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
    } else {
      document.body.appendChild(toast);
    }

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

// === CLASE TIENDA ===
class Tienda {
  constructor() {
    this.carrito = new Carrito();
    this.productos = [];
    this.categoriaActiva = 'todos';
  }

  init() {
    this.cargarProductos();
    this.renderizarCatalogo();
    this.bindEvents();
  }

  cargarProductos() {
    // Utilizando imágenes reales de alta calidad de Unsplash para fragancias
    this.productos = [
      new Producto(1, "Lattafa Sublime", 289000, "img/roja.jpeg", "orientales", ["Oud", "Ámbar", "Vainilla"]),
      new Producto(2, "Lattafa Negra Oud", 195000, "img/negra.jpeg", "florales", ["Rosa", "Jazmín", "Almizcle"]),
      new Producto(3, "Lattafa Eternal Oud ", 245000, "img/eternal.jpeg", "amaderados", ["Cedro", "Musgo", "Vetiver"]),
      new Producto(4, "Lattafa Haya", 175000, "img/haya.jpeg", "frescos", ["Bergamota", "Lima", "Sal Marina"]),
      new Producto(5, "Lattafa Hayaati", 320000, "img/hayaati.jpeg", "orientales", ["Miel", "Canela", "Pachulí"]),
      new Producto(6, "Il Bee", 210000, "img/ilbee.jpeg", "florales", ["Cerezo", "Lichi", "Sándalo"]),
      new Producto(7, "Il Ego", 265000, "img/ilego.jpeg", "amaderados", ["Cuero", "Haya", "Tabaco"]),
      new Producto(8, "Il Fin", 155000, "img/ilfin.jpeg", "frescos", ["Limón", "Pomelo", "Menta"]),
      new Producto(9, "Il Mexico", 275000, "img/ilmexico.jpeg", "florales", ["Rosa Turca", "Pimienta", "Pachulí"]),
      new Producto(10, "Il Rose", 350000, "img/ilrose.jpeg", "orientales", ["Ámbar Gris", "Incienso", "Mirra"]),
      new Producto(11, "Carolina Herrera", 220000, "img/carolinah.jpeg", "amaderados", ["Vetiver", "Bergamota", "Nuez Moscada"]),
      new Producto(12, "212 Sexy", 165000, "img/carolinah2.jpeg", "frescos", ["Agua de Coco", "Mandarina", "Loto"])
    ];
  }

  productosFiltrados() {
    if (this.categoriaActiva === 'todos') {
      return this.productos;
    }
    return this.productos.filter(p => p.categoria === this.categoriaActiva);
  }

  renderizarCatalogo() {
    const productGrid = document.getElementById('product-grid');
    // Pequeño truco visual para reiniciar animaciones
    productGrid.innerHTML = '';
    
    setTimeout(() => {
      productGrid.innerHTML = this.productosFiltrados().map(p => productCardTemplate(p)).join('');
    }, 50);
  }

  filtrarPorCategoria(categoria) {
    this.categoriaActiva = categoria;
    
    const filterButtons = document.querySelectorAll('#filter-bar button');
    filterButtons.forEach(btn => {
      if (btn.dataset.categoria === categoria) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderizarCatalogo();
  }

  comprarDirectoWhatsApp(id) {
    const producto = this.productos.find(p => p.id === id);
    if (!producto) return;

    const mensaje = `Hola AURUM, estoy muy interesado en adquirir el perfume *${producto.nombre}* (${producto.precio.toLocaleString('es-CO')} COP). ¿Me podrían dar más información?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  bindEvents() {
    const cartIcon = document.getElementById('cart-icon-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const filterBar = document.getElementById('filter-bar');
    const productGrid = document.getElementById('product-grid');
    const cartItemsContainer = document.getElementById('cart-items');

    const toggleSidebar = () => {
      cartSidebar.classList.toggle('open');
      if (cartSidebar.classList.contains('open')) {
        cartOverlay.classList.add('visible');
      } else {
        cartOverlay.classList.remove('visible');
      }
    };

    const closeSidebar = () => {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('visible');
    };

    cartIcon.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    cartOverlay.addEventListener('click', closeSidebar);

    btnVaciar.addEventListener('click', () => {
      this.carrito.vaciarCarrito();
    });

    btnFinalizar.addEventListener('click', () => {
      this.carrito.finalizarCompraWhatsApp();
    });

    filterBar.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const categoria = e.target.dataset.categoria;
        this.filtrarPorCategoria(categoria);
      }
    });

    productGrid.addEventListener('click', (e) => {
      const btnAgregar = e.target.closest('.btn-agregar');
      const btnWa = e.target.closest('.btn-wa-card');

      if (btnAgregar) {
        const id = parseInt(btnAgregar.dataset.id, 10);
        const producto = this.productos.find(p => p.id === id);
        if (producto) {
          this.carrito.agregarProducto(producto);
        }
      } else if (btnWa) {
        const id = parseInt(btnWa.dataset.id, 10);
        this.comprarDirectoWhatsApp(id);
      }
    });

    cartItemsContainer.addEventListener('click', (e) => {
      const btnEliminar = e.target.closest('.btn-eliminar');
      const qtyBtn = e.target.closest('.qty-btn');

      if (btnEliminar) {
        const id = parseInt(btnEliminar.dataset.id, 10);
        this.carrito.eliminarProducto(id);
      } else if (qtyBtn) {
        const id = parseInt(qtyBtn.dataset.id, 10);
        const delta = parseInt(qtyBtn.dataset.delta, 10);
        const currentItem = this.carrito.items.find(item => item.producto.id === id);
        if (currentItem) {
          this.carrito.actualizarCantidad(id, currentItem.cantidad + delta);
        }
      }
    });
  }
}

// === TEMPLATES ===
const productCardTemplate = (producto) => `
  <article class="product-card">
    <div class="product-image">
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
    </div>
    <div class="product-info">
      <h3>${producto.nombre}</h3>
      <div class="product-notas">
        ${producto.notas.map(nota => `<span class="nota-pill">${nota}</span>`).join('')}
      </div>
      <div class="product-footer">
        <span class="product-price">${producto.precio.toLocaleString('es-CO')} COP</span>
        <div class="card-actions">
          <button class="btn-agregar" data-id="${producto.id}" title="Añadir al carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
          <button class="btn-wa-card" data-id="${producto.id}" title="Comprar por WhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Comprar
          </button>
        </div>
      </div>
    </div>
  </article>
`;

const cartItemTemplate = (item) => `
  <div class="cart-item">
    <div class="cart-item-image">
      <img src="${item.producto.imagen}" alt="${item.producto.nombre}">
    </div>
    <div class="cart-item-details">
      <h4>${item.producto.nombre}</h4>
      <span class="cart-item-price">${item.producto.precio.toLocaleString('es-CO')} COP</span>
      <div class="cart-item-actions">
        <div class="quantity-stepper">
          <button class="qty-btn" data-id="${item.producto.id}" data-delta="-1">-</button>
          <span class="qty-display">${item.cantidad}</span>
          <button class="qty-btn" data-id="${item.producto.id}" data-delta="1">+</button>
        </div>
        <button class="btn-eliminar" data-id="${item.producto.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  </div>
`;

// === INIT ===
const tienda = new Tienda();
document.addEventListener('DOMContentLoaded', () => tienda.init());
