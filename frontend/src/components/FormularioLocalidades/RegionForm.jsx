import React, { useEffect, useState } from "react";
import instance from "../../axiosConfig";

const RegionForm = ({
  register,
  errors,
  setValue,
  clearErrors,
  setRegionSeleccionado,
  codigoRegionSeleccionado,
  setCodigoRegionSeleccionado,
  setPaisSeleccionado, // Añadido como prop
  setCodigoPaisSeleccionado, // Añadido como prop
}) => {
  const [regiones, setRegiones] = useState([]);
  const [regionExiste, setRegionExiste] = useState(false);
  const [existeCodigoRegion, setExisteCodigoRegion] = useState(false);

  useEffect(() => {
    // Obtener regiones al cargar el componente
    instance
      .get("region/")
      .then((response) => setRegiones(response.data))
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  const manejarSeleccionRegion = async (e) => {
    const regionId = e.target.value;
    if (regionId) {
      try {
        const response = await instance.get(`/regiones/${regionId}/`);
        const region = response.data;

        // Actualizar los estado en el componente padre
        setPaisSeleccionado({
          pais: region.pais.nombre_pais,
          codigoPais: region.pais.codigo_pais,
          region: region.nombre_region,
          codigoRegion: region.codigo_telefonico_region,
        });
        // Actualizar los campos del formulario
        setValue("nuevoPais", region.pais.nombre_pais);
        setValue("nuevoCodigoPais", region.pais.codigo_pais);
      } catch (error) {
        console.error("Error al obtener datos de la región:", error);
      }
    }
    else {
      setRegionSeleccionado(""); // Restablecer si no se selecciona una región
      setCodigoRegionSeleccionado(""); // Restablece el código de región
      setValue("nuevaRegion", "");
      setValue("nuevoCodigoRegion", "");

      // También restablece los valores del país
      setPaisSeleccionado("");
      setCodigoPaisSeleccionado("");
      setValue("nuevoPais", "");
      setValue("nuevoCodigoPais", "");
    }
  };

  // Verificación de Region duplicada en tiempo real
  const verificarRegion = (nuevaRegion) => {
    if (nuevaRegion && nuevaRegion.length > 0) {
      instance
        .get(`regiones/?nombre_region=${nuevaRegion}`)
        .then((response) => setRegionExiste(response.data.length > 0))
        .catch((error) => console.error("Error verificando región:", error));
    } else {
      setRegionExiste(false);
    }
  };

  // Verificar código de región duplicado
  const verificarCodigoRegion = (nuevoCodigoRegion) => {
    if (nuevoCodigoRegion && nuevoCodigoRegion.length > 0) {
      instance
        .get(`regiones/?codigo_region=${nuevoCodigoRegion}`)
        .then((response) => setExisteCodigoRegion(response.data.length > 0))
        .catch((error) =>
          console.error("Error verificando código de la región:", error)
        );
    } else {
      setExisteCodigoRegion(false);
    }
  
  async function handleRegionChange (regionId) {
    try {
      const RegionResponse = await fetch(`/api/regions/${regionId}`);
      const regionData = await RegionResponse.json();

      // Autocompletar el país y el código
      setSelectedPais(regionData.pais); //autocompletar el pais
      setRegionCode(regionData.codigo)
    } catch (error) {
      
    }
  }
  };


  return (
    <div>
      <label>Seleccionar Región</label>
      <select onChange={manejarSeleccionRegion}>
        <option value="">-- Selecciona una región --</option>
        {regiones.map((region) => (
          <option key={region.id} value={region.id}>
            {region.nombre_region}
          </option>
        ))}
      </select>

      {codigoRegionSeleccionado && (
        <p>Código Telefónico de la Región: {codigoRegionSeleccionado}</p>
      )}
      <label>Nombre de la Región</label>
      <input
        {...register("nuevaRegion", {
          required: "El nombre de la región es obligatorio",
        })}
        placeholder="Nombre de la Región"
        onChange={(e) => {
          setValue("nuevaRegion", e.target.value);
          verificarRegion(e.target.value);
        }}
        disabled={codigoRegionSeleccionado !== ""}
      />
      {errors.nuevaRegion && <span>{errors.nuevaRegion.message}</span>}
      {regionExiste && <span>La región ya está registrada</span>}

      <label>Código de la Región</label>
      <input
        {...register("nuevoCodigoRegion", {
          required: "El código de la región es obligatorio",
        })}
        placeholder="Código de la Región"
        onChange={(e) => {
          setValue("nuevoCodigoRegion", e.target.value);
          verificarCodigoRegion(e.target.value);
        }}
        disabled={codigoRegionSeleccionado !== ""}
      />
      {errors.nuevoCodigoRegion && (
        <span>{errors.nuevoCodigoRegion.message}</span>
      )}
      {existeCodigoRegion && <span>El código de la región ya está registrado</span>}
    </div>
  );
};

export default RegionForm;
