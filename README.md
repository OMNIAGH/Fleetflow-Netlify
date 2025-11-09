# FleetFlow - Deployment en Netlify

Sistema completo de gestion de flotas de transporte con autenticacion OAuth, dashboard de analytics y gestion en tiempo real.

## Caracteristicas Principales

- Autenticacion con Google OAuth 2.0
- Dashboard de OAuth Analytics en tiempo real
- Gestion completa de flotas y conductores
- Sistema de chat en tiempo real
- Gestion de documentos y gastos
- Notificaciones en tiempo real
- Sistema de monitoreo y alertas

## Tecnologias

- React 18+ con TypeScript
- Vite como build tool
- TailwindCSS para estilos
- Supabase (Backend as a Service)
- Google OAuth 2.0

## Deployment Rapido en Netlify

### Opcion 1: Deploy desde GitHub (Recomendado)

#### 1. Subir codigo a GitHub

```bash
# Clonar o descargar este repositorio
git clone https://github.com/tu-usuario/fleetflow-netlify.git
cd fleetflow-netlify

# O si es un nuevo repositorio
git init
git add .
git commit -m "Initial commit: FleetFlow para Netlify"
git branch -M main
git remote add origin https://github.com/tu-usuario/fleetflow-netlify.git
git push -u origin main
```

#### 2. Conectar con Netlify

1. Ve a https://app.netlify.com
2. Click en "Add new site" > "Import an existing project"
3. Conecta con GitHub
4. Selecciona el repositorio `fleetflow-netlify`
5. Configuracion de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (dejar vacio)

#### 3. Configurar Variables de Entorno

En Netlify Dashboard > Site settings > Build & deploy > Environment:

Variables OBLIGATORIAS:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

Variables OPCIONALES:
```
VITE_GEMINI_API_KEY=tu_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
VITE_ENV=production
```

#### 4. Deploy

Click en "Deploy site" - Netlify construira y desplegara automaticamente.

### Opcion 2: Deploy Manual con Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build del proyecto
npm install
npm run build

# Deploy
netlify deploy --prod
```

## Configuracion Completa

### Prerequisitos

1. Cuenta de Supabase (https://supabase.com)
2. Proyecto de Google Cloud con OAuth configurado
3. Cuenta de Netlify (https://netlify.com)

### 1. Configurar Supabase

#### Crear Proyecto Supabase

1. Ve a https://supabase.com/dashboard
2. Crear nuevo proyecto
3. Espera a que el proyecto este listo
4. Ve a Settings > API
5. Copia:
   - Project URL (VITE_SUPABASE_URL)
   - anon/public key (VITE_SUPABASE_ANON_KEY)

#### Ejecutar SQL Scripts

En Supabase Dashboard > SQL Editor, ejecuta en orden:

1. `sql/01_schema.sql` - Crea las tablas
2. `sql/02_policies.sql` - Configura seguridad RLS
3. `sql/03_functions.sql` - Crea funciones y triggers

(Los archivos SQL estan en el paquete de deployment completo)

### 2. Configurar Google OAuth

#### Google Cloud Console

1. Ve a https://console.cloud.google.com
2. Crear nuevo proyecto o seleccionar existente
3. APIs & Services > Credentials
4. Create Credentials > OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized JavaScript origins:
   - `https://tu-sitio.netlify.app`
   - `https://tu-proyecto.supabase.co`
7. Authorized redirect URIs:
   - `https://tu-proyecto.supabase.co/auth/v1/callback`
   - `https://tu-sitio.netlify.app/auth/callback`
8. Copia el Client ID

#### Configurar en Supabase

1. Supabase Dashboard > Authentication > Providers
2. Habilitar Google
3. Pegar Client ID y Client Secret de Google
4. Guardar

### 3. Configurar Variables en Netlify

Metodo 1 - Netlify UI:
1. Site settings > Build & deploy > Environment
2. Add a variable para cada una
3. Trigger deploy

Metodo 2 - Netlify CLI:
```bash
netlify env:set VITE_SUPABASE_URL "https://tu-proyecto.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "tu_clave_aqui"
netlify env:set VITE_GOOGLE_CLIENT_ID "tu-client-id.apps.googleusercontent.com"
```

### 4. Actualizar URLs OAuth

Despues del primer deploy, actualiza:

En Google Cloud Console:
- Agregar URL de Netlify a "Authorized JavaScript origins"
- Agregar `https://tu-sitio.netlify.app/auth/callback` a redirect URIs

En Supabase:
- Settings > Authentication > Site URL: `https://tu-sitio.netlify.app`
- Redirect URLs: Agregar URL de Netlify

## Build Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview del build
npm run preview
```

## Estructura del Proyecto

```
fleetflow-netlify/
├── public/
│   ├── _redirects          # Configuracion SPA routing
│   └── ...                 # Assets estaticos
├── src/
│   ├── components/         # Componentes React
│   ├── contexts/          # React Contexts (Auth)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Supabase client
│   ├── pages/             # Paginas
│   ├── services/          # Servicios API
│   └── types/             # TypeScript types
├── netlify.toml           # Configuracion Netlify
├── .env.example           # Template variables entorno
├── package.json           # Dependencias
├── vite.config.ts         # Configuracion Vite
└── README.md              # Este archivo
```

## Archivos Importantes para Netlify

### netlify.toml
Configuracion de build, redirects y headers. Ya esta optimizado.

### public/_redirects
Configuracion de rutas para SPA. Asegura que React Router funcione correctamente.

### vite.config.ts
Configuracion de Vite optimizada para Netlify.

## Troubleshooting

### Build falla en Netlify

Solucion:
1. Verifica que las variables de entorno esten configuradas
2. Revisa el log de build en Netlify
3. Asegurate que Node version sea 18+

### OAuth no funciona

Solucion:
1. Verifica que VITE_GOOGLE_CLIENT_ID este configurado
2. Revisa que la URL de Netlify este en Google OAuth redirect URIs
3. Verifica configuracion en Supabase Authentication

### Pagina en blanco despues de deploy

Solucion:
1. Verifica que archivo `_redirects` este en `public/`
2. Revisa la consola del navegador para errores
3. Verifica que todas las variables de entorno esten configuradas

### Error 404 en rutas

Solucion:
- Asegurate que `public/_redirects` existe con contenido correcto
- Verifica que `netlify.toml` tenga la configuracion de redirects

## Scripts Disponibles

```bash
npm run dev          # Servidor desarrollo (puerto 5173)
npm run build        # Build de produccion
npm run preview      # Preview del build
npm run lint         # Linter
```

## Variables de Entorno

Ver `.env.example` para lista completa y descripciones.

OBLIGATORIAS:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_GOOGLE_CLIENT_ID

## Actualizaciones Automaticas

Netlify despliega automaticamente cuando:
1. Haces push a la rama main en GitHub
2. Haces merge de un pull request
3. Triggeas un deploy manual desde Netlify UI

## Dominio Custom

En Netlify Dashboard:
1. Domain settings > Add custom domain
2. Sigue las instrucciones DNS
3. Netlify provee SSL automaticamente (Let's Encrypt)

No olvides actualizar:
- Google OAuth redirect URIs
- Supabase Site URL y Redirect URLs

## Monitoreo

Netlify provee:
- Analytics de trafico
- Logs de build
- Logs de funciones
- Alertas de build failures

## Seguridad

- Nunca commitees archivo `.env` con credenciales reales
- Usa variables de entorno de Netlify para secrets
- Las variables VITE_ son publicas en el bundle (solo usa para client-side)
- Para secrets server-side, usa Netlify Functions

## Documentacion Adicional

Ver carpeta `docs/` en el paquete de deployment completo para:
- NETLIFY_DEPLOYMENT.md - Guia detallada de deployment
- OAUTH_SETUP.md - Configuracion completa de OAuth
- TROUBLESHOOTING.md - Solucion de problemas comunes
- VERIFICATION_CHECKLIST.md - Checklist de testing

## Soporte

Para problemas especificos:
1. Revisa logs en Netlify Dashboard
2. Revisa logs en Supabase Dashboard
3. Consulta documentacion de Netlify: https://docs.netlify.com
4. Consulta documentacion de Supabase: https://supabase.com/docs

## Licencia

Proyecto privado - Todos los derechos reservados

---

Desarrollado para deployment optimizado en Netlify
