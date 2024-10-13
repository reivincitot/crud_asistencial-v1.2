import * as yup from 'yup';

// Definir el esquema de validación con yup
export const schema = yup.object().shape({
  nuevoPais: yup.string().required('El nombre del país es obligatorio'),
  nuevoCodigoPais: yup.string().when('nuevoPais', {
    is: (val) => val && val.length > 0,
    then: yup.string().required('El código del país es obligatorio')
  }),

  nuevaRegion: yup.string().required('El nombre de la región es obligatorio'),
  nuevoCodigoRegion: yup.string().when('nuevaRegion', {
    is: (val) => val && val.length > 0,
    then: yup.string().required('El código de la región es obligatorio')
  }),
  nuevaProvincia: yup.string(),
  nuevaComuna: yup.string(),
  nuevaCiudad: yup.string(),
});

export default schema;