import React from 'react';
import './App.css';
import FormularioLocalidades from './components/FormLocalidades'; // Importar el formulario de localidades
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bienvenido a mi app</h1>
          {/* Agregar links para navegar entre páginas */}
          <nav>
            <ul>
              <li><Link to={"/"}>Inicio</Link></li>
              <li><Link to={'/localidades'}>Formulario de Localidades</Link></li>
            </ul>
          </nav>
        </header>

        <Routes>
          {/* Definir las rutas */}
          <Route path='/' element={<h2>Página de inicio</h2>} />
          <Route path='/localidades' element={<FormularioLocalidades />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
