import {confgureStore} from '@reduxjs/toolkit';
import localidadesReducer from '.reducers/localidades';

export const store = confgureStore({
  reducer: {
    localidades: localidadesReducer,
  },
});