# 🧴 AURUM — Instrucciones del Proyecto
> Tienda Virtual de Perfumes | Vanilla JS + POO + DOM

---

## 🎯 Contexto del Proyecto

**AURUM** es una tienda virtual de perfumes de lujo construida con HTML, CSS y JavaScript puro, aplicando Programación Orientada a Objetos (POO) y manipulación dinámica del DOM. El proyecto fue desarrollado en el marco de la **Hackathon "Tienda Virtual con POO"**.

---

## 📁 Estructura de Archivos

```
aurum/
├── index.html       → Estructura HTML de la página
├── styles.css       → Estilos y diseño visual
├── script.js        → Lógica JS con clases y POO
└── img/             → Imágenes de los productos
    ├── roja.jpeg
    ├── negra.jpeg
    ├── eternal.jpeg
    ├── haya.jpeg
    ├── hayaati.jpeg
    ├── ilbee.jpeg
    ├── ilego.jpeg
    ├── ilfin.jpeg
    ├── ilmexico.jpeg
    ├── ilrose.jpeg
    ├── carolinah.jpeg
    └── carolinah2.jpeg
```

> ⚠️ Las imágenes deben estar en la carpeta `/img/` en la misma raíz que `index.html`. Sin ellas, los productos no mostrarán imagen.

---

## 🏗️ Arquitectura — Clases JavaScript

El proyecto está organizado en **3 clases principales** siguiendo el patrón POO.

---

### Clase `Producto`

Modelo de datos puro. Representa un perfume individual.

```js
class Producto {
  constructor(id, nombre, precio, imagen, categoria, notas)
}
```

| Propiedad    | Tipo       | Descripción                              |
|--------------|------------|------------------------------------------|
| `id`         | `number`   | Identificador único del producto         |
| `nombre`     | `string`   | Nombre del perfume                       |
| `precio`     | `number`   | Precio en pesos colombianos (COP)        |
| `imagen`     | `string`   | Ruta relativa a la imagen (`img/x.jpeg`) |
| `categoria`  | `string`   | `florales`, `amaderados`, `orientales` o `frescos` |
| `notas`      | `string[]` | Array con las notas olfativas            |

---

### Clase `Carrito`

Gestiona el estado del carrito y su renderizado en el DOM.

```js
class Carrito {
  constructor() {
    this.items = []; // [{ producto: Producto, cantidad: number }]
  }
}
```

#### Métodos:

| Método | Descripción |
|--------|-------------|
| `agregarProducto(producto, cantidad = 1)` | Agrega un producto. Si ya existe, incrementa la cantidad. Llama a `renderizar()` y `mostrarNotificacion()` |
| `eliminarProducto(id)` | Filtra el item con ese `id` y re-renderiza |
| `actualizarCantidad(id, nuevaCantidad)` | Si `nuevaCantidad <= 0`, elimina. Si no, actualiza y re-renderiza |
| `calcularTotal()` | Retorna la suma de `precio × cantidad` de todos los items |
| `contarItems()` | Retorna la cantidad total de unidades en el carrito |
| `vaciarCarrito()` | Resetea `this.items = []` y re-renderiza |
| `finalizarCompraWhatsApp()` | Construye un mensaje con el pedido y abre WhatsApp. Luego vacía el carrito y cierra el sidebar |
| `renderizar()` | Actualiza `#cart-items`, `#cart-total` y `#cart-counter` en el DOM |
| `mostrarNotificacion(mensaje)` | Crea y muestra un toast animado en la esquina inferior derecha |

---

### Clase `Tienda`

Controlador principal. Orquesta productos, carrito y eventos.

```js
class Tienda {
  constructor() {
    this.carrito = new Carrito();
    this.productos = [];
    this.categoriaActiva = 'todos';
  }
}
```

#### Métodos:

| Método | Descripción |
|--------|-------------|
| `init()` | Punto de entrada. Llama a `cargarProductos()`, `renderizarCatalogo()` y `bindEvents()` |
| `cargarProductos()` | Instancia los 12 objetos `Producto` y los guarda en `this.productos` |
| `productosFiltrados()` | Retorna todos los productos o solo los de `categoriaActiva` |
| `renderizarCatalogo()` | Limpia `#product-grid` e inyecta las tarjetas con un delay de 50ms para animar |
| `filtrarPorCategoria(categoria)` | Actualiza `categoriaActiva`, resalta el botón activo y re-renderiza el catálogo |
| `comprarDirectoWhatsApp(id)` | Abre WhatsApp con un mensaje de consulta para un producto específico |
| `bindEvents()` | Registra todos los `addEventListener` del proyecto usando Event Delegation |

---

## 🛍️ Catálogo de Productos

| ID | Nombre | Precio COP | Categoría | Notas |
|----|--------|-----------|-----------|-------|
| 1  | Lattafa Sublime     | 289,000 | orientales  | Oud, Ámbar, Vainilla |
| 2  | Lattafa Negra Oud   | 195,000 | florales    | Rosa, Jazmín, Almizcle |
| 3  | Lattafa Eternal Oud | 245,000 | amaderados  | Cedro, Musgo, Vetiver |
| 4  | Lattafa Haya        | 175,000 | frescos     | Bergamota, Lima, Sal Marina |
| 5  | Lattafa Hayaati     | 320,000 | orientales  | Miel, Canela, Pachulí |
| 6  | Il Bee              | 210,000 | florales    | Cerezo, Lichi, Sándalo |
| 7  | Il Ego              | 265,000 | amaderados  | Cuero, Haya, Tabaco |
| 8  | Il Fin              | 155,000 | frescos     | Limón, Pomelo, Menta |
| 9  | Il Mexico           | 275,000 | florales    | Rosa Turca, Pimienta, Pachulí |
| 10 | Il Rose             | 350,000 | orientales  | Ámbar Gris, Incienso, Mirra |
| 11 | Carolina Herrera    | 220,000 | amaderados  | Vetiver, Bergamota, Nuez Moscada |
| 12 | 212 Sexy            | 165,000 | frescos     | Agua de Coco, Mandarina, Loto |

---

## 🎨 Sistema de Diseño (CSS)

### Variables globales (`:root`)

```css
--bg: #0A0A0A              /* Fondo principal negro */
--gold: #C9A84C            /* Dorado principal */
--gold-hover: #DBC073      /* Dorado hover */
--cream: #F5F0E8           /* Texto principal crema */
--surface: rgba(20,20,20,0.6)   /* Fondo de cards */
--surface-solid: #141414   /* Fondo sólido */
--border: rgba(255,255,255,0.08)
--border-gold: rgba(201,168,76,0.4)
--danger: #EF4444          /* Color de eliminar */
--text-muted: #A0A0A0      /* Texto secundario */
--transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)
```

### Tipografías (Google Fonts)

| Fuente | Uso |
|--------|-----|
| `Playfair Display` (serif, italic) | Títulos, logo, nombres de productos |
| `DM Sans` | Cuerpo de texto, botones, navegación |
| `DM Mono` | Precios, notas olfativas, etiquetas |

### Breakpoints responsivos

| Punto | Cambio |
|-------|--------|
| `≤ 900px` | Título hero reduce a `3.5rem` |
| `≤ 768px` | Nav links ocultos, grid a 1 columna, sidebar a 100% ancho |

---

## ⚡ Flujo de Eventos (Event Delegation)

En lugar de asignar eventos a cada botón individualmente, se usan **2 delegadores principales**:

```js
// En el grid de productos
productGrid.addEventListener('click', (e) => {
  const btnAgregar = e.target.closest('.btn-agregar');
  const btnWa = e.target.closest('.btn-wa-card');
  // ...
});

// En el carrito
cartItemsContainer.addEventListener('click', (e) => {
  const btnEliminar = e.target.closest('.btn-eliminar');
  const qtyBtn = e.target.closest('.qty-btn');
  // ...
});
```

> ✅ Esto permite que los botones creados dinámicamente con `innerHTML` también respondan a eventos sin necesidad de re-asignarlos.

---

## 📲 Integración WhatsApp

El número está definido como constante al inicio de `script.js`:

```js
const WHATSAPP_NUMBER = "573226494630"; // Sin el símbolo +
```

Hay **dos formas** de comprar por WhatsApp:

1. **Desde la tarjeta del producto** → botón `Comprar` → envía consulta individual
2. **Desde el carrito** → botón `Comprar por WhatsApp` → envía el pedido completo con todos los items y el total

---

## 🔔 Notificaciones Toast

Se muestran automáticamente al:
- Agregar un producto al carrito
- Eliminar un producto del carrito
- Vaciar el carrito
- Finalizar compra por WhatsApp
- Intentar finalizar con carrito vacío

Duración: **3 segundos**. Aparecen en la esquina inferior derecha con animación `slideUp`.

---

## 🚀 Inicialización

Al final de `script.js`:

```js
const tienda = new Tienda();
document.addEventListener('DOMContentLoaded', () => tienda.init());
```

El evento `DOMContentLoaded` garantiza que el HTML esté completamente cargado antes de manipular el DOM.

---

## 📋 Reglas de Código Aplicadas

- ✅ Solo `const` y `let` — nunca `var`
- ✅ Sin librerías externas (sin jQuery, sin frameworks)
- ✅ Sin `onclick` en el HTML — todo con `addEventListener`
- ✅ Event Delegation en contenedores dinámicos
- ✅ Template literals (backticks) para todo el HTML generado
- ✅ Comentarios de sección: `// === CLASE X ===`
- ✅ Indentación de 2 espacios
- ✅ Precios formateados con `.toLocaleString('es-CO')`

---

## ✅ Criterios de Evaluación Cubiertos

| Criterio | Puntos | Implementación |
|----------|--------|----------------|
| Funcionalidad completa (agregar/quitar/vaciar/total) | 25 | ✅ Métodos `agregarProducto`, `eliminarProducto`, `vaciarCarrito`, `calcularTotal` |
| Uso correcto de POO (clases con métodos, instancias) | 20 | ✅ Clases `Producto`, `Carrito`, `Tienda` |
| Manipulación dinámica del DOM | 20 | ✅ `renderizar()`, `renderizarCatalogo()`, templates con `innerHTML` |
| Diseño y UX (CSS, responsive, claridad) | 15 | ✅ Dark luxury, glassmorphism, responsive, animaciones |
| Código limpio y organizado | 10 | ✅ Comentarios, indentación, nombres semánticos |
| Originalidad del tema y presentación | 10 | ✅ Marca AURUM, integración WhatsApp, 12 productos reales |

**Total posible: 100 puntos** 🏆