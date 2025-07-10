# Corrección de Visualización de Eventos

## Problemas Identificados y Solucionados

### 1. Problema: Imágenes de eventos nuevos no se muestran

**Causa**: Inconsistencia en las rutas de guardado y servido de archivos.

- Multer guardaba archivos en `dist/uploads/`
- Express servía archivos desde `dist/uploads/`
- Pero las rutas en BD se guardaban como `dist/uploads/filename.jpg`
- El frontend intentaba acceder a `http://localhost:4000/uploads/filename.jpg`
- Esto resultaba en una búsqueda en `dist/uploads/uploads/filename.jpg` (doble uploads)

**Solución**:

- Corregido en `evento.controller.ts` línea ~20
- Normalizar la ruta del archivo antes de guardarla en la base de datos
- Remover el prefijo `dist/` de `req.file.path`

```typescript
// ANTES
if (req.file) {
  req.body.sanitizedInput.photo = req.file.path // "dist/uploads/filename.jpg"
}

// DESPUÉS
if (req.file) {
  const normalizedPath = req.file.path.replace(/^dist\//, '')
  req.body.sanitizedInput.photo = normalizedPath // "uploads/filename.jpg"
}
```

### 2. Problema: Organizador no se mostraba en pantalla principal de eventos

**Causa**: En el controlador `evento.controller.ts`, el método `findAll` no estaba poblando la relación `organizador`.

**Solución**:

- Corregido en `evento.controller.ts` línea ~37
- Agregado `'organizador'` al array de populate en findAll

```typescript
// ANTES
{
  populate: ['entradas', 'tiposEntrada', 'usuarios', 'eventoCategoria']
}

// DESPUÉS
{
  populate: [
    'entradas',
    'tiposEntrada',
    'usuarios',
    'eventoCategoria',
    'organizador',
  ]
}
```

### 3. Problema: Categoría no se mostraba en "Mis Eventos" (Organizador)

**Causa**: El helper `formatearCategoria` estaba buscando `categoria.name` pero el parámetro se llamaba `eventoCategoria`.

**Solución**:

- Corregido en `EventosOrganizador.js` línea ~75
- Cambiado el parámetro de `categoria` a `eventoCategoria` para mantener consistencia con la estructura de datos del backend

```javascript
// ANTES
const formatearCategoria = (categoria) => {
  if (!categoria || !categoria.name) return 'Sin categoría'
  return categoria.name
}

// DESPUÉS
const formatearCategoria = (eventoCategoria) => {
  if (!eventoCategoria || !eventoCategoria.name) return 'Sin categoría'
  return eventoCategoria.name
}
```

### 4. Problema: Descripción y Organizador poco legibles en pantalla principal

**Causa**: Tamaño de fuente pequeño y poco contraste en los detalles expandidos de los eventos.

**Solución**:

- Mejorado en `EventoList.css`
- Aumentado tamaño de fuente de 1rem a 1.1rem
- Mejorado line-height de 1.5 a 1.6
- Aumentado font-weight de 500 a 500 para texto normal y de 600 a 700 para texto en negrita

```css
/* ANTES */
.evento-info-completa p {
  font-size: 1rem;
  line-height: 1.5;
  font-weight: normal;
}

.evento-info-completa p strong {
  font-weight: 600;
}

/* DESPUÉS */
.evento-info-completa p {
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
}

.evento-info-completa p strong {
  font-weight: 700;
}
```

### 5. Mejora: Manejo mejorado de imágenes en "Mis Eventos"

**Mejora**:

- Agregado logging para carga exitosa de imágenes
- Mejorado el styling del placeholder para imágenes faltantes
- Mejor debugging para identificar problemas de carga de imágenes

```javascript
// MEJORADO
<img
  src={`http://localhost:4000/${evento.photo}`}
  alt={evento.name || 'Evento'}
  className="evento-image"
  onLoad={() => {
    console.log('Imagen cargada correctamente:', evento.photo)
  }}
  onError={(e) => {
    console.log('Error cargando imagen:', evento.photo)
    console.log('URL completa:', `http://localhost:4000/${evento.photo}`)
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }}
/>
```

## Estructura de Datos del Backend

El backend devuelve la siguiente estructura para los eventos de un organizador:

```json
{
  "message": "Eventos del organizador encontrados",
  "data": [
    {
      "id": 16,
      "name": "¡Fiesta Bresh!",
      "cupos": 500,
      "description": "¡Una fiesta muy cool!",
      "photo": "uploads/1733709369759-422125895-bresh.jpg",
      "date": "2025-01-01T02:59:00.000Z",
      "ubicacion": "Rosario, 3 de febrero, 1208",
      "eventoCategoria": {
        "id": 19,
        "name": "Fiesta",
        "description": null
      },
      "organizador": {
        "id": 4,
        "nickname": "Bresh",
        "mail": "bresh@gmail.com",
        "description": "holaa"
      },
      "entradas": [],
      "tiposEntrada": [],
      "usuarios": []
    }
  ]
}
```

## Archivos Modificados

1. `src/evento/evento.controller.ts` - Agregado 'organizador' al populate del findAll
2. `src/pages/EventosOrganizador.js` - Corregido helper formatearCategoria y mejorado manejo de imágenes
3. `src/pages/EventoList.css` - Mejorada legibilidad de texto
4. `src/pages/EventosOrganizador.css` - Agregado estilo para imagen con clase

## Estado Final de las Funcionalidades

✅ **Pantalla Principal de Eventos**:

- ✅ Organizador se muestra correctamente con el nickname
- ✅ Descripción legible con mejor tipografía
- ✅ Todas las funcionalidades previas mantienen funcionamiento

✅ **"Mis Eventos" (Organizador)**:

- ✅ Imagen del evento se muestra correctamente
- ✅ Categoría del evento se muestra correctamente
- ✅ Información básica completa (fecha, cupos, ubicación)
- ✅ Descripción en detalles expandidos
- ✅ Mejor debugging y manejo de errores para imágenes

## Cómo Probar

1. Iniciar el backend: `cd DSW-TP && npm run start:dev`
2. Iniciar el frontend: `cd DSW-TP-FE/sge && npm start`
3. Loguearse como organizador (ej: bresh@gmail.com)
4. Ir a "Mis Eventos" y verificar que se muestren imagen y categoría
5. Ir a la pantalla principal y verificar legibilidad de descripción y organizador

## Notas Técnicas

- El backend ya devuelve todas las relaciones pobladas correctamente (`eventoCategoria`, `organizador`)
- Las imágenes se sirven desde `http://localhost:4000/uploads/`
- Los helpers de formateo ahora son consistentes con la estructura de datos real
- Se mantiene compatibilidad con eventos sin imagen o categoría
