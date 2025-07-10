const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Google Maps...');
console.log('=====================================');

// Verificar archivo .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Archivo .env encontrado');
  
  if (envContent.includes('REACT_APP_GOOGLE_MAPS_API_KEY')) {
    const match = envContent.match(/REACT_APP_GOOGLE_MAPS_API_KEY=(.+)/);
    if (match) {
      const apiKey = match[1].trim();
      if (apiKey === 'YOUR_API_KEY_HERE') {
        console.log('❌ API Key no configurada (usando placeholder)');
        console.log('📝 Necesitas editar el archivo .env y poner tu API key real');
      } else if (apiKey.length > 20) {
        console.log('✅ API Key configurada');
        console.log(`📝 API Key: ${apiKey.substring(0, 10)}...`);
      } else {
        console.log('⚠️ API Key parece ser muy corta');
        console.log(`📝 API Key: ${apiKey}`);
      }
    }
  } else {
    console.log('❌ Variable REACT_APP_GOOGLE_MAPS_API_KEY no encontrada en .env');
  }
} else {
  console.log('❌ Archivo .env no encontrado');
  console.log('📝 Crea un archivo .env con: REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key');
}

console.log('');
console.log('📚 Para obtener una API key:');
console.log('1. Ve a https://console.cloud.google.com/');
console.log('2. Crea/selecciona un proyecto');
console.log('3. Habilita "Maps JavaScript API"');
console.log('4. Crea credenciales > API key');
console.log('5. Configura restricciones (opcional)');
console.log('');
console.log('💡 Después de configurar la API key, reinicia el servidor con: npm start');
