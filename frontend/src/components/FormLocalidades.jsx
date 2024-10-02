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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoPais && !selectedPais) {
      alert("Debe seleccionar o Ingresar un País");
      return;
    }
    const nuevaDireccion = {
      pais: nuevoPais || selectedPais,
      codigoPais: nuevoPais ? nuevoCodigoPais : codigoPais,  // Si es nuevo país, usar el código ingresado
      region: nuevaRegion || selectedRegion,
      provincia: nuevaProvincia || selectedProvincia,
      codigoProvincia: nuevoCodigoProvincia || codigoProvincia,
      comuna: nuevaComuna || selectedComuna,
      ciudad: nuevaCiudad
    };
    try {
      // Envío de datos al servidor
      const response = await instance.post("direcciones/", nuevaDireccion);
      console.log("Dirección creada: ", response.data)
      // Limpiar el formulario y mostrar un mensaje de éxito
      setNuevoPais("");
      setSelectedPais(null);
      alert("Dirección creada correctamente");
    } catch (error) {
      console.error("Error al enviar los datos", error);
      if (error.response && error.response.status === 400) {
        alert("Los datos ingresados no son válidos");
      } else {
        alert("Ocurrió un error inesperado. Por favor, inténtelo nuevamente.");
      }
    }
    

    console.log("Datos enviados:", nuevaDireccion);
  };

  return (
    <div>
      <h2>Formulario de Dirección</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/* Selección o Ingreso de un Nuevo País */}
          <label htmlFor="pais">País:</label>
          <select
            id="pais"
            onChange={(e) => setSelectedPais(e.target.value)}
            value= {selectedPais || ""}
            autoComplete="off"
          >
            <option value={""}>Seleccione un País</option>
            {paises.map((pais)=>(
              <option key={pais.id} value={pais.id}>
                {pais.nombre_pais}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="nuevoPais"
            placeholder="O ingrese un un nuevo País"
            value={nuevoPais}
            onChange={(e) =>{
              setNuevoPais(e.target.value);
              if (e.target.value) setSelectedPais(null); // Limpiar selección si se esta agregando un nuevo país
            }}
            autoComplete="off"
            />
            {/*Mostrar o Ingresar el código del país*/}
            <label htmlFor="codigoPais">Código del País</label>
              <input
                type="text"
                id="codigoPais"
                placeholder="O ingrese un Código de País"
                value={nuevoCodigoPais || codigoPais}
                onChange={(e) => setNuevoCodigoPais(e.target.value)}
                autoComplete="off"
                />
            <br/>
            <div>
              {/* Selección o ingreso de Región*/}
              <label htmlFor="region">Región:</label>
                <select
                  id="region"
                  onChange={(e) => selectedRegion(e.target.value)}
                  value={selectedRegion || " "}
                  autoComplete="off"
                  >
                    <option value=""> Seleccione una Región</option>
                    {regiones.map((region)=>(
                      <option key={region.id} value={region.id}>
                        {region.nombre_region}
                      </option>
                    ))}
                  </select>
                  <input
                    id="nuevaRegion"
                    type="text"
                    placeholder="O ingrese una nueva región"
                    onChange={(e) => setNuevaRegion(e.target.value)}
                    autoComplete="off"
                    />
                    <br/>
              
            </div>
        </div>
      </form>
    </div>
  );

};

export default FormularioLocalidades;
