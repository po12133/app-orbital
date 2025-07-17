'use client';

import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function OrbitalGraph({ graphData }) {
  const graphRef = useRef(null);

  useEffect(() => {
    if (!graphData || !graphRef.current) return;

    const coords = graphData.map(row => [
      parseFloat(row[7]),
      parseFloat(row[8]),
      parseFloat(row[9]),
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

    // Crear esfera de la Tierra
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
        xaxis: { title: 'X', color: 'red' },
        yaxis: { title: 'Y', color: 'white' },
        zaxis: { title: 'Z', color: 'green' },
      }
    };

    Plotly.newPlot(graphRef.current, [trace, earth], layout);
  }, [graphData]);

  return <div ref={graphRef} style={{ height: '100%', width: '100%' }} />;
}
