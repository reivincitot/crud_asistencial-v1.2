import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paises: [],
  codigopais: [],
  regiones: [],
  codigoregion: [],
  provincias: [],
  comunas: [],
  ciudades: [],
};

const localidadesSlice = createSlice({
  name: 'localidades',
  initialState,
  reducers: {
    addPais: (state, action) => {
      state.paises.push(action.payload);
    },
    addCodigoPais: (state, action) => {
      state.codigopais.push(action.payload);
    },
    addRegion: (state, action) => {
      state.regiones.push(action.payload);
    },
    addCodigoRegion: (state, action) => {
      state.paises.push(action.payload);
    },
    addProvincia: (state, action) => {
      state.regiones.push(action.payload);
    },
    addComuna: (state, action) => {
      state.provincias.push(action.payload);
    },
    addCiudad: (state, action) => {
      state.ciudades.push(action.payload)
    },
  },
})

export const { addPais, addCodigoPais, addRegion, addCodigoRegion, addProvincia, addComuna, addCiudad } = localidadesSlice.actions;
export default localidadesSlice.reducer