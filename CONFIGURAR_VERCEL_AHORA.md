# 🚀 GUÍA: Configurar Variables de Entorno en Vercel

## ⚠️ PROBLEMA ACTUAL

Tu aplicación en producción está haciendo peticiones a `localhost:4000` en lugar de usar Railway.

---

## ✅ SOLUCIÓN: Configurar REACT_APP_API_URL en Vercel

### Paso 1: Acceder al Dashboard de Vercel

1. Ve a: **https://vercel.com/dashboard**
2. Busca tu proyecto: **dsw-tp-fe** (o similar)
3. Haz clic en el proyecto

### Paso 2: Ir a Settings → Environment Variables

1. En el menú del proyecto, haz clic en **"Settings"**
2. En el menú lateral, busca y haz clic en **"Environment Variables"**

### Paso 3: Agregar la Variable

Haz clic en **"Add New"** y configura:

```
┌──────────────────────────────────────────────────────────┐
│ Name (required)                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ REACT_APP_API_URL                                    │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Value (required)                                         │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ https://dsw-tp-be-production.up.railway.app          │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Environments                                             │
│ ☑ Production                                             │
│ ☐ Preview                                                │
│ ☐ Development                                            │
│                                                          │
│               [Cancel]         [Save]                    │
└──────────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE:**

- Marca **SOLO** "Production" ✅
- La variable debe llamarse exactamente `REACT_APP_API_URL`
- La URL NO debe terminar con `/` (sin barra al final)

### Paso 4: Redeploy SIN Cache

Después de agregar la variable:

1. Ve a la pestaña **"Deployments"**
2. Busca el último deployment (el que acaba de hacer al pushear)
3. Haz clic en los **tres puntos (⋮)** al lado derecho
4. Selecciona **"Redeploy"**
5. **⚠️ CRÍTICO:** En el modal que aparece, **DESMARCA** la opción:
   ```
   ☐ Use existing Build Cache
   ```
6. Haz clic en **"Redeploy"**

---

## 🔍 VERIFICAR QUE FUNCIONA

### Opción 1: Con el Componente de Diagnóstico (Nuevo)

Una vez que el deployment termine:

1. Abre tu sitio de Vercel
2. En la parte **inferior** de la página verás una barra de diagnóstico
3. Verifica que muestre:

   ```
   NODE_ENV: production
   REACT_APP_API_URL: https://dsw-tp-be-production.up.railway.app
   config.apiUrl: https://dsw-tp-be-production.up.railway.app  (en verde)
   isProduction: true
   ```

4. Haz clic en el botón **"Probar Conexión"**
   - Debe mostrar: ✅ Conexión exitosa

**⚠️ Si ves:**

- `config.apiUrl` en **rojo** con `localhost:4000`
- Una alerta roja: "ERROR: En producción pero usando localhost"

→ **Significa que Vercel NO tiene la variable configurada**

### Opción 2: Con DevTools

1. Abre tu sitio en Vercel
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **"Console"**
4. Busca los logs:

   ```
   🔧 Entorno: production
   🌐 API URL: https://dsw-tp-be-production.up.railway.app
   ```

5. Ve a la pestaña **"Network"**
6. Intenta hacer login o cualquier acción
7. Verifica que las peticiones vayan a:
   ```
   https://dsw-tp-be-production.up.railway.app/api/...
   ```

---

## 🐛 TROUBLESHOOTING

### Problema: Sigue apareciendo localhost

**Causas posibles:**

1. **Cache del navegador**

   - **Solución:** Hard refresh (`Ctrl + Shift + R` en Windows)
   - O abre en modo incógnito

2. **Variable mal escrita**

   - **Verifica:** Debe ser exactamente `REACT_APP_API_URL` (con guiones bajos)
   - No usar espacios ni mayúsculas/minúsculas incorrectas

3. **No se hizo redeploy sin cache**

   - **Solución:** Hacer redeploy nuevamente y **desmarcar** "Use existing Build Cache"

4. **La variable no está marcada para Production**
   - **Solución:** Editar la variable en Vercel y asegurar que "Production" esté marcada

### Problema: Error de CORS

Si ves en console: `Access to fetch... has been blocked by CORS policy`

**Solución:** Verificar que el backend en Railway tenga configurado FRONTEND_URL:

1. Ve a Railway → tu proyecto backend → Variables
2. Agrega:
   ```
   FRONTEND_URL=https://tu-sitio.vercel.app
   ```

---

## 📋 CHECKLIST FINAL

Antes de cerrar, verifica:

- [ ] Variable `REACT_APP_API_URL` creada en Vercel
- [ ] Valor: `https://dsw-tp-be-production.up.railway.app`
- [ ] Marcado "Production" en Environments
- [ ] Redeploy sin cache ejecutado
- [ ] Componente de diagnóstico muestra verde
- [ ] Network tab muestra peticiones a Railway
- [ ] NO hay errores de CORS

---

## 🎯 RESUMEN

**Lo que NECESITAS hacer en Vercel:**

1. Settings → Environment Variables → Add New
2. Name: `REACT_APP_API_URL`
3. Value: `https://dsw-tp-be-production.up.railway.app`
4. Environments: ✅ Production
5. Save
6. Deployments → Redeploy → ☐ Use existing Build Cache

**¡Eso es todo!** Una vez hecho esto, tu app funcionará en producción. 🎉

---

**Última actualización:** Noviembre 4, 2025
**Deployment actual:** Con componente de diagnóstico incluido
