# 🍳 El Recetario de Papá

> **El Recetario de Papá** es una aplicación web moderna orientada a la organización del hogar y la gestión gastronómica personal. Diseñada para ofrecer una experiencia fluida e intuitiva, permite administrar recetas familiares, planificar menús semanales, organizar listas de compras y guardar platillos favoritos con un enfoque visual cuidado y reactivo.

---

## 🚀 Tecnologías Utilizadas

### **Frontend & Framework**

* **[Next.js](https://nextjs.org/) (App Router):** Navegación basada en servidor, renderizado optimizado y estructura moderna.
* **[React](https://react.dev/):** Hooks de estado avanzado, manejo de efectos y diseño de componentes reutilizables.
* **[TypeScript](https://www.typescriptlang.org/):** Tipado estático riguroso para asegurar la consistencia de datos y prevenir errores en tiempo de desarrollo.
* **[Tailwind CSS](https://tailwindcss.com/):** Estilizado utilitario con soporte para *responsive design*, animaciones avanzadas de UI y modos fluidos.

### **Backend & Persistencia**

* **[Supabase](https://supabase.com/):** Autenticación de usuarios (SSR & Client Side) y base de datos PostgreSQL en tiempo real.

---

## ✨ Características Principales

* 🔐 **Autenticación Completa:** Sistema de registro, inicio de sesión y gestión de sesión persistente con Supabase Auth.
* 📖 **Gestión de Recetas (Mis Recetas):** Creación, edición y consulta de recetas personalizadas mediante modales interactivos.
* ⭐ **Sección de Favoritos:** Marcado dinámico de platillos predilectos para acceso rápido.
* 📅 **Planificador de Menú Semanal:** Organización estructurada para la comida diaria o semanal.
* 🛒 **Lista de Compras Automática:** Consolidación de ingredientes a partir de las recetas seleccionadas.
* 🎨 **UI/UX Altamente Cuidada:**

  * Navbar interactivo *sticky* con reducción dinámica mediante animación al hacer scroll.
  * Logotipo vectorial en 2 niveles optimizado (`viewBox` preciso sin espacios vacíos).
  * Menú desplegable móvil responsivo y navegación adaptable.

---

## 🛠️ Estructura del Proyecto

```text
├── app/
│   ├── (auth)/
│   │   ├── login/              # Página de inicio de sesión
│   │   └── signup/             # Página de registro
│   ├── favoritos/              # Vista de recetas favoritas
│   ├── lista-compra/           # Gestión de lista de compras
│   ├── menu/                   # Planificador de menú semanal
│   ├── mis-recetas/            # Gestor de recetas del usuario
│   ├── layout.tsx              # Layout global de la aplicación
│   └── page.tsx                # Landing / Dashboard principal
├── components/
│   ├── Navbar.tsx              # Barra de navegación animada y adaptativa
│   └── RecetaModal.tsx         # Modal dinámico para creación/edición de recetas
├── utils/
│   └── supabase/               # Configuración del cliente Supabase
├── public/                     # Assets estáticos y fuentes
└── README.md
```

---

## ⚡ Configuración e Instalación Local

### **Prerrequisitos**

* Node.js 18.x o superior.
* Cuenta en [Supabase](https://supabase.com/).

### **Pasos para clonar y ejecutar**

#### 1. Clonar el repositorio

```bash
git clone https://github.com/Mannlex21/recetario-de-papa.git
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

#### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

#### 5. Abrir en el navegador

Visita:

```text
http://localhost:3000
```

para visualizar la aplicación ejecutándose localmente.

---

## 🎯 Proyección & Roadmap

* [x] Arquitectura base en Next.js (App Router) + Tailwind CSS.
* [x] Navbar interactivo con contracción en scroll y SVG optimizado.
* [x] Integración de Supabase Auth para flujos de usuario.
* [ ] Conexión del **Vercel AI SDK** para generación automática de recetas mediante IA (LLM Streaming).

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
