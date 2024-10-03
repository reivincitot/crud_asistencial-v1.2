import React, { useState, useEffect } from "react";
import instance from "../axiosConfig";

const FormularioLocalidades = () => {
  const [paises, setPaises] = useState([]);
  const [nuevoPais, setNuevoPais] = useState("");
  const [codigoPais, setCodigoPais] = useState(""); // Para mostrar el código del país seleccionado
  const [nuevoCodigoPais, setNuevoCodigoPais] = useState(""); // Para agregar un código nuevo si se agrega un nuevo país

  const [regiones, setRegiones] = useState([]);
  const [nuevaRegion, setNuevaRegion] = useState("");

  const [provincias, setProvincias] = useState([]);
  const [nuevaProvincia, setNuevaProvincia] = useState("");
  const [codigoProvincia, setCodigoProvincia] = useState(""); // Para mostrar el código telefónico de la provincia
  const [nuevoCodigoProvincia, setNuevoCodigoProvincia] = useState(""); // Para agregar un código nuevo si se agrega una nueva provincia

  const [comunas, setComunas] = useState([]);
  const [nuevaComuna, setNuevaComuna] = useState("");

  const [nuevaCiudad, setNuevaCiudad] = useState("");

  const [selectedPais, setSelectedPais] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedComuna, setSelectedComuna] = useState(null);

  // Obtener todos los países
  useEffect(() => {
    instance.get("paises/")
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Obtener regiones cuando un país es seleccionado
  useEffect(() => {
    if (selectedPais) {
      instance.get(`region/?pais=${selectedPais}`)
        .then((response) => {
          setRegiones(response.data);
          const paisSeleccionado = paises.find(p => p.id === parseInt(selectedPais));
          if (paisSeleccionado) {
            setCodigoPais(paisSeleccionado.codigo_pais); // Asignar automáticamente el código del país
          } else {
            setCodigoPais("");
          }
        })
        .catch((error) => console.error("Error fetching regions:", error));
    }
  }, [selectedPais, paises]);

  // Obtener provincias cuando una región es seleccionada
  useEffect(() => {
    if (selectedRegion) {
      instance.get(`provincia/?region=${selectedRegion}`)
        .then((response) => {
          setProvincias(response.data);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    }
  }, [selectedRegion]);

  // Obtener comunas cuando una provincia es seleccionada
  useEffect(() => {
    if (selectedProvincia) {
      instance.get(`comuna/?provincia=${selectedProvincia}`)
        .then((response) => {
          setComunas(response.data);
          const provinciaSeleccionada = provincias.find(p => p.id === parseInt(selectedProvincia));
          if (provinciaSeleccionada) {
            setCodigoProvincia(provinciaSeleccionada.codigo_telefonico_provincia); // Asignar el código de provincia automáticamente
          } else {
            setCodigoProvincia("");
          }
        })
        .catch((error) => console.error("Error fetching comunas:", error));
    }
  }, [selectedProvincia, provincias]);

  // Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaDireccion = {
      pais: nuevoPais || selectedPais,
      codigoPais: nuevoPais ? nuevoCodigoPais : codigoPais,
      region: nuevaRegion || selectedRegion,
      provincia: nuevaProvincia || selectedProvincia,
      codigoProvincia: nuevoCodigoProvincia || codigoProvincia,
      comuna: nuevaComuna || selectedComuna,
      ciudad: nuevaCiudad,
    };
    console.log("Datos enviados:", nuevaDireccion);
    if (!nuevoPais && !selectedPais) {
      alert("Debe seleccionar o ingresar un país");
      return;
    }

    try {
      // Envío de los datos al servidor
      const response = await instance.post("direccion/", nuevaDireccion);
      console.log("Dirección localidad creada:", response.data);
      setNuevoPais("");
      setSelectedPais(null);
    } catch (error) {
      console.error("Error al crear la dirección:", error);
    }
  };
  return (
    <div>
      <h2>Formulario de Dirección</h2>
      <form onSubmit={handleSubmit}>
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
            id="nuevoPais"
            type="text"
            placeholder="O ingrese un nuevo país"
            value={nuevoPais}
            onChange={(e) => {
              setNuevoPais(e.target.value);
              if (e.target.value) setSelectedPais(null); // Limpiar selección si se está agregando un nuevo país
            }}
          />
          {/* Mostrar o ingresar código del país */}
          <p>Código del País: {codigoPais}</p>
          <input
            id="nuevoCodigoPais"
            type="text"
            placeholder="Ingrese el codigo telefónico del nuevo País"
            value={nuevoCodigoPais}
            onChange={(e) => setNuevoCodigoPais(e.target.value)}
            autoComplete="off"
          />
        </div>

        <br />

        <div>
          {/* Selección o ingreso de Región */}

          <label htmlFor="region">Región:</label>

          <select
            id="region"
            onChange={(e) => setSelectedRegion(e.target.value)}
            value={selectedRegion || ""}
          >
            <option value="" disabled>Seleccione una región</option>
            {regiones.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre_region}
              </option>
            ))}
          </select>

          <input
            id="nuevaRegion"
            type="text"
            placeholder="O ingrese una nueva región"
            value={nuevaRegion}
            onChange={(e) => setNuevaRegion(e.target.value)}
            autoComplete="off"
          />
        </div>

        <br />

        <div>
          {/* Selección o ingreso de Provincia */}

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
            id="nuevaProvincia"
            type="text"
            placeholder="O ingrese una nueva provincia"
            value={nuevaProvincia}
            onChange={(e) => setNuevaProvincia(e.target.value)}
            autoComplete="off"
          />

          <br />

          {/* Mostrar o ingresar código de provincia */}
          <p>Código de telefónico la Provincia: {codigoProvincia}</p>
          <input
            id="nuevoCodigoProvincia"
            type="text"
            placeholder="Ingrese código telefónico de la provincia"
            value={nuevoCodigoProvincia}
            onChange={(e) => setNuevoCodigoProvincia(e.target.value)}
            autoComplete="off"
          />
        </div>

        <br />

        <div>
          {/* Selección o ingreso de Comuna */}
          <label htmlFor="comuna">Comuna:</label>
          <select
            id="comuna"
            onChange={(e) => setSelectedComuna(e.target.value)}
            value={selectedComuna || ""}
          >
            <option value="" disabled>Seleccione una comuna</option>
            {comunas.map((comuna) => (
              <option key={comuna.id} value={comuna.id}>
                {comuna.nombre_comuna}
              </option>
            ))}
          </select>
          <input
            id="nuevaComuna"
            type="text"
            placeholder="O ingrese una nueva comuna"
            value={nuevaComuna}
            onChange={(e) => setNuevaComuna(e.target.value)}
            autoComplete="off"
          />
        </div>

        <br />

        <div>
          {/* Campo de Ciudad */}
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            id="ciudad"
            type="text"            
            placeholder="Ingrese una nueva ciudad"
            value={nuevaCiudad}
            onChange={(e) => setNuevaCiudad(e.target.value)}
            autoComplete="off"
          />
        </div>

        <br />

        <div>
          {/* Botón de guardar */}
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioLocalidades;
