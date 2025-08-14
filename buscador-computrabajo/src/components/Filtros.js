import React from 'react';

const Filtros = ({ filtro, setFiltro }) => {
  return (
    <div className="filtros">
      <button 
        className={filtro === 'todos' ? 'active' : ''}
        onClick={() => setFiltro('todos')}
      >
        Todos
      </button>
      <button 
        className={filtro === 'mejores' ? 'active' : ''}
        onClick={() => setFiltro('mejores')}
      >
        Top 10 Mayores
      </button>
      <button 
        className={filtro === 'peores' ? 'active' : ''}
        onClick={() => setFiltro('peores')}
      >
        Top 10 Menores
      </button>
    </div>
  );
};

export default Filtros;