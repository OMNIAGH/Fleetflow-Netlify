# FleetFlow - Resumen de Deployment en Netlify

## INICIO RAPIDO (5 Pasos)

### 1. Subir a GitHub
```bash
cd fleetflow-netlify
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU-USUARIO/fleetflow-netlify.git
git push -u origin main
```

### 2. Conectar con Netlify
- https://app.netlify.com
- "Add new site" > "Import from GitHub"
- Seleccionar repositorio `fleetflow-netlify`

### 3. Configurar Variables
En Netlify > Site settings > Environment:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 4. Deploy
Click "Deploy site" - Espera 2-3 minutos

### 5. Actualizar URLs OAuth
Google Cloud Console > Agregar redirect URI:
```
https://tu-sitio.netlify.app/auth/callback
```

Supabase > Site URL:
```
https://tu-sitio.netlify.app
```

**LISTO** - Tu aplicacion esta en produccion!

---

## ARCHIVOS CRITICOS

### Para Netlify
- `netlify.toml` - Configuracion de build
- `public/_redirects` - SPA routing
- `.env.example` - Template de variables

### Para GitHub
- `.gitignore` - Protege archivos sensibles
- `GITHUB_SETUP.md` - Como subir a GitHub

### Documentacion
- `README.md` - Guia principal
- `NETLIFY_DEPLOYMENT.md` - Guia detallada (606 lineas)
- Este archivo - Resumen rapido

---

## PREREQUISITOS

### Cuentas (todas gratuitas)
- GitHub: https://github.com
- Netlify: https://netlify.com
- Supabase: https://supabase.com
- Google Cloud: https://console.cloud.google.com

### Software local
- Node.js 18+
- Git

---

## VERIFICACION PRE-DEPLOYMENT

Antes de subir a GitHub, verifica:

```bash
# 1. Archivos criticos existen
ls -la netlify.toml
ls -la public/_redirects
ls -la .env.example
ls -la .gitignore

# 2. NO hay archivos sensibles
# .gitignore debe incluir .env
cat .gitignore | grep ".env"

# 3. Build funciona localmente
npm install
npm run build

# 4. Preview del build
npm run preview
# Abre http://localhost:4173
```

---

## FLUJO COMPLETO

### Fase 1: Preparacion (15 min)
1. Crear proyecto Supabase
2. Ejecutar SQL scripts (01, 02, 03)
3. Crear proyecto Google Cloud
4. Configurar OAuth credentials

### Fase 2: GitHub (5 min)
1. Crear repositorio publico
2. Subir codigo

### Fase 3: Netlify (10 min)
1. Conectar GitHub
2. Configurar variables de entorno
3. Deploy

### Fase 4: Post-Deploy (10 min)
1. Actualizar URLs OAuth en Google
2. Actualizar Site URL en Supabase
3. Testing

**Tiempo total: 40 minutos**

---

## COMANDOS ESENCIALES

### Git
```bash
git add .
git commit -m "mensaje"
git push
```

### NPM
```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo local
npm run build        # Build produccion
npm run preview      # Preview build
```

### Netlify CLI (opcional)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## VARIABLES DE ENTORNO

### Obligatorias
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_CLIENT_ID
```

### Opcionales
```
VITE_GEMINI_API_KEY
VITE_GOOGLE_MAPS_API_KEY
VITE_ENV
```

### Donde configurarlas
- Desarrollo: `.env` (no commitear)
- Netlify: Site settings > Environment

---

## TROUBLESHOOTING RAPIDO

### Build falla
```
Netlify > Deploys > Options > Clear cache and retry deploy
```

### OAuth no funciona
```
Google Cloud Console > Credentials > 
Agregar: https://tu-sitio.netlify.app/auth/callback
```

### Pagina en blanco
```
Verificar variables de entorno en Netlify
Redeploy despues de agregar variables
```

### Error 404 en rutas
```
Verificar que public/_redirects existe
Contenido: /* /index.html 200
```

---

## DEPLOYMENT CONTINUO

Cada push a GitHub despliega automaticamente:

```bash
# Hacer cambios
# ... editar archivos ...

# Subir cambios
git add .
git commit -m "Actualizar funcionalidad X"
git push

# Netlify despliega automaticamente en 2-3 min
```

---

## MONITOREO

### Netlify Dashboard
- Analytics: Trafico y bandwidth
- Deploys: Historial
- Functions: Logs (si usas functions)
- Build logs: Debugging

### Supabase Dashboard
- Database: Datos en tiempo real
- Auth: Usuarios activos
- Storage: Archivos
- Logs: API calls

---

## SEGURIDAD

### NUNCA commitear
- Archivo `.env` con credenciales reales
- `node_modules/`
- Build artifacts (`dist/`)

### Siempre usar
- Variables de entorno en Netlify
- .gitignore apropiado
- HTTPS (Netlify lo provee gratis)

---

## CHECKLIST FINAL

Antes de considerar deployment completo:

**Supabase**
- [ ] Proyecto creado
- [ ] SQL scripts ejecutados
- [ ] Google OAuth configurado

**GitHub**
- [ ] Repositorio creado (publico)
- [ ] Codigo subido
- [ ] .gitignore correcto

**Netlify**
- [ ] Conectado a GitHub
- [ ] Variables configuradas
- [ ] Deploy exitoso

**Post-Deploy**
- [ ] URLs actualizadas en Google OAuth
- [ ] Site URL actualizada en Supabase
- [ ] Login funciona
- [ ] Dashboard carga

---

## SIGUIENTE DEPLOYMENT

Para deployments futuros:

```bash
# 1. Hacer cambios en codigo local
# 2. Test local
npm run dev

# 3. Commit y push
git add .
git commit -m "descripcion"
git push

# 4. Netlify despliega automaticamente
# 5. Verificar en la URL de Netlify
```

**Tiempo: 2-5 minutos**

---

## RECURSOS

### Documentacion en este paquete
- `README.md` - Guia principal de deployment
- `NETLIFY_DEPLOYMENT.md` - Guia paso a paso detallada
- `GITHUB_SETUP.md` - Como crear repositorio
- `DEPLOYMENT_QUICKSTART.md` - Este archivo

### Documentacion oficial
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- Vite: https://vitejs.dev

---

## ESTRUCTURA DEL PROYECTO

```
fleetflow-netlify/
├── public/
│   ├── _redirects         # SPA routing
│   └── ...
├── src/
│   ├── components/        # React components
│   ├── contexts/          # Auth context
│   ├── lib/              # Supabase client
│   └── ...
├── netlify.toml          # Netlify config
├── .env.example          # Template env vars
├── .gitignore            # Git ignore
├── package.json          # Dependencies
├── vite.config.ts        # Vite config
└── README.md             # Main docs
```

---

## SOPORTE

### Problemas con:
- **Netlify**: https://answers.netlify.com
- **Supabase**: https://discord.supabase.com
- **Build**: Revisar logs en Netlify
- **OAuth**: Revisar Google Cloud Console

---

**VERSION**: 1.0.0
**FECHA**: 2025-11-09
**OPTIMIZADO PARA**: Netlify Deployment

---

**SIGUIENTE LECTURA**:
- Nuevo usuario: `NETLIFY_DEPLOYMENT.md`
- Deployment rapido: Este archivo
- Setup GitHub: `GITHUB_SETUP.md`
