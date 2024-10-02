import React, { useState, useEffect } from "react";
import instance from "../axiosConfig";

const FormularioLocalidades = () => {
  const [paises, setPaises] = useState([]);
  const [nuevoPais, setNuevoPais] = useState("");
  const [codigoPais, setCodigoPais] = useState("");  // Código del país seleccionado o nuevo
  const [nuevoCodigoPais, setNuevoCodigoPais] = useState("");  // Código del país cuando se agrega uno nuevo

  const [regiones, setRegiones] = useState([]);
  const [nuevaRegion, setNuevaRegion] = useState("");

  const [provincias, setProvincias] = useState([]);
  const [nuevaProvincia, setNuevaProvincia] = useState("");
  const [codigoProvincia, setCodigoProvincia] = useState(""); 
  const [nuevoCodigoProvincia, setNuevoCodigoProvincia] = useState(""); 

  const [comunas, setComunas] = useState([]);
  const [nuevaComuna, setNuevaComuna] = useState("");

  const [nuevaCiudad, setNuevaCiudad] = useState("");

  const [selectedPais, setSelectedPais] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedComuna, setSelectedComuna] = useState(null);

  // Obtener todos los países al cargar el componente
  useEffect(() => {
    instance.get("paises/")
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Actualizar las regiones y el código del país cuando se selecciona un país
  useEffect(() => {
    if (selectedPais) {
      instance.get(`region/?pais=${selectedPais}`)
        .then((response) => {
          setRegiones(response.data);
          const paisSeleccionado = paises.find(p => p.id === selectedPais);
          if (paisSeleccionado) {
            setCodigoPais(paisSeleccionado.codigo_pais);  // Establecer el código del país seleccionado
          } else {
            setCodigoPais("")
          }
        })
        .catch((error) => console.error("Error fetching regions:", error));
    }
  }, [selectedPais, paises]);

  useEffect(() => {
    if (selectedRegion) {
      instance.get(`provincia/?region=${selectedRegion}`)
        .then((response) => {
          setProvincias(response.data);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvincia) {
      instance.get(`comuna/?provincia=${selectedProvincia}`)
        .then((response) => {
          setComunas(response.data);
          const provinciaSeleccionada = provincias.find(p => p.id === selectedProvincia);
          if (provinciaSeleccionada) {
            setCodigoProvincia(provinciaSeleccionada.codigo_telefonico_provincia);
          }
        })
        .catch((error) => console.error("Error fetching comunas:", error));
    }
  }, [selectedProvincia, provincias]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaDireccion = {
      pais: nuevoPais || selectedPais,
      codigoPais: nuevoPais ? nuevoCodigoPais : codigoPais,  // Si es nuevo país, usar el código ingresado
      region: nuevaRegion || selectedRegion,
      provincia: nuevaProvincia || selectedProvincia,
      codigoProvincia: nuevoCodigoProvincia || codigoProvincia,
      comuna: nuevaComuna || selectedComuna,
      ciudad: nuevaCiudad
    };

    console.log("Datos enviados:", nuevaDireccion);
  };

  return (
    <div>
      <h2>Formulario de Dirección</h2>
      <form onSubmit={handleSubmit}>
        {/* Selección o ingreso de País */}
        <label htmlFor="pais">País:</label>
        <select
          id="pais"
          onChange={(e) => setSelectedPais(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Seleccione un país</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.nombre_pais}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="O ingrese un nuevo país"
          value={nuevoPais}
          onChange={(e) => {
            setNuevoPais(e.target.value);
            setCodigoPais("");  // Limpiar el código si se ingresa un nuevo país
          }}
        />

        {/* Mostrar campo de código si se ingresa un nuevo país */}
        {nuevoPais ? (
          <>
            <p>Ingrese el código del nuevo país:</p>
            <input
              type="text"
              placeholder="Código del país"
              value={nuevoCodigoPais}
              onChange={(e) => setNuevoCodigoPais(e.target.value)}
            />
          </>
        ) : (
          <p>Código del País: {codigoPais}</p>  // Mostrar el código del país seleccionado
        )}

        {/* Selección o ingreso de Región */}
        <label htmlFor="region">Región:</label>
        <select
          id="region"
          onChange={(e) => setSelectedRegion(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Seleccione una región</option>
          {regiones.map((region) => (
            <option key={region.id} value={region.id}>
              {region.nombre_region}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="O ingrese una nueva región"
          value={nuevaRegion}
          onChange={(e) => setNuevaRegion(e.target.value)}
        />

        {/* Selección o ingreso de Provincia */}
        <label htmlFor="provincia">Provincia:</label>
        <select
          id="provincia"
          onChange={(e) => setSelectedProvincia(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Seleccione una provincia</option>
          {provincias.map((provincia) => (
            <option key={provincia.id} value={provincia.id}>
              {provincia.nombre_provincia}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="O ingrese una nueva provincia"
          value={nuevaProvincia}
          onChange={(e) => setNuevaProvincia(e.target.value)}
        />

        {/* Mostrar código de provincia */}
        <p>Código de la Provincia: {codigoProvincia}</p>

        {/* Selección o ingreso de Comuna */}
        <label htmlFor="comuna">Comuna:</label>
        <select
          id="comuna"
          onChange={(e) => setSelectedComuna(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Seleccione una comuna</option>
          {comunas.map((comuna) => (
            <option key={comuna.id} value={comuna.id}>
              {comuna.nombre_comuna}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="O ingrese una nueva comuna"
          value={nuevaComuna}
          onChange={(e) => setNuevaComuna(e.target.value)}
        />

        {/* Campo de Ciudad */}
        <label htmlFor="ciudad">Ciudad:</label>
        <input
          type="text"
          placeholder="Ingrese una nueva ciudad"
          value={nuevaCiudad}
          onChange={(e) => setNuevaCiudad(e.target.value)}
        />

        {/* Botón de guardar */}
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default FormularioLocalidades;
