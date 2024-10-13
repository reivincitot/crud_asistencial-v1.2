import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { capitalizarPalabras } from './helpers';
import instance from "../axiosConfig";

const PaisForm = () => {
  const [paises, setPaises] = useState([]);
  const [paisExiste, setPaisExiste] = useState(false);
  const [codigoPais, setCodigoPais] = useState("");

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();

  const nuevoPais = watch("nuevoPais");

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

  const onSubmit = async (data) => {
    try {
      const formData = {
        nuevoPais: data.nuevoPais.toLowerCase(),
        nuevoCodigoPais: data.nuevoCodigoPais,
      };

      // Aquí haces la petición al servidor para guardar el nuevo país.
      await instance.post("paises/", formData);

      // Limpiar los campos después de enviar
      setValue("nuevoPais", "");
      setValue("nuevoCodigoPais", "");
      setPaisExiste(false);
    } catch (error) {
      console.error("Error al guardar el país:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Formulario para País */}
      <div>
        <label>Nombre del País</label>
        <input
          id="nuevoPais"
          type="text"
          {...register("nuevoPais", { required: "El nombre del país es obligatorio" })}
          value={capitalizarPalabras(nuevoPais || "")}
          placeholder="Nombre del País"
          onChange={(e) => setValue("nuevoPais", e.target.value)}
        />
        {errors.nuevoPais && <span>{errors.nuevoPais.message}</span>}
        {paisExiste && <span>El país ya está registrado</span>}
      </div>

      {/* Selección de País (si es necesario un select) */}
      <div>
        <label>Seleccionar País</label>
        <select
          id="selectedPais"
          onChange={(e) => setValue("nuevoPais", e.target.value)}
          value={nuevoPais || ""}
        >
          <option value="">Selecciona un país</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.nombre}>
              {pais.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Código del País</label>
          <p>Código país: {codigoPais}</p>
        <input
          id="nuevoCodigoPais"
          type="text"
          {...register("nuevoCodigoPais", { required: "El código del país es obligatorio" })}
          value={codigoPais}
          placeholder="Código del País"
          onChange={(e) => setCodigoPais(e.target.value)}
        />
        {errors.nuevoCodigoPais && <span>{errors.nuevoCodigoPais.message}</span>}
      </div>
    </form>
  );
};

export default PaisForm;
