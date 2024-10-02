import React from 'react';
import './App.css';
import FormularioLocalidades from './components/FormLocalidades';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>bienvenido a mi app</h1>
        <FormularioLocalidades/>
      </header>
    </div>
  );
}

export default App;
