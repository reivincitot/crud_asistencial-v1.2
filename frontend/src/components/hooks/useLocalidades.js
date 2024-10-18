// hooks/useLocalidades.js
import { useState, useEffect } from "react";
import instance from "../axiosConfig";


/**
 * Custom hook para gestionar la selección de localidades (países, regiones, provincias, comunas).
 * 
 * Este hook se encarga de:
 * - Obtener las localidades desde la API.
 * - Actualizar el estado de las localidades seleccionadas.
 * - Proporcionar funciones para actualizar el estado.
 *
 * @returns {{
 *   paisSeleccionado: string,
 *   setPaisSeleccionado: (pais) => void,
 *   regiones: Array,
 *  * }}
 */


const useLocalidades = () => {
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [codigoPaisSeleccionado, setCodigoPaisSeleccionado] = useState('');
  const [regionSeleccionado, setRegionSeleccionado] = useState('');
  const [codigoRegionSeleccionado, setCodigoRegionSeleccionado] = useState('');
  const [regiones, setRegiones] = useState([]);

  useEffect(() => {
    if (paisSeleccionado) {
      // Cargar regiones asociadas al país seleccionado
      instance.get(`regiones/?pais=${paisSeleccionado}`)
        .then((response) => {
          setRegiones(response.data);
        })
        .catch((error) => console.error("Error fetching regiones:", error));
    }
  }, [paisSeleccionado]);

  useEffect(() =>{
    if (paisSeleccionado) {
      instance.get(`regiones/?pais=${paisSeleccionado}`)
        .then((response) => {
          setRegiones(response.data);
        })
        .catch((error) => console.error("Error fetching regiones:",error))
    } else {
      
    }
  })

  return {
    paisSeleccionado,
    setPaisSeleccionado,
    codigoPaisSeleccionado,
    setCodigoPaisSeleccionado,
    regionSeleccionado,
    setRegionSeleccionado,
    codigoRegionSeleccionado,
    setCodigoRegionSeleccionado,
    regiones,
  };
};

export default useLocalidades;
