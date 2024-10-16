import { removeAccents } from "../utils/helpers"; // Asegúrate de que la función se llama 'removeAccents' (corrige el typo)

const formatearTextoParaServidor = (texto) => {
  // Eliminar acentos y convertir a minúsculas
  return removeAccents(texto.toLowerCase());
};

const formatearTextoParaMostrar = (texto) => {
  // Convertir la primera letra de cada palabra a mayúscula
  return texto.replace(/\b\w/g, (char) => char.toUpperCase());
};

const FormatearDatos = (data) => {
  const formateadosParaServidor = {
    nuevoPais: formatearTextoParaServidor(data.nuevoPais),
    nuevoCodigoPais: data.nuevoCodigoPais,
    nuevaRegion: formatearTextoParaServidor(data.nuevaRegion),
    nuevoCodigoRegion: data.nuevoCodigoRegion,
    nuevaProvincia: formatearTextoParaServidor(data.nuevaProvincia),
    nuevaComuna: formatearTextoParaServidor(data.nuevaComuna),
    nuevaCiudad: formatearTextoParaServidor(data.nuevaCiudad)
  };

  const formateadosParaMostrar = {
    nuevoPais: formatearTextoParaMostrar(data.nuevoPais),
    nuevoCodigoPais: data.nuevoCodigoPais,
    nuevaRegion: formatearTextoParaMostrar(data.nuevaRegion),
    nuevoCodigoRegion: data.nuevoCodigoRegion,
    nuevaProvincia: formatearTextoParaMostrar(data.nuevaProvincia),
    nuevaComuna: formatearTextoParaMostrar(data.nuevaComuna),
    nuevaCiudad: formatearTextoParaMostrar(data.nuevaCiudad)
  };

  return {
    formateadosParaServidor,
    formateadosParaMostrar
  };
};

export default FormatearDatos;
