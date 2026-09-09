# 🍳 El Recetario de Papá

> **El Recetario de Papá** es una aplicación web moderna orientada a la organización del hogar y la gestión gastronómica personal. Diseñada para ofrecer una experiencia fluida e intuitiva, permite administrar recetas familiares, planificar menús semanales, organizar listas de compras, guardar platillos favoritos y **generar recetas inteligentes mediante IA** a partir de los ingredientes disponibles en la cocina.

---

## 🚀 Tecnologías Utilizadas

### **Frontend & Framework**

* **[Next.js](https://nextjs.org/) (App Router):** Navegación basada en servidor, renderizado optimizado y estructura moderna.
* **[React](https://react.dev/):** Hooks de estado avanzado, manejo de efectos y diseño de componentes reutilizables.
* **[TypeScript](https://www.typescriptlang.org/):** Tipado estático riguroso para asegurar la consistencia de datos y prevenir errores en tiempo de desarrollo.
* **[Tailwind CSS](https://tailwindcss.com/):** Estilizado utilitario con soporte para *responsive design*, animaciones avanzadas de UI y modos fluidos.
* **[html-to-image](https://www.npmjs.com/package/html-to-image):** Conversión dinámica de componentes HTML a imágenes PNG para exportación de fichas de cocina.

### **Backend, IA & Persistencia**

* **[Supabase](https://supabase.com/):** Autenticación de usuarios mediante SSR y Client Side, además de base de datos PostgreSQL.
* **[Prisma](https://www.prisma.io/):** ORM utilizado para la interacción con la base de datos PostgreSQL.
* **[AI SDK](https://ai-sdk.dev/):** Integración con modelos de lenguaje y manejo de respuestas mediante streaming.
* **[Groq](https://groq.com/):** Proveedor de inferencia utilizado para la generación rápida de recetas mediante modelos LLM.
* **Chef IA:** Asistente culinario capaz de generar recetas personalizadas a partir de los ingredientes o ideas proporcionadas por el usuario.

---

## ✨ Características Principales

* 🔐 **Autenticación Completa**

  * Registro de usuarios.
  * Inicio de sesión.
  * Gestión de sesión persistente.
  * Integración con Supabase Auth.

* 🤖 **Chef IA — Asistente Culinario**

  * Generación de recetas a partir de ingredientes disponibles.
  * Respuestas mediante streaming.
  * Generación de recetas estructuradas en Markdown.
  * Interfaz conversacional mediante `useChat`.
  * Posibilidad de detener la generación de la respuesta.

* 📤 **Exportación & Compartido Multiformato**

  * Exportación de fichas de recetas en formato **PNG**.
  * Branding y presentación visual de las recetas.
  * Exportación de recetas a formato **TXT**.
  * Formato adaptado para **WhatsApp y redes sociales**.
  * Copiado rápido de recetas al portapapeles.

* 📖 **Gestión de Recetas — Mis Recetas**

  * Creación de recetas personalizadas.
  * Edición de recetas.
  * Consulta de recetas.
  * Guardado de recetas mediante modales interactivos.

* ⭐ **Sección de Favoritos**

  * Marcado dinámico de recetas favoritas.
  * Acceso rápido a los platillos preferidos.

* 📅 **Planificador de Menú Semanal**

  * Organización de comidas por día.
  * Planificación estructurada del menú semanal.

* 🛒 **Lista de Compras**

  * Gestión de ingredientes necesarios.
  * Consolidación de ingredientes a partir de recetas seleccionadas.

* 🎨 **UI/UX**

  * Navbar interactivo *sticky*.
  * Contracción dinámica de la navegación al hacer scroll.
  * Animaciones y transiciones.
  * Diseño responsive.
  * Logotipo vectorial optimizado.
  * Componentes de interfaz minimalistas.

---

## 🛠️ Estructura del Proyecto

```text
├── app/
│   ├── (auth)/
│   │   ├── login/                  # Página de inicio de sesión
│   │   └── signup/                 # Página de registro
│   │
│   ├── api/
│   │   └── generar-receta/         # API para generación de recetas con IA
│   │
│   ├── favoritos/                  # Vista de recetas favoritas
│   ├── generar/                    # Vista principal del Chef IA
│   ├── lista-compra/               # Gestión de lista de compras
│   ├── menu/                       # Planificador de menú semanal
│   ├── mis-recetas/                # Gestor de recetas del usuario
│   │
│   ├── layout.tsx                  # Layout global
│   └── page.tsx                    # Landing / Dashboard principal
│
├── components/
│   ├── Navbar.tsx                  # Barra de navegación
│   └── RecetaModal.tsx             # Modal de creación/edición de recetas
│
├── utils/
│   └── supabase/                   # Configuración de Supabase
│
├── public/                         # Assets estáticos y fuentes
│
├── prisma/                         # Esquema y configuración de Prisma
│
├── .env.local                      # Variables de entorno
├── package.json                    # Dependencias y scripts
└── README.md                       # Documentación del proyecto
```

---

## ⚡ Configuración e Instalación Local

### Prerrequisitos

Antes de comenzar, necesitas tener instalado:

* **Node.js 18.x o superior**
* **npm**
* Una cuenta de **[Supabase](https://supabase.com/)**
* Una API Key de **Groq**
* Una base de datos PostgreSQL compatible con Prisma

### 1. Clonar el repositorio

```bash
git clone https://github.com/Mannlex21/recetario-de-papa.git
cd recetario-de-papa
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto.

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

GROQ_API_KEY=tu_groq_api_key

DATABASE_URL="postgresql://postgres.g.../"
DIRECT_URL="postgresql://postgres.g.../"
```

### Variables de entorno

| Variable                        | Descripción                                               |
| ------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto de Supabase                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase                                 |
| `GROQ_API_KEY`                  | API Key utilizada para el Chef IA                         |
| `DATABASE_URL`                  | URL de conexión a PostgreSQL utilizada por Prisma         |
| `DIRECT_URL`                    | URL de conexión directa a PostgreSQL utilizada por Prisma |

> ⚠️ **Seguridad:** Nunca publiques las URLs completas de conexión de PostgreSQL ni las API Keys en GitHub. El archivo `.env.local` debe permanecer fuera del repositorio.

### 4. Configurar Prisma

Si el proyecto utiliza Prisma, ejecuta:

```bash
npx prisma generate
```

Para sincronizar el esquema con la base de datos:

```bash
npx prisma db push
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 6. Abrir la aplicación

Visita:

```text
http://localhost:3000
```

---

## 🤖 Chef IA

El **Chef IA** es uno de los módulos principales de la aplicación.

El usuario puede introducir los ingredientes que tiene disponibles, por ejemplo:

```text
Jitomate, cebolla, huevo y tortilla
```

El sistema envía la solicitud al endpoint:

```text
/api/generar-receta
```

El backend utiliza **AI SDK + Groq** para procesar la solicitud y generar una receta mediante streaming.

### Flujo

```text
Usuario
   │
   ▼
Chef IA
   │
   │ ingredientes
   ▼
useChat()
   │
   ▼
/api/generar-receta
   │
   ▼
AI SDK
   │
   ▼
Groq / LLM
   │
   ▼
Respuesta en streaming
   │
   ▼
Chef IA
   │
   ▼
Receta en Markdown
```

### Ejemplos de solicitudes

```text
Jitomate, cebolla, huevo y tortilla
```

```text
Pechuga de pollo, crema y champiñones
```

```text
Atún en lata, aguacate y galletas saladas
```

```text
Plátano, harina, leche y huevo
```

---

## 📤 Exportación de Recetas

La aplicación permite convertir las recetas en diferentes formatos para facilitar su almacenamiento y distribución.

### PNG

Las tarjetas de recetas pueden convertirse en imágenes utilizando:

```text
html-to-image
```

Esto permite compartir visualmente las recetas conservando el diseño y branding de la aplicación.

### Texto

Las recetas también pueden copiarse o exportarse como texto plano para facilitar su reutilización.

### WhatsApp / Redes Sociales

Se genera una versión optimizada del contenido para compartir:

* Nombre de la receta.
* Ingredientes.
* Preparación.
* Información relevante.
* Llamado a la acción.

---

## 🎯 Roadmap

### Completado

* [x] Arquitectura base en Next.js con App Router.
* [x] Integración de React y TypeScript.
* [x] Integración de Tailwind CSS.
* [x] Navbar interactivo con contracción en scroll.
* [x] Logotipo SVG optimizado.
* [x] Integración de Supabase Auth.
* [x] Flujos de registro e inicio de sesión.
* [x] Gestión de recetas.
* [x] Sección de recetas favoritas.
* [x] Planificador de menú semanal.
* [x] Lista de compras.
* [x] Integración de Prisma con PostgreSQL.
* [x] Asistente Culinario inteligente (**Chef IA**).
* [x] Integración de AI SDK.
* [x] Integración con Groq.
* [x] Generación de recetas mediante streaming.
* [x] Migración del cliente a `useChat`.
* [x] Generación de respuestas en Markdown.
* [x] Exportación de tarjetas a PNG mediante `html-to-image`.
* [x] Copiado de recetas para WhatsApp y redes sociales.

### Pendiente

* [ ] Persistencia directa de recetas generadas por IA en Supabase.
* [ ] Historial de conversaciones del Chef IA.
* [ ] Guardado de recetas generadas desde el Chef IA.
* [ ] Mejorar el procesamiento estructurado de recetas generadas por IA.
* [ ] Incorporar categorías y etiquetas para las recetas.
* [ ] Mejorar las opciones de exportación y compartido.
* [ ] Implementar recomendaciones personalizadas basadas en las recetas del usuario.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

Consulta el archivo `LICENSE` para más detalles.
