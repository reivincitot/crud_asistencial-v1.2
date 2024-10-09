import React, { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Definir el esquema de validación con yup
const schema = yup.object().shape({
  nuevoPais: yup.string().required('El nombre del país es obligatorio'),
  nuevoCodigoPais: yup.string().when('nuevoPais', {
    is: (val) => val && val.length > 0,
    then: yup.string().required('El código del país es obligatorio')
  }).test('codigo-pais-valido', 'El código del país debe estar acompañado por el nombre del país',
    (value, context) => {
      return context.parent.nuevoPais === '' || value !== '';
    }
  ),

  nuevaRegion: yup.string().required('El nombre de la región es obligatorio'),
  nuevoCodigoRegion: yup.string().when('nuevaRegion', {
    is: (val) => val && val.length > 0,
    then: yup.string().required('El código de la región es obligatorio')
  }).test('codigo-region-valido', 'El código de la región debe estar acompañado por el nombre de la región',
    (value, context) => {
      return context.parent.nuevaRegion === '' || value !== '';
    }
  ),
  nuevaProvincia: yup.string(),
  nuevaComuna: yup.string(),
  nuevaCiudad: yup.string(),
});

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
  const [provinciaExiste, setProvinciaExiste] = useState(false);
  const [comunaExiste, setComunaExiste] = useState(false);
  const [ciudadExiste, setCiudadExiste] = useState(false);
  const [selectedPais, setSelectedPais] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedComuna, setSelectedComuna] = useState(null);
  const [codigoPais, setCodigoPais] = useState('');
  const [codigoRegion, setCodigoRegion] = useState('');
  const [error, setError] = useState('');

  const nuevoPais = watch("nuevoPais");
  const nuevoCodigoPais = watch('nuevoCodigoPais');
  const nuevaRegion = watch("nuevaRegion");
  const nuevoCodigoRegion = watch("nuevoCodigoRegion");
  const nuevaProvincia = watch("nuevaProvincia");
  const nuevaComuna = watch("nuevaComuna");
  const nuevaCiudad = watch("nuevaCiudad");

  // Obtener países al cargar el componente
  useEffect(() => {
    instance.get("paises/")
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Verificación de país duplicado en tiempo real
  useEffect(() => {
    if (nuevoPais && nuevoPais.length > 0) {
      instance.get(`paises/nombre_pais=${nuevoPais}`)
        .then((response) => {
          setPaisExiste(response.data.length > 0);
        })
        .catch((error) => console.error("Error verificando país:", error));
    } else {
      setPaisExiste(false);
    }
  }, [nuevoPais]);

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
  }, [nuevaRegion]);

  // Verificación de comuna duplicada en tiempo real
  useEffect(() => {
    if (nuevaComuna && nuevaComuna.length > 0) {
      instance.get(`comuna/nombre_comuna=${nuevaComuna}`)
      .then((response) => {
        setComunaExiste(response.data.length > 0);
      })
      .catch((error) => console.error("Error verificando comuna:", error));
    } else {
      setComunaExiste(false)
    }
  },[nuevaComuna]);

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
  },[nuevaCiudad]);

  // Obtener regiones cuando se selecciona un país
  useEffect(() => {
    if (selectedPais) {
      instance.get(`region/?pais=${selectedPais}`)
        .then((response) => {
          const regionesFiltradas = response.data.filter(region => region.pais === parseInt(selectedPais));
          setRegiones(regionesFiltradas);
          const paisSeleccionado = paises.find(p => p.id === parseInt(selectedPais));
          setCodigoPais(paisSeleccionado ? paisSeleccionado.codigo_pais : "");
        })
        .catch((error) => console.error("Error fetching regions:", error));
    } else {
      setRegiones([]);
      setCodigoPais('');
    }
  }, [selectedPais, paises]);

  // Obtener provincias cuando se selecciona una región
  useEffect(() => {
    if (selectedRegion) {
      instance.get(`provincia/?region=${selectedRegion}/detalles`)
        .then((response) => {
          const provinciasFiltradas = response.data.filter(provincia => provincia.region === parseInt(selectedRegion));
          setProvincias(provinciasFiltradas);
          const regionSeleccionada = regiones.find(r => r.id === parseInt(selectedRegion));
          setCodigoRegion(regionSeleccionada ? regionSeleccionada.codigo_telefonico_region : ""); // Código telefónico de la región
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    } else {
      setProvincias([]);
    }
  }, [selectedRegion, regiones]);

  // Obtener comunas cuando se selecciona una provincia
  useEffect(() => {
    if (selectedProvincia) {
      instance.get(`comuna/?provincia=${selectedProvincia}/detalles`)
        .then((response) => {
          const {region, pais} = response.data;
          setSelectedRegion(region.id);
          setSelectedPais(pais.id);
          setCodigoPais(pais.codigo_pais);
          setCodigoRegion(region.codigo);
        })
        .catch((error) => console.error("Error fetching comunas:", error));
    } else {
      setSelectedRegion(null);
      setSelectedPais(null);
      setCodigoPais('');
      setCodigoRegion('');
    }
  }, [selectedProvincia]);

  // Autoselecciona país, región y provincia al elegir una comuna
  useEffect(() => {
    if (selectedComuna) {
      instance.get(`comuna/${selectedComuna}/detalles`)
        .then((response) => {
          const { provincia, region, pais } = response.data;
          setSelectedProvincia(provincia.id);
          setSelectedRegion(region.id);
          setSelectedPais(pais.id);
          setCodigoPais(pais.codigo_pais);
          setCodigoRegion(region.codigo_telefonico_region);
        })
        .catch((error) => console.error("Error fetching comuna details:", error));
    } else {
      setSelectedProvincia(null);
      setSelectedRegion(null);
      setSelectedPais(null);
      setCodigoPais('');
      setCodigoRegion('');
    }
  }, [selectedComuna]);

  // Manejo del envío del formulario usando react-hook-form
  const onSubmit = async (data) => {
    try {
      if (!ciudadExiste) {
        const ciudadData = { nombre_ciudad: data.nuevaCiudad };
        await instance.post("ciudad/", ciudadData);
      } else {
        setError("La ciudad ya está registrada.");
        return;
      }
      setValue('nuevoPais', '');
      setValue('nuevoCodigoPais', '');
      setValue('nuevaRegion', '');
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
          placeholder="Nombre del País"
          onChange={(e) => setSelectedPais(e.target.value)}
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
          placeholder="Nombre de la Región"
          onChange={(e) => setSelectedRegion(e.target.value)}
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
          placeholder="Nombre de la Provincia"
          onChange={(e) => setSelectedProvincia(e.target.value)}
        />
        {errors.nuevaProvincia && <span>{errors.nuevaProvincia.message}</span>}
        {provinciaExiste && <span>La provincia ya está registrada</span>}
      </div>

      {/* Formulario para Comuna */}
      <div>
        <label>Nombre de la Comuna</label>
        <input
          type="text"
          {...register("nuevaComuna")}
          placeholder="Nombre de la Comuna"
          onChange={(e) => setSelectedComuna(e.target.value)}
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
          placeholder="Nombre de la Ciudad"
        />
        {errors.nuevaCiudad && <span>{errors.nuevaCiudad.message}</span>}
        {ciudadExiste && <span>La ciudad ya está registrada</span>}
      </div>

      <button type="submit">Guardar</button>
      <button type="button" onClick={() => window.location.href = "/"}>Ir al Inicio</button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default FormularioLocalidades;
