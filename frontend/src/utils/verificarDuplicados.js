import instance from "../axiosConfig";

// Verificación genérica de duplicados
const verificarDuplicado = async (url, valor) => {
  if (valor && valor.length > 0) {
    try {
      const response = await instance.get(`${url}=${valor}`);
      return response.data.length > 0;  // Retorna `true` si hay duplicados
    } catch (error) {
      console.error(`Error verificando duplicado: ${error}`);
      return false;  // En caso de error, lo manejamos retornando `false`
    }
  }
  return false;
};

// Verificación de duplicados para cada entidad
export const verificarPais = (nuevoPais) => {
  return verificarDuplicado("paises/nombre_pais", nuevoPais);
};

export const verificarCodigoPais = (nuevoCodigoPais) => {
  return verificarDuplicado("paises/codigo_pais", nuevoCodigoPais);
};

export const verificarRegion = (nuevaRegion) => {
  return verificarDuplicado("regiones/nombre_region", nuevaRegion);
};

export const verificarCodigoRegion = (nuevoCodigoRegion) => {
  return verificarDuplicado("regiones/codigo_region", nuevoCodigoRegion);
};

export const verificarProvincia = (nuevaProvincia) => {
  return verificarDuplicado("provincias/nombre_provincia", nuevaProvincia);
};

export const verificarComuna = (nuevaComuna) => {
  return verificarDuplicado("comunas/nombre_comuna", nuevaComuna);
};

export const verificarCiudad = (nuevaCiudad) => {
  return verificarDuplicado("ciudades/nombre_ciudad", nuevaCiudad);
};
