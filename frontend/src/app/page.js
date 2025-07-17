'use client';

import { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const OrbitalGraph = dynamic(() => import('@/components/OrbitalGraph'), {
  ssr: false,
});

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DashboardPage() {
  const [formData, setFormData] = useState({
    a: '', e: '', i: '', nrev: '', omega: '', theta: '', w: '',
  });
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/primera-formula`, formData);
      setGraphData(res.data.data);
    } catch (err) {
      alert('Error al enviar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
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
          {Object.keys(formData).map((key) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label htmlFor={key} style={{ display: 'block', marginBottom: '0.3rem' }}>
                {key.toUpperCase()}
              </label>
              <input
                type="number"
                step="any"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          ))}
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
