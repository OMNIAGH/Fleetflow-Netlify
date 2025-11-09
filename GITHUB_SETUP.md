# Instrucciones: Crear Repositorio GitHub para FleetFlow

## Opcion 1: Crear Repositorio desde GitHub Web UI

### Paso 1: Crear el Repositorio

1. Ve a https://github.com/new
2. Configuracion:
   - **Repository name**: `fleetflow-netlify`
   - **Description**: "Sistema de gestion de flotas con OAuth Analytics - Optimizado para Netlify"
   - **Visibility**: **Public** (para que sea accesible publicamente)
   - **Initialize**: NO marques ninguna opcion (README, .gitignore, license)
3. Click "Create repository"

### Paso 2: Subir el Codigo

GitHub te mostrara instrucciones. Usa estas:

```bash
# Navega a la carpeta del proyecto
cd /ruta/a/fleetflow-netlify

# Inicializa Git (si no esta inicializado)
git init

# Agrega todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: FleetFlow optimizado para Netlify"

# Conecta con GitHub (reemplaza TU-USUARIO con tu nombre de usuario)
git remote add origin https://github.com/TU-USUARIO/fleetflow-netlify.git

# Renombra la rama principal a 'main'
git branch -M main

# Sube el codigo
git push -u origin main
```

### Paso 3: Verificar

1. Refresca la pagina de tu repositorio en GitHub
2. Deberias ver todos los archivos
3. Verifica que estos archivos criticos esten presentes:
   - `netlify.toml`
   - `public/_redirects`
   - `.env.example`
   - `README.md`
   - `NETLIFY_DEPLOYMENT.md`

---

## Opcion 2: Usar GitHub CLI

Si tienes GitHub CLI instalado (https://cli.github.com):

```bash
# Navega a la carpeta
cd /ruta/a/fleetflow-netlify

# Inicializa Git
git init

# Crea el repositorio en GitHub directamente
gh repo create fleetflow-netlify --public --source=. --remote=origin

# Agrega archivos
git add .

# Commit
git commit -m "Initial commit: FleetFlow optimizado para Netlify"

# Push
git push -u origin main
```

---

## Opcion 3: Clonar Template y Reemplazar

Si ya tienes un repositorio template:

```bash
# Clona el template
git clone https://github.com/TU-USUARIO/template-repo.git fleetflow-netlify
cd fleetflow-netlify

# Elimina el historial del template
rm -rf .git

# Copia los archivos de FleetFlow aqui

# Inicializa nuevo repositorio
git init
git add .
git commit -m "Initial commit: FleetFlow optimizado para Netlify"

# Crea nuevo repositorio en GitHub y conecta
git remote add origin https://github.com/TU-USUARIO/fleetflow-netlify.git
git branch -M main
git push -u origin main
```

---

## Archivos que DEBEN estar en el Repositorio

Verifica que estos archivos esten presentes:

### Archivos de Configuracion
- [ ] `netlify.toml` - Configuracion de Netlify
- [ ] `public/_redirects` - Routing para SPA
- [ ] `.gitignore` - Ignorar node_modules, .env, dist
- [ ] `.env.example` - Template de variables de entorno
- [ ] `package.json` - Dependencias del proyecto
- [ ] `vite.config.ts` - Configuracion de Vite

### Documentacion
- [ ] `README.md` - Guia principal
- [ ] `NETLIFY_DEPLOYMENT.md` - Guia detallada de deployment
- [ ] `GITHUB_SETUP.md` - Este archivo

### Codigo Fuente
- [ ] `src/` - Codigo fuente completo
- [ ] `components/` - Componentes React
- [ ] `contexts/` - React Contexts
- [ ] `hooks/` - Custom hooks
- [ ] `lib/` - Supabase client
- [ ] `pages/` - Paginas de la aplicacion
- [ ] `public/` - Assets estaticos
- [ ] `App.tsx` - Componente principal
- [ ] `index.html` - HTML entry point

---

## Archivos que NO deben estar en el Repositorio

Asegurate de que `.gitignore` excluya:

```gitignore
# Dependencias
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Testing
coverage/

# Misc
*.log
.cache/
```

---

## Verificacion de .gitignore

Antes de hacer commit:

```bash
# Ver que archivos se agregaran
git status

# Si ves node_modules/ o .env, DETENTE
# Agrega esos patrones a .gitignore primero

# Despues de actualizar .gitignore
git add .gitignore
git commit -m "Actualizar .gitignore"
```

---

## Hacer el Repositorio Publico

Si creaste el repositorio como privado y necesitas hacerlo publico:

1. Ve a tu repositorio en GitHub
2. **Settings** tab
3. Scroll hasta abajo: **Danger Zone**
4. Click "Change visibility"
5. Selecciona "Make public"
6. Confirma escribiendo el nombre del repositorio

---

## Clonar el Repositorio en Otro Lugar

Una vez que el codigo esta en GitHub, cualquiera puede clonarlo:

```bash
# Clonar
git clone https://github.com/TU-USUARIO/fleetflow-netlify.git

# Entrar
cd fleetflow-netlify

# Instalar dependencias
npm install

# Copiar template de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
nano .env

# Iniciar en desarrollo
npm run dev
```

---

## Proteger la Rama Main

Para proyectos en produccion, considera proteger main:

1. Repositorio > **Settings** > **Branches**
2. **Add rule**
3. **Branch name pattern**: `main`
4. Marca:
   - "Require a pull request before merging"
   - "Require status checks to pass"
5. **Create**

Esto previene push directo a main, requiere Pull Requests.

---

## Colaboradores

Para agregar colaboradores:

1. Repositorio > **Settings** > **Collaborators**
2. **Add people**
3. Ingresa usuario o email
4. Selecciona nivel de permiso
5. **Add**

---

## Releases y Tags

Para versionar tu codigo:

```bash
# Crear tag
git tag -a v1.0.0 -m "Version 1.0.0 - Release inicial"

# Subir tag
git push origin v1.0.0

# Crear release en GitHub
# Ve a Releases > Create a new release
# Selecciona el tag, agrega notas de version
```

---

## Workflows con GitHub Actions (Opcional)

Puedes agregar CI/CD con GitHub Actions:

Crea `.github/workflows/test.yml`:

```yaml
name: Test Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
```

Esto verifica que el build funcione en cada push.

---

## Sincronizar Cambios

Despues del setup inicial, workflow normal:

```bash
# Hacer cambios en el codigo

# Ver que cambio
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Descripcion de los cambios"

# Subir a GitHub
git push

# Netlify desplegara automaticamente
```

---

## Branches para Features

Para trabajar en nuevas funcionalidades:

```bash
# Crear nueva branch
git checkout -b feature/nueva-funcionalidad

# Trabajar en la funcionalidad
# ... hacer cambios ...

# Commit
git add .
git commit -m "Implementar nueva funcionalidad"

# Push de la branch
git push origin feature/nueva-funcionalidad

# En GitHub, crear Pull Request
# Revisar cambios
# Merge a main cuando este listo
```

---

## Troubleshooting GitHub

### Error: Permission denied (publickey)

Solucion:
```bash
# Usar HTTPS en vez de SSH
git remote set-url origin https://github.com/TU-USUARIO/fleetflow-netlify.git

# O configurar SSH key
# Ver: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Error: Repository not found

Solucion:
- Verifica que el nombre del repositorio sea correcto
- Verifica que tengas permisos
- Si es privado, asegurate de estar autenticado

### No puedo hacer push

Solucion:
```bash
# Si hay conflictos
git pull origin main
# Resuelve conflictos si los hay
git push origin main
```

---

## URLs Importantes

- Tu repositorio: `https://github.com/TU-USUARIO/fleetflow-netlify`
- Clonar (HTTPS): `https://github.com/TU-USUARIO/fleetflow-netlify.git`
- Clonar (SSH): `git@github.com:TU-USUARIO/fleetflow-netlify.git`

---

## Siguiente Paso

Una vez que el codigo este en GitHub:

1. Ve a `NETLIFY_DEPLOYMENT.md`
2. Sigue la seccion "Deployment en Netlify"
3. Conecta GitHub con Netlify
4. Deploy automaticamente

---

**Checklist antes de proceder a Netlify:**

- [ ] Repositorio creado en GitHub como publico
- [ ] Codigo completo subido a GitHub
- [ ] .gitignore configurado correctamente
- [ ] NO hay archivos .env con credenciales reales
- [ ] netlify.toml presente
- [ ] public/_redirects presente
- [ ] README.md presente y actualizado

---

Siguiente lectura: `NETLIFY_DEPLOYMENT.md`
