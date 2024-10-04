import React, { useState, useEffect } from "react";
import instance from "../axiosConfig";

const FormularioLocalidades = () => {
  const [paises, setPaises] = useState([]);
  const [nuevoPais, setNuevoPais] = useState("");
  const [codigoPais, setCodigoPais] = useState("");
  const [nuevoCodigoPais, setNuevoCodigoPais] = useState("");

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

  const [error, setError] = useState(""); // Estado para errores

  useEffect(() => {
    instance.get("paises/")
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

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
          const provinciaSeleccionada = provincias.find(p => p.id === parseInt(selectedProvincia));
          setCodigoProvincia(provinciaSeleccionada ? provinciaSeleccionada.codigo_telefonico_provincia : "");
        })
        .catch((error) => console.error("Error fetching comunas:", error));
    }
  }, [selectedProvincia, provincias]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Resetear el error al inicio

    // Validación de los campos requeridos
    if (!nuevoPais && !selectedPais) {
        setError("Debe seleccionar o ingresar un país.");
        return;
    }

    // Obtener el ID del país seleccionado
    const paisID = nuevoPais ? null : selectedPais; // Si hay un nuevo país, no hay ID seleccionado

    try {
        // Solo crear el país si hay un nuevo país ingresado
        if (nuevoPais) {
            const paisData = {
                nombre_pais: nuevoPais,
                codigo_pais: nuevoCodigoPais || '', // Solo si se ha ingresado un nuevo código
            };
            console.log("Enviando datos de país:", paisData);
            const paisResponse = await instance.post("paises/", paisData);
            console.log("País creado:", paisResponse.data);
            // Al crear un nuevo país, también debes obtener su ID
            paisID = paisResponse.data.id; // Suponiendo que el servidor devuelve el nuevo ID del país creado
        }

        // Crear o asociar la región solo si se ha ingresado una nueva o se ha seleccionado
        if (nuevaRegion) {
            const regionData = {
                nombre_region: nuevaRegion,
                pais: paisID || selectedPais, // Asociar a la región usando el ID
            };
            await instance.post("region/", regionData);
            console.log("Región creada:", regionData);
        }

        // Crear o asociar la provincia solo si se ha ingresado una nueva o se ha seleccionado
        if (nuevaProvincia) {
            const provinciaData = {
                nombre_provincia: nuevaProvincia,
                region: selectedRegion, // Asociar a la provincia usando el ID de la región seleccionada
            };
            await instance.post("provincia/", provinciaData); // Cambiado aquí
            console.log("Provincia creada:", provinciaData);
        }

        // Crear o asociar la comuna solo si se ha ingresado una nueva o se ha seleccionado
        if (nuevaComuna) {
            const comunaData = {
                nombre_comuna: nuevaComuna,
                provincia: selectedProvincia, // Asociar a la comuna usando el ID de la provincia seleccionada
            };
            await instance.post("comuna/", comunaData); // Cambiado aquí
            console.log("Comuna creada:", comunaData);
        }

        // Reiniciar formulario después de enviar
        setNuevoPais("");
        setCodigoPais("");
        setNuevoCodigoPais("");
        setSelectedPais(null);
        setRegiones([]);
        setNuevaRegion("");
        setSelectedRegion(null);
        setProvincias([]);
        setNuevaProvincia("");
        setSelectedProvincia(null);
        setComunas([]);
        setNuevaComuna("");
        setNuevaCiudad("");

    } catch (error) {
        console.error("Error al crear la dirección:", error);
        setError("Error al crear la dirección. Por favor, intente nuevamente.");
    }
};


  return (
    <div>
      <h2>Formulario de Dirección</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensaje de error */}
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
              if (e.target.value) setSelectedPais(null);
            }}
          />
          <p>Código del País: {codigoPais}</p>
          <input
            id="nuevoCodigoPais"
            type="text"
            placeholder="Ingrese el código telefónico del nuevo País"
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
          <p>Código telefónico de la Provincia: {codigoProvincia}</p>
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
            <option value="">Seleccione una comuna</option>
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

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default FormularioLocalidades;
