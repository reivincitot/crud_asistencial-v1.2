import React from "react";



const HtmlFormLocalidades = ({
  register,
  errors,
  paises,
  paisSeleccionado,
  regiones,
  nuevoPais,  // Añadir el nuevo país aquí
  nuevoCodigoPais,  // Añadir el nuevo código de país aquí
  handlePaisChange,
  handleCodigoPaisChange,
  handleRegionChange,
}) => {
  return (
    <form>
      <div>
        <label htmlFor="nuevoPais">País</label>
        <select
          {...register("nuevoPais", { required: "Debes seleccionar o ingresar un país" })}
          value={paisSeleccionado || ""}  // Usar el valor de nuevoPais si existe, sino paisSeleccionado
          onChange={handlePaisChange}
        >
          <option value="">Seleccionar País</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.nombre}>
              {pais.nombre}
            </option>
          ))}
        </select>
        {errors.nuevoPais && <p>{errors.nuevoPais.message}</p>}

        <input
        type="text"
        id="nuevoPais"
        placeholder="O ingrese un nuevo País"
        value={nuevoPais}
        onChange={(e) => setnuevoPaisIngresado(e.target.value)}
        />
        <label htmlFor="nuevoCodigoPais">Código País</label>
        <input
          type="text"
          {...register("nuevoCodigoPais", { required: "Este campo es obligatorio" })}
          value={nuevoCodigoPais || ""}  // Mostrar el valor de nuevoCodigoPais si existe
          onChange={handleCodigoPaisChange}
          readOnly
        />
        {errors.nuevoCodigoPais && <p>{errors.nuevoCodigoPais.message}</p>}
      </div>

      <div>
        <label htmlFor="nuevaRegion">Región</label>
        <select
          {...register("nuevaRegion", { required: "Debes seleccionar o ingresar una región" })}
          onChange={handleRegionChange}
        >
          <option value="">Seleccionar Región</option>
          {regiones.map((region) => (
            <option key={region.id} value={region.nombre}>
              {region.nombre}
            </option>
          ))}
        </select>
        {errors.nuevaRegion && <p>{errors.nuevaRegion.message}</p>}

        <label htmlFor="nuevoCodigoRegion">Código Región</label>
        <input
          type="text"
          {...register("nuevoCodigoRegion", { required: "Este campo es obligatorio" })}
        />
        {errors.nuevoCodigoRegion && <p>{errors.nuevoCodigoRegion.message}</p>}
      </div>
    </form>
  );
};

export default HtmlFormLocalidades;
