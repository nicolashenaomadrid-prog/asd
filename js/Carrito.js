const WHATSAPP_NUMBER = "573226494630"; // Formato internacional sin +

export class Carrito {
  constructor() {
    this.items = [];
    this.cartItemTemplate = document.getElementById('cart-item-template');
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
    cartItemsContainer.innerHTML = '';

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
      this.items.forEach(item => {
        const clone = this.cartItemTemplate.content.cloneNode(true);
        
        const img = clone.querySelector('img');
        img.src = item.producto.imagen;
        img.alt = item.producto.nombre;
        
        clone.querySelector('h4').textContent = item.producto.nombre;
        clone.querySelector('.cart-item-price').textContent = `${item.producto.precio.toLocaleString('es-CO')} COP`;
        clone.querySelector('.qty-display').textContent = item.cantidad;
        
        clone.querySelector('.qty-minus').dataset.id = item.producto.id;
        clone.querySelector('.qty-plus').dataset.id = item.producto.id;
        clone.querySelector('.btn-eliminar').dataset.id = item.producto.id;
        
        cartItemsContainer.appendChild(clone);
      });
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
