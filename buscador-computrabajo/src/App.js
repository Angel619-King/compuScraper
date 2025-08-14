import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import fotoVictor from "./components/foto-victor.jpg";
import fotoLuis from "./components/foto-luis1.jpg";
import Buscador from './components/Buscador';
import { geocodeLocationManual } from './components/manualGeode';
import BotonesExportar from './components/BotonesExportar';
import DevCard from './components/DevCard';

import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const Filtros = ({ filtro, setFiltro }) => (
  <div className="filtros">
    <button onClick={() => setFiltro('todos')} className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}>
      Todas las ofertas
    </button>
    <button onClick={() => setFiltro('mejores')} className={`filtro-btn ${filtro === 'mejores' ? 'active' : ''}`}>
      Mejores pagados
    </button>
    <button onClick={() => setFiltro('peores')} className={`filtro-btn ${filtro === 'peores' ? 'active' : ''}`}>
      Peores pagados
    </button>
  </div>
);

const OfertaCard = ({ oferta }) => {
  const [mostrarCompleto, setMostrarCompleto] = useState(false);
  const maxPalabras = 30;
  
  const descripcionCorta = () => {
    const palabras = oferta.descripcion.split(' ');
    if (palabras.length <= maxPalabras || mostrarCompleto) {
      return oferta.descripcion;
    }
    return palabras.slice(0, maxPalabras).join(' ') + '...';
  };

  return (
    <div className="oferta-card">
      <h3 className="oferta-titulo">{oferta.titulo}</h3>
      <p><strong>Empresa:</strong> {oferta.empresa}</p>
      <p><strong>Ubicación:</strong> {oferta.ubicacion}</p>
      <p className="salario"><strong>Salario:</strong> {oferta.salario}</p>
      <p><strong>Descripción:</strong> {descripcionCorta()}</p>
      {oferta.descripcion.split(' ').length > maxPalabras && (
        <button 
          onClick={() => setMostrarCompleto(!mostrarCompleto)} 
          className="btn-mostrar-mas"
        >
          {mostrarCompleto ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}
    </div>
  );
};

const LeafletMap = ({ ofertas, centro, zoom, height }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(centro, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    if (map) {
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      ofertas.forEach(oferta => {
        L.marker([oferta.coordenadas.lat, oferta.coordenadas.lng])
          .addTo(map)
          .bindPopup(
            `<h3>${oferta.titulo}</h3>` +
            `<p><strong>Salario:</strong> ${oferta.salario}</p>` +
            `<p><strong>Ubicación:</strong> ${oferta.ubicacion}</p>`
          );
      });

      map.setView(centro, zoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [ofertas, centro, zoom]);

  return <div ref={mapRef} style={{ height, width: '100%', borderRadius: '12px' }} />;
};

function App() {
  const [ofertas, setOfertas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarMapaTop10, setMostrarMapaTop10] = useState(false);

  const fetchOfertas = async () => {
    if (!busqueda.trim()) {
      setError('Por favor, ingresa un puesto de trabajo para buscar.');
      return;
    }

    setCargando(true);
    setError(null);
    setOfertas([]);
    setMostrarMapaTop10(false);

    try {
      const response = await axios.post('https://compuscraper-production.up.railway.app/', { puesto: busqueda });
      const ofertasBase = response.data;

      const ofertasConCoords = ofertasBase.map((oferta) => {
        const coordenadas = geocodeLocationManual(oferta.ubicacion);
        return {
          ...oferta,
          coordenadas: coordenadas || { lat: 19.4326, lng: -99.1332 },
        };
      }).filter(oferta => oferta !== null);

      setOfertas(ofertasConCoords);
    } catch (err) {
      setError("No se pudieron cargar las ofertas. Asegúrate de que el servidor esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  const ofertasFiltradas = () => {
    let resultados = [...ofertas];

    switch (filtro) {
      case 'mejores':
        resultados = resultados
          .filter(item => !isNaN(parseFloat(String(item.salario).replace(/[^0-9.]/g, ''))))
          .sort((a, b) => (
            parseFloat(String(b.salario).replace(/[^0-9.]/g, '')) - 
            parseFloat(String(a.salario).replace(/[^0-9.]/g, ''))
          ))
          .slice(0, 10);
        break;

      case 'peores':
        resultados = resultados
          .filter(item => !isNaN(parseFloat(String(item.salario).replace(/[^0-9.]/g, ''))))
          .sort((a, b) => (
            parseFloat(String(a.salario).replace(/[^0-9.]/g, '')) - 
            parseFloat(String(b.salario).replace(/[^0-9.]/g, ''))
          ))
          .slice(0, 10);
        break;

      default:
        break;
    }

    return resultados;
  };

  const handleSearchClick = () => fetchOfertas();

  const handleVerMapaTop10 = () => {
    setFiltro('mejores');
    setMostrarMapaTop10(true);
  };

  const handleCerrarMapa = () => {
    setMostrarMapaTop10(false);
    setFiltro('todos');
  };

  const resultadosRender = ofertasFiltradas();

  const hayDatosValidos = ofertas.length > 0 && ofertas.some(
    item => !isNaN(parseFloat(String(item.salario).replace(/[^0-9.]/g, '')))
  );

  return (
    <div className="App">
      <div className="header-gradient">
        <div className="header-inner">
          <h1 className="app-title">Sistema de Búsqueda de Empleos</h1>
          <Buscador
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            onSearch={handleSearchClick}
            isLoading={cargando}
          />
        </div>
      </div>

      <div className="panel">
        <Filtros filtro={filtro} setFiltro={setFiltro} />

        <div className="toolbar">
          {hayDatosValidos && (
            <button onClick={handleVerMapaTop10} className="btn-primary">
              Ver mapa de los 10 mejores
            </button>
          )}

          {ofertas.length > 0 && (
            <BotonesExportar datos={ofertas} />
          )}
        </div>

        {cargando && <p className="info">🔍 Buscando ofertas de empleo...</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && resultadosRender.length === 0 && !error && (
          <p className="info">No se encontraron ofertas. Intenta una nueva búsqueda.</p>
        )}

        {!cargando && resultadosRender.length > 0 && (
          <div className="ofertas-grid">
            {resultadosRender.map((oferta, index) => (
              <OfertaCard key={index} oferta={oferta} />
            ))}
          </div>
        )}

        {mostrarMapaTop10 && (
          <div className="mapa-container">
            <button className="btn-danger" onClick={handleCerrarMapa}>Cerrar Mapa</button>
            <h2 className="map-title">Ubicación de las 10 ofertas mejor pagadas</h2>
            <LeafletMap
              ofertas={resultadosRender}
              centro={[19.4326, -99.1332]}
              zoom={6}
              height="500px"
              key={`map-top10`}
            />
          </div>
        )}

        {/* === SECCIÓN EQUIPO === */}
        <h2 style={{ textAlign: "center", marginTop: "30px" }}>Nuestro Equipo</h2>
        <div className="dev-grid">
          <DevCard
            nombre="Victor Angel Cabrera del Angel"
            puesto="Desarrollador Front End"
            foto={fotoVictor}
            github="https://github.com/Angel619-King?tab=repositories"
            linkedin="https://www.linkedin.com/in/victor-angel-cabrera-del-angel-b05855304"
          />
          <DevCard
            nombre="Luis Mario Reyes Angeles"
            puesto="Desarrollador Back End"
            foto={fotoLuis}
            github="https://github.com/usuario"
            facebook="https://www.facebook.com/share/19s9iBZsFr/"
          />

        </div>
      </div>
    </div>
  );
}

export default App;
