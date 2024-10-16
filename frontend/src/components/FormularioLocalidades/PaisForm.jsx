import React, { useEffect, useState } from "react";
import { verificarPais, verificarCodigoPais } from "../../utils/verificarDuplicados";
import instance from "../../axiosConfig";

const PaisForm = ({ register, errors, setValue, clearErrors, setPaisSeleccionado, codigoPaisSeleccionado, setCodigoPaisSeleccionado }) => {
  const [paises, setPaises] = useState([]);
  const [paisExiste, setPaisExiste] = useState(false);
  const [existeCodigoPais, setExisteCodigoPais] = useState(false);

  useEffect(() => {
    // Obtener países al cargar el componente
    instance.get("paises/")
      .then((response) => setPaises(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const manejarSeleccionPais = (e) => {
    const paisId = e.target.value;
    if (paisId) {
      const pais = paises.find(p => p.id === parseInt(paisId));
      setPaisSeleccionado(pais.nombre_pais); // Actualizar el estado en FormularioLocalidades
      setCodigoPaisSeleccionado(pais.codigo_pais); // Actualizar el código del país
      setValue("nuevoPais", pais.nombre_pais);  
      setValue("nuevoCodigoPais", pais.codigo_pais);
      clearErrors("nuevoPais");
      clearErrors("nuevoCodigoPais");
    } else {
      setPaisSeleccionado(""); // Restablecer si no se selecciona un país
      setCodigoPaisSeleccionado(""); // Restablecer el código del país
      setValue("nuevoPais", "");
      setValue("nuevoCodigoPais", "");
    }
  };

  const handlePaisChange = async (e) => {
    const nuevoPais = e.target.value;
    setValue("nuevoPais", nuevoPais);
    const existe = await verificarPais(nuevoPais); // Utilizamos la función centralizada
    setPaisExiste(existe);
  };

  const handleCodigoPaisChange = async (e) => {
    const nuevoCodigoPais = e.target.value;
    setValue("nuevoCodigoPais", nuevoCodigoPais);
    const existe = await verificarCodigoPais(nuevoCodigoPais); // Utilizamos la función centralizada
    setExisteCodigoPais(existe);
  };

  return (
    <div>
      <label>Seleccionar País</label>
      <select onChange={manejarSeleccionPais}>
        <option value="">-- Selecciona un país --</option>
        {paises.map((pais) => (
          <option key={pais.id} value={pais.id}>
            {pais.nombre_pais} {/* No es necesario formatear manualmente aquí */}
          </option>
        ))}
      </select>

      {/* Mostrar el código del país seleccionado */}
      {codigoPaisSeleccionado && <p>Código País: {codigoPaisSeleccionado}</p>}

      <label>Nombre del País</label>
      <input
        {...register("nuevoPais", { required: "El nombre del país es obligatorio" })}
        placeholder="Nombre del País"
        onChange={handlePaisChange}
        disabled={codigoPaisSeleccionado !== ""}
      />
      {errors.nuevoPais && <span>{errors.nuevoPais.message}</span>}
      {paisExiste && <span>El país ya está registrado</span>}

      <label>Código del País</label>
      <input
        {...register("nuevoCodigoPais", { required: "El código del país es obligatorio" })}
        placeholder="Código del País"
        onChange={handleCodigoPaisChange}
        disabled={codigoPaisSeleccionado !== ""}
      />
      {errors.nuevoCodigoPais && <span>{errors.nuevoCodigoPais.message}</span>}
      {existeCodigoPais && <span>El código del país ya está registrado</span>}
    </div>
  );
};

export default PaisForm;
