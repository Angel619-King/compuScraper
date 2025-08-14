import React from 'react';
import './Buscador.css';

const Buscador = ({ busqueda, setBusqueda, onSearch, isLoading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  const handleClear = () => {
    setBusqueda('');
  };

  return (
    <div className="buscador-container">
      <form 
        className="buscador-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="input-container">
          <input
            type="text"
            placeholder="Busca un puesto de trabajo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={handleKeyDown}
            className="buscador-input"
            disabled={isLoading}
          />
          {busqueda && (
            <button 
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>
        <button 
          type="submit"
          className={`buscador-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !busqueda.trim()}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            <>
              <span className="button-text">Buscar</span>
              <span className="search-icon">🔍</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Buscador;
