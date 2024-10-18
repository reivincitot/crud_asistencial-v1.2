import React, { useState } from "react";
import { useForm } from "react-hook-form";
import instance from "../axiosConfig";
import FormatearDatos from './FormatearDatos';
import PaisForm from "./FormularioLocalidades/PaisForm";
import RegionForm from "./FormularioLocalidades/RegionForm";
// Importamos las funciones individuales de verificación
import { verificarPais, verificarCodigoPais, verificarRegion, verificarCodigoRegion, verificarProvincia, verificarComuna, verificarCiudad } from "../utils/verificarDuplicados";


/**
 * Componente que muestra un formulario para seleccionar localidades.
 *
 * Utiliza el hook `useLocalidades` para gestionar la lógica de selección y carga de datos.
 *
 * @props {Object} props - Las propiedades del componente.
 * @props {Function} props.setPaisSeleccionado - Función para actualizar el país seleccionado en el componente padre.
 * @props {Function} props.setRegionSeleccionada - Función para actualizar la región seleccionada en el componente padre.
 */


const FormularioLocalidades = () => {
  const { register, handleSubmit, setValue, clearErrors, formState: { errors }, reset } = useForm();
  const [error, setError] = useState('');

  // Estados para país y código seleccionados
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [codigoPaisSeleccionado, setCodigoPaisSeleccionado] = useState('');

  // Nueva función para verificar los duplicados
  const verificarDatosDuplicados = async (datos) => {
    const {
      nuevoPais,
      nuevoCodigoPais,
      nuevaRegion,
      nuevoCodigoRegion,
      nuevaProvincia,
      nuevaComuna,
      nuevaCiudad
    } = datos;

    // Verificamos cada campo con las funciones específicas
    const paisDuplicado = await verificarPais(nuevoPais);
    const codigoPaisDuplicado = await verificarCodigoPais(nuevoCodigoPais);
    const regionDuplicada = await verificarRegion(nuevaRegion);
    const codigoRegionDuplicado = await verificarCodigoRegion(nuevoCodigoRegion);
    const provinciaDuplicada = await verificarProvincia(nuevaProvincia);
    const comunaDuplicada = await verificarComuna(nuevaComuna);
    const ciudadDuplicada = await verificarCiudad(nuevaCiudad);

    // Si alguna verificación detecta duplicado, retorna true
    return (
      paisDuplicado ||
      codigoPaisDuplicado ||
      regionDuplicada ||
      codigoRegionDuplicado ||
      provinciaDuplicada ||
      comunaDuplicada ||
      ciudadDuplicada
    );
  };

  const onSubmit = async (data) => {
    try {
      const formateadosParaServidor = FormatearDatos(data);

      // Verificamos duplicados usando la nueva función
      const datosDuplicados = await verificarDatosDuplicados(formateadosParaServidor);
      if (datosDuplicados) {
        setError("Los datos ingresados ya existen en la base de datos.");
        return;
      }

      // Si no hay duplicados, enviar los datos al servidor
      await instance.post("localidades/", formateadosParaServidor);

      // Limpiar los campos y estados después de enviar
      reset();
      setPaisSeleccionado('');
      setCodigoPaisSeleccionado('');
      setError('');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError('Ocurrió un error al enviar los datos.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Componente PaisForm */}
      <PaisForm
        register={register}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        setPaisSeleccionado={setPaisSeleccionado}
        setCodigoPaisSeleccionado={setCodigoPaisSeleccionado}
        paisSeleccionado={paisSeleccionado}
        codigoPaisSeleccionado={codigoPaisSeleccionado}
      />

      {/* Componente RegionForm, recibe el país seleccionado */}
      <RegionForm
        register={register}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        paisSeleccionado={paisSeleccionado} // Pasamos el país seleccionado
        setCodigoPaisSeleccionado={setCodigoPaisSeleccionado}
      />

      <button type="submit">Guardar</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default FormularioLocalidades;
