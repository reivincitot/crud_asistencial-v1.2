import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormatearDatos from './FormatearDatos';
import PaisForm from "./FormularioLocalidades/PaisForm";
import RegionForm from "./FormularioLocalidades/RegionForm";
import instance from "../axiosConfig";
import verificarDatosDuplicados from './verificarDatosDuplicados'; // Asegúrate de importar esta función si es externa.

const FormularioLocalidades = () => {
  const { register, handleSubmit, setValue, clearErrors, formState: { errors }, reset } = useForm();
  const [error, setError] = useState('');

  // Estado para el país y la región seleccionados y sus códigos
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [codigoPaisSeleccionado, setCodigoPaisSeleccionado] = useState('');
  const [regionSeleccionado, setRegionSeleccionado] = useState('');
  const [codigoRegionSeleccionado, setCodigoRegionSeleccionado] = useState('');

  const [formData, setFormData] = useState({
    nuevoPais: '',
    nuevoCodigoPais: '',
    nuevaRegion: '',
    nuevoCodigoRegion: '',
    nuevaProvincia: '',
    nuevaComuna: '',
    nuevaCiudad: '',
  });

  const [formateadosParaMostrar, setFormateadosParaMostrar] = useState({});

  const onSubmit = async (data) => {
    try {
      let formateadosParaServidor = {};

      // Si no hay un país seleccionado, agregar el nuevo país
      if (!paisSeleccionado) {
        formateadosParaServidor.nuevoPais = data.nuevoPais;
        formateadosParaServidor.nuevoCodigoPais = data.nuevoCodigoPais;
      }

      // Si no hay una región seleccionada, agregar la nueva región
      if (!regionSeleccionado) {
        formateadosParaServidor.nuevaRegion = data.nuevaRegion;
        formateadosParaServidor.nuevoCodigoRegion = data.nuevoCodigoRegion;
      }

      if (Object.keys(formateadosParaServidor).length > 0) {
        // Petición al servidor con los datos ya formateados
        await instance.post("localidades/", formateadosParaServidor);
      }

      // Limpiar los campos después de enviar
      reset();
      setPaisSeleccionado('');
      setCodigoPaisSeleccionado('');
      setRegionSeleccionado('');
      setCodigoRegionSeleccionado('');
      setError('');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError('Ocurrió un error al enviar los datos.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Formatear los datos ingresados para mostrar y validar duplicados
    const { formateadosParaMostrar, formateadosParaServidor } = FormatearDatos(formData);

    // Validación en tiempo real: verificar si los datos ya existen
    const datosDuplicados = verificarDatosDuplicados(formateadosParaServidor);  // Asegúrate de definir o importar esta función
    if (datosDuplicados) {
      setError("Los datos ingresados ya existen en la base de datos");
    } else {
      setError(null);
      setFormateadosParaMostrar(formateadosParaMostrar);
    }

  }, [formData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Incorporar el componente PaisForm */}
      <PaisForm
        register={register}
        errors={errors}
        setValue={setValue}
        onChange={handleInputChange}  // Asignamos handleInputChange aquí para manejar cambios
        nuevoPais={formateadosParaMostrar.nuevoPais || ''}
        clearErrors={clearErrors}
        setPaisSeleccionado={setPaisSeleccionado}
        codigoPaisSeleccionado={codigoPaisSeleccionado}
        setCodigoPaisSeleccionado={setCodigoPaisSeleccionado}
        paisSeleccionado={paisSeleccionado}
      />

      {/* Incorporar el componente RegionForm */}
      <RegionForm
        register={register}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        setRegionSeleccionado={setRegionSeleccionado}
        codigoRegionSeleccionado={codigoRegionSeleccionado}
        setCodigoRegionSeleccionado={setCodigoRegionSeleccionado}
        setPaisSeleccionado={setPaisSeleccionado}
        setCodigoPaisSeleccionado={setCodigoPaisSeleccionado}
      />

      <button type="submit">Guardar</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default FormularioLocalidades;
