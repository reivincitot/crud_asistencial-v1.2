import { useEffect, useState } from "react";
import instance from "../../axiosConfig";
import { verificarPais, verificarCodigoPais } from "../../utils/verificarDuplicados";

const PaisForm = ({ setPaises, setPaisSeleccionado, setErrorDuplicado }) => {
  const [nuevoPais, setNuevoPais] = useState('');  // Para el nuevo país ingresado
  const [nuevoCodigoPais, setNuevoCodigoPais] = useState('');  // Para el código del país

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const response = await instance.get("paises/");
        setPaises(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    cargarPaises();
  }, [setPaises]);

  const handleNuevoPaisChange = async (e) => {
    const value = e.target.value;
    setNuevoPais(value);
    setErrorDuplicado((prev) => ({ ...prev, pais: false }));
    
    const existe = await verificarPais(value);  // Verifica si el país ya existe
    setErrorDuplicado((prev) => ({ ...prev, pais: existe }));
    
    setPaisSeleccionado(value);  // Actualiza el país seleccionado
  };

  const handleNuevoCodigoPaisChange = async (e) => {
    const value = e.target.value;
    setNuevoCodigoPais(value);
    setErrorDuplicado((prev) => ({ ...prev, codigo: false }));
    
    const existe = await verificarCodigoPais(value);  // Verifica si el código ya existe
    setErrorDuplicado((prev) => ({ ...prev, codigo: existe }));
  };

  return {
    nuevoPais,  // Retornar el nuevo país
    nuevoCodigoPais,  // Retornar el código del país
    handleNuevoPaisChange,
    handleNuevoCodigoPaisChange,
  };
};

export default PaisForm;
