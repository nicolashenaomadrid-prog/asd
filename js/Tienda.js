import { Producto } from './Producto.js';
import { Carrito } from './Carrito.js';

const WHATSAPP_NUMBER = "573226494630"; // Formato internacional sin +

export class Tienda {
  constructor() {
    this.carrito = new Carrito();
    this.productos = [];
    this.categoriaActiva = 'todos';
    this.productCardTemplate = document.getElementById('product-card-template');
  }

  init() {
    this.cargarProductos();
    this.renderizarCatalogo();
    this.bindEvents();
  }

  cargarProductos() {
    this.productos = [
      new Producto(1, "Noche de Oud", 289000, "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80", "orientales", ["Oud", "Ámbar", "Vainilla"]),
      new Producto(2, "Jardín Blanco", 195000, "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80", "florales", ["Rosa", "Jazmín", "Almizcle"]),
      new Producto(3, "Bosque Eterno", 245000, "https://images.unsplash.com/photo-1595532542520-50fa91e36d08?auto=format&fit=crop&w=600&q=80", "amaderados", ["Cedro", "Musgo", "Vetiver"]),
      new Producto(4, "Brisa Marina", 175000, "https://images.unsplash.com/photo-1616949755610-8c9bac08f9f8?auto=format&fit=crop&w=600&q=80", "frescos", ["Bergamota", "Lima", "Sal Marina"]),
      new Producto(5, "Miel Dorada", 320000, "https://images.unsplash.com/photo-1594303494883-9b2229f379ea?auto=format&fit=crop&w=600&q=80", "orientales", ["Miel", "Canela", "Pachulí"]),
      new Producto(6, "Flor de Cerezo", 210000, "https://images.unsplash.com/photo-1592914610354-fd354d45e5d0?auto=format&fit=crop&w=600&q=80", "florales", ["Cerezo", "Lichi", "Sándalo"]),
      new Producto(7, "Leña y Cuero", 265000, "https://images.unsplash.com/photo-1587556138407-3ce942004245?auto=format&fit=crop&w=600&q=80", "amaderados", ["Cuero", "Haya", "Tabaco"]),
      new Producto(8, "Cítrico Vivo", 155000, "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80", "frescos", ["Limón", "Pomelo", "Menta"]),
      new Producto(9, "Rosa Negra", 275000, "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=600&q=80", "florales", ["Rosa Turca", "Pimienta", "Pachulí"]),
      new Producto(10, "Ámbar Absoluto", 350000, "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?auto=format&fit=crop&w=600&q=80", "orientales", ["Ámbar Gris", "Incienso", "Mirra"]),
      new Producto(11, "Vetiver Puro", 220000, "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80", "amaderados", ["Vetiver", "Bergamota", "Nuez Moscada"]),
      new Producto(12, "Agua Clara", 165000, "https://images.unsplash.com/photo-1615397323136-1e089201a4e1?auto=format&fit=crop&w=600&q=80", "frescos", ["Agua de Coco", "Mandarina", "Loto"])
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
    productGrid.innerHTML = '';
    
    setTimeout(() => {
      this.productosFiltrados().forEach(p => {
        const clone = this.productCardTemplate.content.cloneNode(true);
        
        const img = clone.querySelector('img');
        img.src = p.imagen;
        img.alt = p.nombre;
        
        clone.querySelector('h3').textContent = p.nombre;
        
        const notasContainer = clone.querySelector('.product-notas');
        p.notas.forEach(nota => {
          const span = document.createElement('span');
          span.className = 'nota-pill';
          span.textContent = nota;
          notasContainer.appendChild(span);
        });
        
        clone.querySelector('.product-price').textContent = `${p.precio.toLocaleString('es-CO')} COP`;
        
        clone.querySelector('.btn-agregar').dataset.id = p.id;
        clone.querySelector('.btn-wa-card').dataset.id = p.id;
        
        productGrid.appendChild(clone);
      });
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
