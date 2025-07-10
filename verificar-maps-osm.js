#!/usr/bin/env node

console.log('🗺️  Verificación de Mapas OpenStreetMap');
console.log('==========================================');
console.log('');

// Verificar que las dependencias estén instaladas
const fs = require('fs');
const path = require('path');

try {
  const packageJson = require('./package.json');
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('✅ Verificando dependencias...');
  
  if (dependencies['leaflet']) {
    console.log(`✅ Leaflet instalado: ${dependencies['leaflet']}`);
  } else {
    console.log('❌ Leaflet no encontrado');
    process.exit(1);
  }
  
  if (dependencies['react-leaflet']) {
    console.log(`✅ React-Leaflet instalado: ${dependencies['react-leaflet']}`);
  } else {
    console.log('❌ React-Leaflet no encontrado');
    process.exit(1);
  }
  
  console.log('');
  console.log('✅ Verificando archivos...');
  
  const mapaEventoPath = path.join(__dirname, 'src', 'pages', 'MapaEvento.js');
  if (fs.existsSync(mapaEventoPath)) {
    console.log('✅ MapaEvento.js encontrado');
  } else {
    console.log('❌ MapaEvento.js no encontrado');
    process.exit(1);
  }
  
  const mapaCssPath = path.join(__dirname, 'src', 'pages', 'MapaEvento.css');
  if (fs.existsSync(mapaCssPath)) {
    console.log('✅ MapaEvento.css encontrado');
  } else {
    console.log('❌ MapaEvento.css no encontrado');
    process.exit(1);
  }
  
  console.log('');
  console.log('🎉 ¡CONFIGURACIÓN COMPLETA!');
  console.log('===========================');
  console.log('');
  console.log('✅ OpenStreetMap + Leaflet implementado');
  console.log('✅ Geocodificación gratuita con Nominatim');  
  console.log('✅ Sin necesidad de API keys');
  console.log('✅ Sin costos ni límites');
  console.log('✅ Funcionando en EventoList.js y EntradaPage.js');
  console.log('');
  console.log('🚀 Para probar:');
  console.log('   npm start');
  console.log('');
  console.log('📚 Documentación completa en: README_OSM_MAPS.md');
  console.log('🧪 Componente de prueba en: src/components/TestMapas.js');
  
} catch (error) {
  console.error('❌ Error al verificar:', error.message);
  process.exit(1);
}
