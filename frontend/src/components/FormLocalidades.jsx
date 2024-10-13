import React, { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from '../utils/schema'

const FormularioLocalidades = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [paises, setPaises] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [paisExiste, setPaisExiste] = useState(false);
  const [regionExiste, setRegionExiste] = useState(false);
  const [comunaExiste, setComunaExiste] = useState(false);
  const [ciudadExiste, setCiudadExiste] = useState(false);
  const [codigoPais, setCodigoPais] = useState('');
  const [codigoRegion, setCodigoRegion] = useState('');
  const [error, setError] = useState('');

  // Observando cambios en los campos
  const nuevoPais = watch("nuevoPais");
  const nuevoCodigoPais = watch('nuevoCodigoPais');
  const nuevaRegion = watch("nuevaRegion");
  const nuevoCodigoRegion = watch("nuevoCodigoRegion");
  const nuevaProvincia = watch("nuevaProvincia");
  const nuevaComuna = watch("nuevaComuna");
  const nuevaCiudad = watch("nuevaCiudad");

  

  // Verificación de región duplicada en tiempo real
  useEffect(() => {
    if (nuevaRegion && nuevaRegion.length > 0) {
      instance.get(`region/nombre_region=${nuevaRegion}`)
      .then((response) => {
        setRegionExiste(response.data.length > 0);
      })
      .catch((error) => console.error("Error verificando región:",error));
    } else {
      setRegionExiste(false);
    }
  }, [nuevaRegion]); // Usamos watch para verificar cambios en tiempo real

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

  // Verificación de ciudad duplicada en tiempo real
  useEffect(() => {
    if (nuevaCiudad && nuevaCiudad.length > 0) {
      instance.get(`ciudad/nombre_ciudad=${nuevaCiudad}`)
      .then((response) => {
        setCiudadExiste(response.data.length > 0);
      })
      .catch((error) => console.error("Error verificando ciudad:", error));
    } else {
      setCiudadExiste(false);
    }
  }, [nuevaCiudad]);  // Usamos watch para verificar cambios en tiempo real

  // Manejo del envío del formulario usando react-hook-form
  const onSubmit = async (data) => {
    try {
      // Convertir todo a minúsculas antes de guardar
      const formatearTexto = (texto) => texto.toLowerCase();

      const formData = {
        nuevoPais: formatearTexto(data.nuevoPais),
        nuevoCodigoPais: data.nuevoCodigoPais,
        nuevaRegion: formatearTexto(data.nuevaRegion),
        nuevoCodigoRegion: data.nuevoCodigoRegion,
        nuevaProvincia: formatearTexto(data.nuevaProvincia),
        nuevaComuna: formatearTexto(data.nuevaComuna),
        nuevaCiudad: formatearTexto(data.nuevaCiudad),
      };

      if (!ciudadExiste) {
        const ciudadData = { nombre_ciudad: formData.nuevaCiudad };
        await instance.post("ciudad/", ciudadData);
      } else {
        setError("La ciudad ya está registrada.");
        return;
      }

      // Limpiar los campos después de enviar
      setValue('nuevoPais', '');
      setValue('nuevoCodigoPais', '');
      setValue('nuevaRegion', '');
      setValue('nuevoCodigoRegion', '');
      setValue('nuevaProvincia', '');
      setValue('nuevaComuna', '');
      setValue('nuevaCiudad', '');
      setError('');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Formulario para País */}
      <div>
        <label>Nombre del País</label>
        <input
          type="text"
          {...register("nuevoPais")}
          value={capitalizarPalabras(nuevoPais || "")}
          placeholder="Nombre del País"
          onChange={(e) => setValue('nuevoPais', e.target.value)}
        />
        {errors.nuevoPais && <span>{errors.nuevoPais.message}</span>}
        {paisExiste && <span>El país ya está registrado</span>}
      </div>
      <div>
        <label>Código del País</label>
        <input
          type="text"
          {...register("nuevoCodigoPais")}
          value={codigoPais}
          placeholder="Código del País"
        />
        {errors.nuevoCodigoPais && <span>{errors.nuevoCodigoPais.message}</span>}
      </div>

      {/* Formulario para Región */}
      <div>
        <label>Nombre de la Región</label>
        <input
          type="text"
          {...register("nuevaRegion")}
          value={capitalizarPalabras(nuevaRegion || "")}
          placeholder="Nombre de la Región"
          onChange={(e) => setValue('nuevaRegion', e.target.value)}
        />
        {errors.nuevaRegion && <span>{errors.nuevaRegion.message}</span>}
        {regionExiste && <span>La región ya está registrada</span>}
      </div>
      <div>
        <label>Código de la Región</label>
        <input
          type="text"
          {...register("nuevoCodigoRegion")}
          value={codigoRegion}
          placeholder="Código de la Región"
        />
        {errors.nuevoCodigoRegion && <span>{errors.nuevoCodigoRegion.message}</span>}
      </div>

      {/* Formulario para Provincia */}
      <div>
        <label>Nombre de la Provincia</label>
        <input
          type="text"
          {...register("nuevaProvincia")}
          value={capitalizarPalabras(nuevaProvincia || "")}
          placeholder="Nombre de la Provincia"
        />
        {errors.nuevaProvincia && <span>{errors.nuevaProvincia.message}</span>}
      </div>

      {/* Formulario para Comuna */}
      <div>
        <label>Nombre de la Comuna</label>
        <input
          type="text"
          {...register("nuevaComuna")}
          value={capitalizarPalabras(nuevaComuna || "")}
          placeholder="Nombre de la Comuna"
          onChange={(e) => setValue('nuevaComuna', e.target.value)}
        />
        {errors.nuevaComuna && <span>{errors.nuevaComuna.message}</span>}
        {comunaExiste && <span>La comuna ya está registrada</span>}
      </div>

      {/* Formulario para Ciudad */}
      <div>
        <label>Nombre de la Ciudad</label>
        <input
          type="text"
          {...register("nuevaCiudad")}
          value={capitalizarPalabras(nuevaCiudad || "")}
          placeholder="Nombre de la Ciudad"
          onChange={(e) => setValue('nuevaCiudad', e.target.value)}
        />
        {errors.nuevaCiudad && <span>{errors.nuevaCiudad.message}</span>}
        {ciudadExiste && <span>La ciudad ya está registrada</span>}
      </div>

      <button type="submit">Guardar</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default FormularioLocalidades;