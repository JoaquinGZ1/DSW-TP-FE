# Configuración de Google Maps API

## Instrucciones para configurar Google Maps

### 1. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Maps JavaScript API
4. Ve a "Credenciales" y crea una nueva API key
5. Configura las restricciones de la API key (opcional pero recomendado)

### 2. Configurar la API Key en el proyecto

1. Abre el archivo `.env` en la carpeta `sge/`
2. Reemplaza `YOUR_API_KEY_HERE` con tu API key real:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

### 3. Reiniciar el servidor

Después de configurar la API key, reinicia el servidor de desarrollo:

```bash
npm start
```

## Funcionalidades del Mapa

### En EventoList.js

- Muestra un mapa interactivo para cada evento
- Marcador con información del evento
- Info window con detalles de la ubicación

### En EntradaPage.js

- Muestra la ubicación de cada evento en las entradas del usuario
- Misma funcionalidad que EventoList.js

### Fallback

- Si no hay API key configurada, muestra un botón para abrir Google Maps
- Manejo de errores robusto
- Estados de carga visual

## Componentes

### MapaEvento.js

- Componente principal del mapa
- Maneja geocodificación automática
- Estados de carga y error
- Configuración personalizable

### MapaFallback.js

- Componente de respaldo cuando Google Maps no está disponible
- Botón para abrir ubicación en Google Maps web

### Configuración

- `src/config/googleMaps.js`: Configuración centralizada
- Estilos personalizables
- Zoom y tipo de mapa configurables

## Uso

```javascript
import MapaEvento from './MapaEvento'

// En tu componente
;<MapaEvento direccion="Av. Corrientes 1000, Buenos Aires, Argentina" />
```

## Estilos

Los estilos están en `MapaEvento.css` y son completamente personalizables:

- Loading spinner animado
- Estados de error
- Responsive design
- Info window personalizada

## Troubleshooting

### "Google Maps API key no configurada"

- Verifica que la API key esté en el archivo `.env`
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto React
- Reinicia el servidor después de cambiar la API key

### "Error al cargar Google Maps"

- Verifica que la API key sea válida
- Asegúrate de que JavaScript API esté habilitada en Google Cloud Console
- Verifica las restricciones de la API key

### "No se pudo encontrar la ubicación"

- La dirección puede ser muy específica o no existir
- Prueba con direcciones más generales
- Verifica que la dirección tenga el formato correcto
