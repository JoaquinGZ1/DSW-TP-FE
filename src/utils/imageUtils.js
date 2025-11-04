import config from '../config';

/**
 * Obtiene la URL correcta de una imagen
 * Si la ruta ya es una URL completa (Cloudinary), la retorna directamente
 * Si es una ruta local, la concatena con el apiUrl
 * @param {string} imagePath - La ruta de la imagen (puede ser URL completa o ruta relativa)
 * @returns {string|null} - La URL completa de la imagen o null si no hay imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si la imagen ya es una URL completa (empieza con http:// o https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si no, es una ruta local y necesita el apiUrl
  return `${config.apiUrl}/${imagePath}`;
};

/**
 * Props comunes para imágenes con manejo de errores
 * @param {string} imageUrl - URL de la imagen
 * @param {string} altText - Texto alternativo
 * @returns {object} - Props para el tag <img>
 */
export const getImageProps = (imageUrl, altText = 'Imagen') => {
  return {
    src: getImageUrl(imageUrl),
    alt: altText,
    onError: (e) => {
      console.error('❌ Error cargando imagen:', imageUrl);
      e.target.style.display = 'none';
      if (e.target.parentElement) {
        e.target.parentElement.innerHTML = '<div class="evento-placeholder">🎭 Error al cargar imagen</div>';
      }
    },
    onLoad: () => {
      console.log('✅ Imagen cargada correctamente:', imageUrl);
    }
  };
};
