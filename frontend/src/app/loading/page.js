'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const bc = new BroadcastChannel('graphics_channel');

    bc.onmessage = (ev) => {
      if (ev.data === 'graphics_ready') {
        bc.close();
        router.push('/graphics');
      }
    };

    // En caso no llegue mensaje en 20 segundos, redirige igual para no bloquear
    const timeout = setTimeout(() => {
      bc.close();
      router.push('/graphics');
    }, 1000);

    return () => {
      bc.close();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      color: 'white',
      fontSize: '1.5rem',
      flexDirection: 'column'
    }}>
      <div className="spinner"></div>
      <p>Cargando datos orbitales...</p>

      <style jsx>{`
        .spinner {
          border: 6px solid rgba(255, 255, 255, 0.2);
          border-top: 6px solid #00ff00;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
