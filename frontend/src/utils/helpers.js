// Función para capitalizar palabras excepto "y"
export const capitalizarPalabras = (texto) => {
  return texto.split(' ').map((palabra) => {
    if (palabra.toLowerCase() === "y") {
      return palabra.toLowerCase();
    }
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
  }).join(' ');
};