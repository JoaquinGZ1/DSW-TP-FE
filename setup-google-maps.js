#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗺️  Configuración de Google Maps API');
console.log('=====================================');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupGoogleMaps() {
  console.log('Para configurar Google Maps, necesitas:');
  console.log('1. Una API key de Google Maps JavaScript API');
  console.log('2. Habilitar la API en Google Cloud Console');
  console.log('');
  
  const hasApiKey = await askQuestion('¿Ya tienes una API key de Google Maps? (s/n): ');
  
  if (hasApiKey.toLowerCase() !== 's') {
    console.log('');
    console.log('📝 Pasos para obtener una API key:');
    console.log('1. Ve a https://console.cloud.google.com/');
    console.log('2. Crea un nuevo proyecto o selecciona uno existente');
    console.log('3. Habilita "Maps JavaScript API"');
    console.log('4. Ve a "Credenciales" y crea una nueva API key');
    console.log('5. Configura las restricciones (opcional)');
    console.log('');
    
    const continueSetup = await askQuestion('¿Quieres continuar con la configuración? (s/n): ');
    if (continueSetup.toLowerCase() !== 's') {
      console.log('Configuración cancelada.');
      rl.close();
      return;
    }
  }
  
  const apiKey = await askQuestion('Ingresa tu API key de Google Maps: ');
  
  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ API key no válida');
    rl.close();
    return;
  }
  
  // Crear archivo .env
  const envPath = path.join(__dirname, '.env');
  const envContent = `# Configuración de Google Maps API
# API key obtenida de: https://console.cloud.google.com/apis/credentials
REACT_APP_GOOGLE_MAPS_API_KEY=${apiKey.trim()}

# Otras configuraciones de entorno pueden ir aquí
`;
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('');
    console.log('✅ Configuración completada!');
    console.log(`📝 Archivo .env creado en: ${envPath}`);
    console.log('');
    console.log('🚀 Próximos pasos:');
    console.log('1. Reinicia el servidor de desarrollo (npm start)');
    console.log('2. Los mapas deberían aparecer en EventoList y EntradaPage');
    console.log('3. Si hay problemas, revisa la consola del navegador');
    console.log('');
    console.log('📚 Documentación completa en: GOOGLE_MAPS_SETUP.md');
    
  } catch (error) {
    console.log('❌ Error al crear el archivo .env:', error.message);
  }
  
  rl.close();
}

// Verificar si ya existe configuración
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('REACT_APP_GOOGLE_MAPS_API_KEY') && 
      !envContent.includes('YOUR_API_KEY_HERE')) {
    console.log('✅ Google Maps ya está configurado');
    console.log('Si quieres cambiar la configuración, edita el archivo .env');
    rl.close();
  } else {
    setupGoogleMaps();
  }
} else {
  setupGoogleMaps();
}
