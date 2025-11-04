# 🗺️ Implementación de Mapas

## Tecnología Utilizada

**Google Maps JavaScript API** - API de Google para integrar mapas interactivos en aplicaciones web.
**Librería**: `@react-google-maps/api` - Componentes de React para Google Maps.

## ¿Cómo Funciona?

### 1. Obtener API Key

1. Acceder a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto nuevo
3. Habilitar las siguientes APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Crear credenciales → API Key
5. Copiar la clave generada

### 2. Configuración (Frontend)

**Archivo**: `.env`

```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Instalar librería**:

```bash
npm install @react-google-maps/api
```

### 3. Componente de Mapa

**Archivo**: `src/components/MapaEvento.js`

```javascript
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from '@react-google-maps/api'

function MapaEvento({ ubicacion, onUbicacionChange, readOnly }) {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  }

  const center = {
    lat: ubicacion?.lat || -31.4135, // Rosario por defecto
    lng: ubicacion?.lng || -60.6667,
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onClick={
          readOnly
            ? null
            : (e) => {
                // Obtener coordenadas al hacer clic
                onUbicacionChange({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                })
              }
        }
      >
        {/* Marcador en la ubicación */}
        {ubicacion && <Marker position={ubicacion} />}
      </GoogleMap>
    </LoadScript>
  )
}
```

### 4. Autocompletar Direcciones (Opcional)

```javascript
import { Autocomplete } from '@react-google-maps/api'

function SearchBox({ onPlaceSelect }) {
  const [autocomplete, setAutocomplete] = useState(null)

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      onPlaceSelect({ lat, lng, address: place.formatted_address })
    }
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input type="text" placeholder="Buscar dirección..." />
    </Autocomplete>
  )
}
```

### 5. Guardar Ubicación en Backend

**En el formulario de crear evento**:

```javascript
const [ubicacion, setUbicacion] = useState({ lat: -31.4135, lng: -60.6667 })

// Al enviar el formulario
const formData = new FormData()
formData.append('ubicacion', JSON.stringify(ubicacion))

await axios.post('http://localhost:4000/api/eventos', formData)
```

**Backend guarda como string JSON**:

```typescript
// src/evento/evento.entity.ts
@Property({ nullable: false })
ubicacion!: string;  // Ejemplo: '{"lat":-31.4135,"lng":-60.6667}'
```

### 6. Mostrar Mapa en Detalle de Evento

```javascript
function EventoDetalle() {
  const [evento, setEvento] = useState(null)

  useEffect(() => {
    // Cargar evento
    axios.get(`/api/eventos/${id}`).then((res) => {
      const eventoData = res.data
      // Parsear ubicación
      eventoData.ubicacion = JSON.parse(eventoData.ubicacion)
      setEvento(eventoData)
    })
  }, [])

  return (
    <div>
      <h1>{evento?.name}</h1>
      <MapaEvento ubicacion={evento?.ubicacion} readOnly={true} />
    </div>
  )
}
```

## Flujo Completo

### Crear Evento (Organizador):

```
Organizador abre formulario
        ↓
Mapa se carga en ubicación por defecto
        ↓
Organizador hace clic en el mapa
   O busca dirección con autocomplete
        ↓
Se obtienen coordenadas (lat, lng)
        ↓
Se guarda ubicación al crear evento
        ↓
Backend almacena JSON: {"lat": -31.4135, "lng": -60.6667}
```

### Ver Evento (Usuario):

```
Usuario abre detalle de evento
        ↓
Frontend obtiene datos del evento
        ↓
Parsea ubicación de JSON a objeto
        ↓
Mapa se centra en las coordenadas
        ↓
Marcador muestra ubicación exacta
```

## Modos de Uso

### Modo Lectura (Usuarios)

```javascript
<MapaEvento ubicacion={{ lat: -31.4135, lng: -60.6667 }} readOnly={true} />
```

- ✅ Solo visualización
- ✅ No permite hacer clic
- ✅ Muestra marcador

### Modo Edición (Organizadores)

```javascript
<MapaEvento
  ubicacion={ubicacion}
  onUbicacionChange={setUbicacion}
  readOnly={false}
/>
```

- ✅ Permite hacer clic para cambiar ubicación
- ✅ Autocompletar direcciones
- ✅ Actualiza estado en tiempo real

## APIs de Google Maps Utilizadas

1. **Maps JavaScript API**: Renderizar el mapa
2. **Places API**: Autocompletar direcciones
3. **Geocoding API**: Convertir direcciones a coordenadas

## Características

- ✅ Mapa interactivo con zoom y navegación
- ✅ Marcador en ubicación del evento
- ✅ Clic para seleccionar ubicación (organizadores)
- ✅ Autocompletar direcciones
- ✅ Responsive (se adapta a móviles)
- ✅ Ubicación por defecto en Rosario, Argentina

## Estructura de Datos

```javascript
// Ubicación almacenada
{
  "lat": -31.4135,        // Latitud
  "lng": -60.6667,        // Longitud
  "address": "Av. Pellegrini 1234, Rosario"  // Opcional
}
```

## Nota Importante

⚠️ La API de Google Maps **requiere facturación habilitada** en Google Cloud, aunque ofrece **$200 USD de crédito mensual gratis**, suficiente para la mayoría de aplicaciones pequeñas.
