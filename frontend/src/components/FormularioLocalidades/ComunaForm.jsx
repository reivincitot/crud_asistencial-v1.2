import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { capitalizarPalabras } from './helpers';
import instance from "../axiosConfig";

const ComunaForm = () => {
  const [comunaExiste, setComunaExiste] = useState(false);
  const nuevaComuna = watch("nuevaComuna");

  // Verificación de comuna duplicada en tiempo real
  useEffect(() => {
    if (nuevaComuna && nuevaComuna.length > 0) {
      instance.get(`comuna/nombre_comuna=${nuevaComuna}`)
        .then((response) => {
          setComunaExiste(response.data.length > 0);
        })
        .catch((error) => console.error("Error verificando comuna:", error));
    } else {
      setComunaExiste(false);
    }
  }, [nuevaComuna]);  // Usamos watch para verificar cambios en tiempo real
};


export default ComunaForm;