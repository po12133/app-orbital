'use client';

import { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const OrbitalGraph = dynamic(() => import('@/components/OrbitalGraph'), {
  ssr: false,
});

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};


export default function DashboardPage() {
  const [formData, setFormData] = useState({
    a: '', e: '', i: '', nrev: '', omega: '', theta: '', w: ''
  });
  const [tipoVisualizacion, setTipoVisualizacion] = useState('orbital');
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrbitaChange = (e) => {
    setTipoVisualizacion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (tipoVisualizacion === 'orbital') {
        res = await axios.post(`${backendUrl}/primera-formula`, formData);
      }
      else if (tipoVisualizacion === 'tierra') {
        res = await axios.post(`${backendUrl}/segunda-formula`, formData);
      }
      setGraphData(res.data.data);
    } catch (err) {
      alert('Error al enviar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const generarCSV = (data) => {
    const headers = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'
    ];

    const rows = data.map((fila) => fila.join(','));
    return [headers.join(','), ...rows].join('\n');
  };
  const descargarCSV = () => {
    if (!graphData) return;
    const csv = generarCSV(graphData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resultados_orbita.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar - Formulario */}
      <aside style={{
        width: '350px',
        background: 'black',
        color: 'white',
        borderRadius: '20px',
        borderColor: `white`,
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '2rem',
        overflowY: 'auto'
      }}>
        <h1 style={{
          background: 'linear-gradient(90deg, #9d00ff, #00ffcc)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Determinación orbital de satélites artificiales terrestres
        </h1>
        <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Inserta tus parámetros</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="tipoVisualizacion" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Tipo de órbita
            </label>
            <select
              id="tipoVisualizacion"
              name="tipoVisualizacion"
              value={tipoVisualizacion}
              onChange={handleOrbitaChange}
              style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
            >
              <option value="orbital">Orbita periodica</option>
              <option value="tierra">Orbita con perturbacion</option>
            </select>
          </div>
         {/* Semi-eje mayor */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="a" style={{ display: 'block', marginBottom: '0.3rem' }}>
              A - Semi-eje mayor (km)
            </label>
            <input
              type="number"
              id="a"
              name="a"
              value={formData.a}
              onChange={handleChange}
              min="6378"
              step="any"
              required
              style={inputStyle}
            />
          </div>

          {/* Excentricidad */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="e" style={{ display: 'block', marginBottom: '0.3rem' }}>
              E - Excentricidad
            </label>
            <input
              type="number"
              id="e"
              name="e"
              value={formData.e}
              onChange={handleChange}
              min="0"
              max="0.9999"
              step="any"
              required
              style={inputStyle}
            />
          </div>

          {/* Inclinación */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="i" style={{ display: 'block', marginBottom: '0.3rem' }}>
              I - Inclinación (°)
            </label>
            <input
              type="number"
              id="i"
              name="i"
              value={formData.i}
              onChange={handleChange}
              min="0"
              max="180"
              step="any"
              required
              style={inputStyle}
            />
          </div>

          {/* Número de revoluciones */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="nrev" style={{ display: 'block', marginBottom: '0.3rem' }}>
              NREV - Número de revoluciones
            </label>
            <input
              type="number"
              id="nrev"
              name="nrev"
              value={formData.nrev}
              onChange={handleChange}
              min="0"
              max="5000"
              step="any"
              required
              style={inputStyle}
            />
          </div>

          {/* Longitud del nodo ascendente */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="omega" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Ω - Longitud nodo ascendente (°)
            </label>
            <input
              type="number"
              id="omega"
              name="omega"
              value={formData.omega}
              onChange={handleChange}
              min="0"
              max="360"
              step="any"
              required
              style={inputStyle}
            />
          </div>

          {/* Anomalía verdadera */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="theta" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Θ - Argumento del perigeo (°)
            </label>
            <input
              type="number"
              id="theta"
              name="theta"
              value={formData.theta}
              onChange={handleChange}
              min="0"
              max="360"
              step="any"
              required
              style={inputStyle}
            />
          </div>

          {/* Argumento del periastro */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="w" style={{ display: 'block', marginBottom: '0.3rem' }}>
              ω (°)
            </label>
            <input
              type="number"
              id="w"
              name="w"
              value={formData.w}
              onChange={handleChange}
              min="0"
              max="360"
              step="any"
              required
              style={inputStyle}
            />
          </div>
       
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            CARGAR GRÁFICO
          </button>
        </form>
        {graphData && (
        <button
          onClick={descargarCSV}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '12px',
            background: '#00ffcc',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          DESCARGAR RESULTADOS
        </button>
      )}

      </aside>

      {/* Main - Gráfico */}
      <main style={{ flex: 1, background: 'black', position: 'relative' }}>
        {isLoading && (
            <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.5rem'
            }}>
            Cargando...
            </div>
        )}

        {!isLoading && graphData && <OrbitalGraph graphData={graphData} />}
        </main>
    </div>
  );
}
