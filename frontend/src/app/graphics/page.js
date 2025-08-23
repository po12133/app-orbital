'use client';

import { useEffect, useState } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function GraphicsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bc = new BroadcastChannel('graphics_channel');
    const rawData = localStorage.getItem('resultData');
    if (!rawData) return;

    const parsed = JSON.parse(rawData);
    const filas = parsed.data || [];

    const coords = filas.map(row => [
      parseFloat(row[7]),
      parseFloat(row[8]),
      parseFloat(row[9])
    ]);

    const x = coords.map(p => p[0]);
    const y = coords.map(p => p[1]);
    const z = coords.map(p => p[2]);

    const trace = {
      x,
      y,
      z,
      mode: 'markers',
      type: 'scatter3d',
      marker: { size: 3, color: 'green', opacity: 0.8 },
      name: 'Órbita'
    };

    // Tierra
    const r = 0.5;
    const steps = 75;
    const phi = [], theta = [];
    for (let i = 0; i < steps; i++) {
      phi.push((i * Math.PI) / (steps - 1));
      theta.push((i * 2 * Math.PI) / (steps - 1));
    }
    const x_sphere = [], y_sphere = [], z_sphere = [];
    for (let i = 0; i < steps; i++) {
      const rowX = [], rowY = [], rowZ = [];
      for (let j = 0; j < steps; j++) {
        rowX.push(r * Math.sin(phi[i]) * Math.cos(theta[j]));
        rowY.push(r * Math.sin(phi[i]) * Math.sin(theta[j]));
        rowZ.push(r * Math.cos(phi[i]));
      }
      x_sphere.push(rowX);
      y_sphere.push(rowY);
      z_sphere.push(rowZ);
    }

    const earth = {
      type: 'surface',
      x: x_sphere,
      y: y_sphere,
      z: z_sphere,
      colorscale: [[0, 'lightblue'], [1, 'blue']],
      opacity: 0.4,
      showscale: false,
      name: 'Tierra'
    };

    const layout = {
      paper_bgcolor: 'black',
      scene: {
        camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
        xaxis: { title: 'X', color: 'red', titlefont: { color: 'red' }, tickfont: { color: 'red' }, gridcolor: 'rgba(255,0,0,0.1)', zerolinecolor: 'red' },
        yaxis: { title: 'Y' },
        zaxis: { title: 'Z', color: 'green', titlefont: { color: 'green' }, tickfont: { color: 'green' }, gridcolor: 'rgba(0,255,0,0.1)', zerolinecolor: 'green' }
      }
    };

    Plotly.newPlot('graph', [trace, earth], layout).then(() => {
      setIsLoading(false);
      
      const bc = new BroadcastChannel('graphics_channel');
      bc.postMessage('graphics_ready');
      bc.close();
    });
  }, []);

  return (
    <div style={{ background: 'black', height: '100vh', width: '100%', position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          zIndex: 10,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.5rem',
          animation: 'spin 1s linear infinite'
        }}>
          Cargando...
        </div>
      )}
      <div id="graph" style={{ height: '100%', width: '100%' }}></div>
      <style jsx>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
