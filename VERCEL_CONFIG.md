# 🚀 Configuración de Variables de Entorno en Vercel

## ⚠️ IMPORTANTE: Esto es lo que falta para que funcione en producción

El frontend está desplegado, pero **Vercel necesita saber la URL del backend**.

---

## 📋 Pasos para Configurar Vercel

### 1. Ir al Dashboard de Vercel
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto: **dsw-tp-fe**

### 2. Configurar Variables de Entorno
1. En el proyecto, ve a: **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `REACT_APP_API_URL` | `https://dsw-tp-be-production.up.railway.app` | ✅ Production<br>✅ Preview<br>✅ Development |
| `GENERATE_SOURCEMAP` | `false` | ✅ Production<br>✅ Preview |

### 3. Ejemplo Visual
```
┌─────────────────────────────────────────────────┐
│ Add New Variable                                │
├─────────────────────────────────────────────────┤
│ Name: REACT_APP_API_URL                         │
│ Value: https://dsw-tp-be-production.up.railway.app │
│ Environments:                                   │
│   ✅ Production                                 │
│   ✅ Preview                                    │
│   ✅ Development                                │
│                                                 │
│         [Add]                                   │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Forzar Rebuild Completo

Después de agregar las variables:

### Opción 1: Desde el Dashboard de Vercel
1. Ve a **Deployments**
2. Encuentra el último deployment
3. Click en **⋮** (tres puntos)
4. Click en **Redeploy**
5. ✅ **IMPORTANTE:** Marca la opción **"Use existing Build Cache"** como **OFF** (desmarcada)

### Opción 2: Desde Git
```bash
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE

# Hacer un cambio mínimo para forzar rebuild
git commit --allow-empty -m "chore: force rebuild with env vars"
git push origin master
```

---

## ✅ Verificar que Funciona

### 1. Abrir la Consola del Navegador
1. Abre tu sitio en Vercel: `https://dsw-tp-fe-update-xxx.vercel.app`
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**

Deberías ver:
```
🔧 Entorno: production
🌐 API URL: https://dsw-tp-be-production.up.railway.app
```

### 2. Verificar Network Tab
1. En DevTools, ve a **Network**
2. Intenta hacer login o cualquier acción
3. Verifica que las peticiones vayan a:
   ```
   https://dsw-tp-be-production.up.railway.app/api/...
   ```
   
   ❌ **NO** debería aparecer:
   ```
   http://localhost:4000/api/...
   ```

---

## 🐛 Troubleshooting

### Problema: Todavía aparece localhost:4000
**Causa:** Cache del navegador o cache de Vercel

**Solución:**
1. Fuerza un hard refresh:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
2. O abre en modo incógnito
3. O limpia cache del navegador

### Problema: No aparecen los logs de entorno
**Causa:** La variable no está configurada en Vercel

**Solución:**
1. Verifica que `REACT_APP_API_URL` esté en Environment Variables
2. Asegúrate de que esté marcada para **Production**
3. Haz redeploy sin cache

### Problema: Error 404 en las peticiones
**Causa:** La URL del backend es incorrecta

**Solución:**
1. Verifica que Railway esté corriendo: https://dsw-tp-be-production.up.railway.app/api/categorias
2. Debe responder JSON, no error
3. Si funciona, revisa la variable de entorno en Vercel

---

## 📚 Resumen

### Local Development
- **Archivo:** `.env`
- **URL Backend:** `http://localhost:4000`
- **Detecta automáticamente:** `NODE_ENV === 'development'`

### Production (Vercel)
- **Configuración:** Dashboard de Vercel → Environment Variables
- **URL Backend:** `https://dsw-tp-be-production.up.railway.app`
- **Detecta automáticamente:** `NODE_ENV === 'production'`

### Orden de Prioridad en config.js
```javascript
1. REACT_APP_API_URL (si existe en .env o Vercel)
2. NODE_ENV === 'production' → Railway URL
3. NODE_ENV === 'development' → localhost:4000
```

---

## 🎯 Checklist Final

- [ ] Variables agregadas en Vercel dashboard
- [ ] Redeploy sin cache ejecutado
- [ ] Console muestra "production" y Railway URL
- [ ] Network tab muestra peticiones a Railway
- [ ] Login funciona correctamente
- [ ] No hay errores de CORS

---

¡Listo! Con esto tu aplicación debería funcionar correctamente en producción. 🎉
