# Guia Completa de Deployment en Netlify - FleetFlow

Esta guia te llevara paso a paso desde cero hasta tener FleetFlow funcionando completamente en Netlify.

## Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Configuracion de Supabase](#configuracion-de-supabase)
3. [Configuracion de Google OAuth](#configuracion-de-google-oauth)
4. [Subir Codigo a GitHub](#subir-codigo-a-github)
5. [Deployment en Netlify](#deployment-en-netlify)
6. [Configuracion Post-Deployment](#configuracion-post-deployment)
7. [Verificacion y Testing](#verificacion-y-testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisitos

### Cuentas Necesarias (todas gratuitas)

1. Cuenta de GitHub - https://github.com
2. Cuenta de Netlify - https://netlify.com
3. Cuenta de Supabase - https://supabase.com
4. Cuenta de Google Cloud - https://console.cloud.google.com

### Software Local

- Node.js 18 o superior - https://nodejs.org
- Git - https://git-scm.com
- Editor de codigo (VS Code recomendado)

### Tiempo Estimado

- Primera vez: 60-90 minutos
- Deployments subsecuentes: 5-10 minutos

---

## Configuracion de Supabase

### Paso 1: Crear Proyecto Supabase

1. Ve a https://supabase.com/dashboard
2. Click en "New project"
3. Configuracion:
   - **Organization**: Selecciona o crea una
   - **Name**: fleetflow-production (o tu nombre preferido)
   - **Database Password**: Genera uno seguro (GUARDALO)
   - **Region**: Selecciona el mas cercano a tus usuarios
   - **Pricing Plan**: Free tier es suficiente para empezar

4. Click "Create new project"
5. Espera 2-3 minutos mientras se crea

### Paso 2: Obtener Credenciales

1. Ve a **Settings** (icono de engranaje) > **API**
2. Copia y guarda:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Larga cadena comenzando con `eyJ...`

IMPORTANTE: Guarda estos valores, los necesitaras mas adelante.

### Paso 3: Configurar Base de Datos

#### Opcion A: Usar SQL Editor en Supabase

1. Ve a **SQL Editor** en el menu lateral
2. Click en "New query"
3. Ejecuta los scripts en orden:

**Script 1: Schema (01_schema.sql)**
```sql
-- Pega aqui el contenido de sql/01_schema.sql
-- Crea todas las tablas necesarias
```
Click "Run" o Ctrl+Enter

**Script 2: Policies (02_policies.sql)**
```sql
-- Pega aqui el contenido de sql/02_policies.sql
-- Configura Row Level Security
```
Click "Run"

**Script 3: Functions (03_functions.sql)**
```sql
-- Pega aqui el contenido de sql/03_functions.sql
-- Crea funciones y triggers
```
Click "Run"

#### Verificacion

1. Ve a **Table Editor**
2. Deberias ver todas las tablas creadas
3. Verifica que no haya errores

### Paso 4: Configurar Autenticacion en Supabase

1. Ve a **Authentication** > **Providers**
2. Por ahora, deja Google deshabilitado (lo configuraremos despues)
3. Ve a **URL Configuration**
4. En **Site URL**, por ahora deja `http://localhost:5173`

---

## Configuracion de Google OAuth

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a https://console.cloud.google.com
2. Click en el dropdown de proyectos (arriba a la izquierda)
3. Click "New Project"
4. Configuracion:
   - **Project name**: FleetFlow-Production
   - **Organization**: (opcional)
5. Click "Create"
6. Espera unos segundos, luego selecciona el proyecto

### Paso 2: Configurar OAuth Consent Screen

1. Menu > **APIs & Services** > **OAuth consent screen**
2. User Type: **External**
3. Click "Create"
4. Configuracion:
   - **App name**: FleetFlow
   - **User support email**: Tu email
   - **Developer contact**: Tu email
   - **App logo**: (opcional)
5. Click "Save and Continue"
6. Scopes: Click "Save and Continue" (dejar por defecto)
7. Test users: Agrega tu email
8. Click "Save and Continue"
9. Summary: Revisa y click "Back to Dashboard"

### Paso 3: Crear Credenciales OAuth

1. **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configuracion:
   - **Application type**: Web application
   - **Name**: FleetFlow OAuth Client
   - **Authorized JavaScript origins**:
     - `https://tu-proyecto.supabase.co` (reemplaza con tu URL de Supabase)
     - `http://localhost:5173` (para desarrollo local)
   - **Authorized redirect URIs**:
     - `https://tu-proyecto.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback`

4. Click "Create"
5. COPIA y GUARDA:
   - **Client ID**: Algo como `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: Cadena aleatoria

### Paso 4: Configurar Google Provider en Supabase

1. Regresa a Supabase Dashboard
2. **Authentication** > **Providers**
3. Encuentra "Google" y click para expandir
4. **Enable**: ON
5. Pega:
   - **Client ID**: El que copiaste de Google
   - **Client Secret**: El que copiaste de Google
6. Click "Save"

---

## Subir Codigo a GitHub

### Opcion 1: Repositorio Nuevo

```bash
# 1. Navega a la carpeta del proyecto
cd fleetflow-netlify

# 2. Inicializa Git (si no esta inicializado)
git init

# 3. Crea .gitignore (ya deberia existir)
# Verifica que incluya:
# node_modules
# .env
# dist

# 4. Agrega todos los archivos
git add .

# 5. Commit inicial
git commit -m "Initial commit: FleetFlow optimizado para Netlify"

# 6. Crea repositorio en GitHub
# Ve a github.com/new
# Nombre: fleetflow-netlify
# Visibilidad: Public (o Private si prefieres)
# NO inicialices con README

# 7. Conecta con GitHub (reemplaza con tu usuario)
git remote add origin https://github.com/TU-USUARIO/fleetflow-netlify.git
git branch -M main
git push -u origin main
```

### Opcion 2: Fork o Clone de Repositorio Existente

```bash
# Si tienes el codigo en un zip o tar.gz
tar -xzf fleetflow-netlify.tar.gz
cd fleetflow-netlify

# Seguir pasos 2-7 de Opcion 1
```

### Verificacion

1. Ve a https://github.com/TU-USUARIO/fleetflow-netlify
2. Deberias ver todos los archivos
3. Verifica que existen:
   - `netlify.toml`
   - `public/_redirects`
   - `.env.example`
   - `README.md`

---

## Deployment en Netlify

### Paso 1: Conectar GitHub con Netlify

1. Ve a https://app.netlify.com
2. Login (o Sign up si es primera vez)
3. Click "Add new site" > "Import an existing project"
4. Selecciona "GitHub"
5. Si es primera vez:
   - Autoriza Netlify a acceder a GitHub
   - Selecciona repositorios (todos o solo fleetflow-netlify)
6. Selecciona el repositorio `fleetflow-netlify`

### Paso 2: Configurar Build Settings

Netlify deberia detectar automaticamente:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: (vacio)

Si no detecta automaticamente:
1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Base directory**: dejar vacio

### Paso 3: Configurar Variables de Entorno

CRITICO: Debes configurar las variables ANTES del primer deploy.

1. Click "Show advanced"
2. Click "New variable" para cada una:

**Variables OBLIGATORIAS:**

```
Nombre: VITE_SUPABASE_URL
Valor: https://tu-proyecto.supabase.co

Nombre: VITE_SUPABASE_ANON_KEY
Valor: tu_clave_anonima_de_supabase

Nombre: VITE_GOOGLE_CLIENT_ID
Valor: tu-client-id.apps.googleusercontent.com
```

**Variables OPCIONALES:**

```
Nombre: VITE_ENV
Valor: production

Nombre: VITE_GEMINI_API_KEY
Valor: tu_gemini_key (si tienes)

Nombre: VITE_GOOGLE_MAPS_API_KEY
Valor: tu_maps_key (si tienes)
```

3. Verifica que NO haya espacios extras
4. NO uses comillas en los valores

### Paso 4: Deploy

1. Click "Deploy site"
2. Netlify comenzara a construir
3. Puedes ver el progreso en "Deploys" tab
4. El build tarda 2-5 minutos

### Paso 5: Verificar Deploy

1. Cuando termine, Netlify te dara una URL aleatoria:
   `https://random-name-12345.netlify.app`

2. Click en la URL
3. Deberias ver la pagina de login de FleetFlow

IMPORTANTE: Guarda esta URL, la necesitas para el siguiente paso.

---

## Configuracion Post-Deployment

### Paso 1: Actualizar URLs en Google OAuth

1. Ve a Google Cloud Console
2. **APIs & Services** > **Credentials**
3. Click en tu OAuth 2.0 Client ID
4. **Authorized JavaScript origins**: Agregar:
   - `https://tu-sitio.netlify.app` (la URL que te dio Netlify)

5. **Authorized redirect URIs**: Agregar:
   - `https://tu-sitio.netlify.app/auth/callback`

6. Click "Save"

### Paso 2: Actualizar URLs en Supabase

1. Ve a Supabase Dashboard
2. **Authentication** > **URL Configuration**
3. **Site URL**: Cambiar a `https://tu-sitio.netlify.app`
4. **Redirect URLs**: Agregar `https://tu-sitio.netlify.app/**`
5. Click "Save"

### Paso 3: Configurar Dominio Custom (Opcional)

En Netlify:
1. **Domain settings** > **Add custom domain**
2. Ingresa tu dominio: `tudominio.com`
3. Sigue instrucciones DNS de Netlify
4. Netlify configura SSL automaticamente

Si configuras dominio custom:
- Actualiza Google OAuth origins y redirects
- Actualiza Supabase Site URL

---

## Verificacion y Testing

### Checklist de Verificacion

1. **Sitio carga correctamente**
   - [ ] Abre `https://tu-sitio.netlify.app`
   - [ ] Ves la pagina de login
   - [ ] No hay errores en consola del navegador (F12)

2. **Google OAuth funciona**
   - [ ] Click en "Sign in with Google"
   - [ ] Te redirige a Google
   - [ ] Seleccionas tu cuenta
   - [ ] Te redirige de vuelta a FleetFlow
   - [ ] Estas autenticado

3. **Dashboard carga**
   - [ ] Despues de login, ves el dashboard
   - [ ] No hay errores 401
   - [ ] Datos cargan correctamente

4. **OAuth Analytics accesible**
   - [ ] Tab "OAuth Analytics" visible
   - [ ] Al hacer click, carga el dashboard
   - [ ] Metricas se muestran

5. **Funcionalidades basicas**
   - [ ] Sistema de notificaciones funciona
   - [ ] Chat carga (si esta configurado)
   - [ ] Puedes navegar entre secciones

### Testing de Primera Sesion

```bash
# 1. Abre el sitio en incognito
https://tu-sitio.netlify.app

# 2. Login con Google

# 3. Verifica dashboard

# 4. Abre consola del navegador (F12)
# No deberia haber errores rojos criticos

# 5. Cierra sesion y vuelve a entrar
# Para verificar persistencia de sesion
```

---

## Troubleshooting

### Build falla en Netlify

**Error**: `npm ERR! code ELIFECYCLE`

Solucion:
1. Ve a **Site settings** > **Build & deploy** > **Environment**
2. Verifica que todas las variables esten configuradas
3. Agrega: `NODE_VERSION=18`
4. **Deploys** > **Trigger deploy** > **Clear cache and deploy**

**Error**: `Module not found`

Solucion:
1. Verifica que `package.json` tenga todas las dependencias
2. Clear cache and redeploy

### OAuth no funciona

**Error**: `redirect_uri_mismatch`

Solucion:
1. Ve a Google Cloud Console > Credentials
2. Verifica que redirect URIs incluyan:
   - `https://tu-proyecto.supabase.co/auth/v1/callback`
   - `https://tu-sitio.netlify.app/auth/callback`
3. Espera 5 minutos para que cambios propaguen

**Error**: Login redirige pero no autentica

Solucion:
1. Supabase Dashboard > Authentication > Providers
2. Verifica que Google este enabled
3. Verifica Client ID y Secret
4. URL Configuration: Site URL debe ser tu Netlify URL

### Pagina en blanco

**Sintoma**: Sitio carga pero pantalla blanca

Solucion:
1. Abre consola del navegador (F12)
2. Busca errores rojos
3. Probablemente falta variable de entorno
4. Ve a Netlify > Site settings > Environment
5. Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY esten configuradas
6. Redeploy

### Error 404 en rutas

**Sintoma**: URL como `/dashboard` da 404

Solucion:
1. Verifica que `public/_redirects` exista
2. Contenido debe ser:
```
/* /index.html 200
```
3. Verifica que `netlify.toml` tenga configuracion de redirects
4. Redeploy

### Variables de entorno no se aplican

Solucion:
1. Netlify solo lee variables al hacer build
2. Despues de agregar/cambiar variables:
   - **Deploys** > **Trigger deploy**
3. NO uses comillas en valores de variables
4. NO pongas espacios antes o despues del valor

### Build es lento

**Sintoma**: Build tarda 10+ minutos

Solucion:
1. Es normal en primer build
2. Builds subsecuentes usan cache (2-3 minutos)
3. Si sigue lento:
   - Revisa dependencias en `package.json`
   - Considera usar pnpm en vez de npm

---

## Deployment Continuo

### Automatizacion

Cada vez que haces push a GitHub:
```bash
git add .
git commit -m "Actualizar funcionalidad X"
git push
```

Netlify automaticamente:
1. Detecta el cambio
2. Inicia build
3. Despliega si build es exitoso
4. Te notifica por email

### Branch Deploys

Netlify puede desplegar branches automaticamente:
1. **Site settings** > **Build & deploy** > **Deploy contexts**
2. Habilita "Deploy previews"
3. Cada Pull Request tendra su propio deploy preview

### Rollback

Si un deploy tiene problemas:
1. **Deploys** tab
2. Encuentra deploy anterior que funcionaba
3. Click en "..." > "Publish deploy"
4. Netlify vuelve a ese deploy instantaneamente

---

## Mantenimiento

### Actualizar Dependencias

Periodicamente:
```bash
# Localmente
npm update
npm audit fix

# Commit y push
git add package.json package-lock.json
git commit -m "Actualizar dependencias"
git push
```

### Monitoreo

Netlify Dashboard muestra:
- **Analytics**: Visitas, bandwidth
- **Deploys**: Historial de deploys
- **Functions**: Si usas Netlify Functions
- **Logs**: Logs de build y runtime

### Backup

Supabase hace backup automatico, pero considera:
- Exportar datos periodicamente
- Tener backup de configuracion de Google OAuth
- Tener backup de variables de entorno

---

## Recursos Adicionales

### Documentacion Oficial

- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- Vite: https://vitejs.dev
- React: https://react.dev

### Soporte

- Netlify Community: https://answers.netlify.com
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag `netlify` o `supabase`

### Limites del Free Tier

**Netlify Free:**
- 100 GB bandwidth/mes
- 300 build minutes/mes
- 1 concurrent build
- HTTPS automatico

**Supabase Free:**
- 500 MB database
- 1 GB storage
- 2 GB bandwidth
- Unlimited API requests

---

## Checklist Final de Deployment

Antes de considerar el deployment completo:

- [ ] Supabase proyecto creado y configurado
- [ ] SQL scripts ejecutados (01, 02, 03)
- [ ] Google OAuth configurado en Google Cloud
- [ ] Google OAuth configurado en Supabase
- [ ] Codigo subido a GitHub
- [ ] Netlify conectado a GitHub
- [ ] Variables de entorno configuradas en Netlify
- [ ] Primer deploy exitoso
- [ ] URLs actualizadas en Google OAuth
- [ ] URLs actualizadas en Supabase
- [ ] Login con Google funciona
- [ ] Dashboard carga correctamente
- [ ] OAuth Analytics accesible
- [ ] No hay errores en consola
- [ ] Documentacion revisada

---

**Tiempo total estimado**: 60-90 minutos para deployment completo

**Siguiente deploy**: 5 minutos (solo push a GitHub)

---

Desarrollado especificamente para Netlify deployment
Version: 1.0.0
Fecha: 2025-11-09
