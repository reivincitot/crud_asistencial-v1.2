import React, { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Definir el esquema de validación con yup
const schema = yup.object().shape({
  nuevoPais: yup.string(),
  nuevoCodigoPais: yup.string().when('nuevoPais', {
    is: (val) => val && val.length > 0,
    then: yup.string().required('El código del país es obligatorio')
  }),
  nuevaRegion: yup.string(),
  nuevaProvincia: yup.string(),
  nuevaComuna: yup.string(),
});

const FormularioLocalidades = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [paises, setPaises] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedPais, setSelectedPais] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [codigoPais, setCodigoPais] = useState('');
  const [codigoProvincia, setCodigoProvincia] = useState('');
  const [error, setError] = useState('');

  // Obtener países al cargar el componente
  useEffect(() => {
    instance.get("paises/")
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Obtener regiones cuando se selecciona un país
  useEffect(() => {
    if (selectedPais) {
      instance.get(`region/?pais=${selectedPais}`)
        .then((response) => {
          setRegiones(response.data);
          const paisSeleccionado = paises.find(p => p.id === parseInt(selectedPais));
          setCodigoPais(paisSeleccionado ? paisSeleccionado.codigo_pais : "");
        })
        .catch((error) => console.error("Error fetching regions:", error));
    }
  }, [selectedPais, paises]);

  // Obtener provincias cuando se selecciona una región
  useEffect(() => {
    if (selectedRegion) {
      instance.get(`provincia/?region=${selectedRegion}`)
        .then((response) => {
          setProvincias(response.data);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    }
  }, [selectedRegion]);

  // Obtener comunas cuando se selecciona una provincia
  useEffect(() => {
    if (selectedProvincia) {
      instance.get(`comuna/?provincia=${selectedProvincia}`)
        .then((response) => {
          setComunas(response.data);
          const provinciaSeleccionada = provincias.find(p => p.id === parseInt(selectedProvincia));
          setCodigoProvincia(provinciaSeleccionada ? provinciaSeleccionada.codigo_telefonico_provincia : "");
        })
        .catch((error) => console.error("Error fetching comunas:", error));
    }
  }, [selectedProvincia, provincias]);

  // Manejo del envío del formulario usando react-hook-form
  const onSubmit = async (data) => {
    try {
      // Solo crear el país si hay un nuevo país ingresado
      if (data.nuevoPais) {
        const paisData = {
          nombre_pais: data.nuevoPais,
          codigo_pais: data.nuevoCodigoPais || '',
        };
        await instance.post('http://127.0.0.1:8000/api/paises/', paisData);
      }
      // Crear o asociar la región
      if (data.nuevaRegion) {
        const regionData = {
          nombre_region: data.nuevaRegion,
          pais: selectedPais,
        };
        await instance.post("region/", regionData);
      }

      // Crear o asociar la provincia
      if (data.nuevaProvincia) {
        const provinciaData = {
          nombre_provincia: data.nuevaProvincia,
          region: selectedRegion,
        };
        await instance.post("provincia/", provinciaData);
      }

      // Crear o asociar la comuna
      if (data.nuevaComuna) {
        const comunaData = {
          nombre_comuna: data.nuevaComuna,
          provincia: selectedProvincia,
        };
        await instance.post("comuna/", comunaData);
      }

      // Limpiar el formulario después del envío
      setValue('nuevoPais', '');
      setValue('nuevoCodigoPais', '');
      setValue('nuevaRegion', '');
      setValue('nuevaProvincia', '');
      setValue('nuevaComuna', '');
      setSelectedPais(null);
      setSelectedRegion(null);
      setSelectedProvincia(null);
      setRegiones([]);
      setProvincias([]);
      setComunas([]);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setError("Error al enviar los datos. Por favor, intente nuevamente.");
    }
  };

  return (
    <div>
      <h2>Formulario de Dirección</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensaje de error */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Selección o ingreso de País */}
        <div>
          <label htmlFor="pais">País:</label>
          <select
            id="pais"
            onChange={(e) => setSelectedPais(e.target.value)}
            value={selectedPais || ""}
          >
            <option value="">Seleccione un país</option>
            {paises.map((pais) => (
              <option key={pais.id} value={pais.id}>
                {pais.nombre_pais}
              </option>
            ))}
          </select>
          <input
            {...register("nuevoPais")}
            id="nuevoPais"
            type="text"
            placeholder="O ingrese un nuevo país"
          />
          <p>Código del País: {codigoPais}</p>
          <input
            {...register("nuevoCodigoPais")}
            id="nuevoCodigoPais"
            type="text"
            placeholder="Ingrese el código telefónico del nuevo País"
          />
          {errors.nuevoCodigoPais && <p>{errors.nuevoCodigoPais.message}</p>}
        </div>

        <br />

        {/* Selección o ingreso de Región */}
        <div>
          <label htmlFor="region">Región:</label>
          <select
            id="region"
            onChange={(e) => setSelectedRegion(e.target.value)}
            value={selectedRegion || ""}
          >
            <option value="">Seleccione una región</option>
            {regiones.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre_region}
              </option>
            ))}
          </select>
          <input
            {...register("nuevaRegion")}
            id="nuevaRegion"
            type="text"
            placeholder="O ingrese una nueva región"
          />
        </div>

        <br />

        {/* Selección o ingreso de Provincia */}
        <div>
          <label htmlFor="provincia">Provincia:</label>
          <select
            id="provincia"
            onChange={(e) => setSelectedProvincia(e.target.value)}
            value={selectedProvincia || ""}
          >
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.id} value={provincia.id}>
                {provincia.nombre_provincia}
              </option>
            ))}
          </select>
          <input
            {...register("nuevaProvincia")}
            id="nuevaProvincia"
            type="text"
            placeholder="O ingrese una nueva provincia"
          />
          <p>Código telefónico de la Provincia: {codigoProvincia}</p>
          <input
            {...register("nuevoCodigoProvincia")}
            id="nuevoCodigoProvincia"
            type="text"
            placeholder="Ingrese código telefónico de la provincia"
          />
        </div>

        <br />

        {/* Selección o ingreso de Comuna */}
        <div>
          <label htmlFor="comuna">Comuna:</label>
          <select
            id="comuna"
            onChange={(e) => setSelectedComuna(e.target.value)}
            value={selectedComuna || ""}
          >
            <option value="">Seleccione una comuna</option>
            {comunas.map((comuna) => (
              <option key={comuna.id} value={comuna.id}>
                {comuna.nombre_comuna}
              </option>
            ))}
          </select>
          <input
            {...register("nuevaComuna")}
            id="nuevaComuna"
            type="text"
            placeholder="O ingrese una nueva comuna"
          />
        </div>

        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default FormularioLocalidades;
