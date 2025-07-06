'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    a: '',
    e: '',
    i: '',
    nrev: '',
    omega: '',
    theta: '',
    w: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      const res = await axios.post('http://127.0.0.1:5000/primera-formula', formData);
      localStorage.setItem('resultData', JSON.stringify(res.data));
      router.push('/loading');
    } catch (err) {
      alert('Error al enviar: ' + err.message);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          min-height: 100vh;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .glass-card {
          background: rgba(15, 12, 41, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
          width: 90%;
          max-width: 400px;
          padding: 2.5rem;
          margin: 2rem;
          position: relative;
          z-index: 10;
        }
        
        .input-field {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          padding: 15px 20px;
          color: white;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .input-field:focus {
          background: rgba(255, 255, 255, 0.15);
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
        
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .btn-login {
          background: linear-gradient(45deg, #9d00ff, #ff00ff);
          color: white;
          border-radius: 50px;
          padding: 15px 0;
          margin-top: 15px;
          transition: all 0.3s ease;
          border: none;
          font-weight: 600;
          letter-spacing: 1px;
          width: 100%;
          cursor: pointer;
        }
        
        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(157, 0, 255, 0.4);
        }
        
        .title {
          background: linear-gradient(90deg, #9d00ff, #00ffcc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-align: center;
        }
      `}</style>

      <div className="glass-card">
        <h1 className="title">Orbital App</h1>
        <p className="text-white opacity-80 mb-8 text-center">Inserta tus parámetros</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="flex items-center text-white text-sm opacity-80 mb-1"
              >
                <i className="fas fa-sliders-h mr-2"></i>
                {key.toUpperCase()}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                placeholder={`Ingresa ${key}`}
                value={formData[key]}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          ))}

          <button type="submit" className="btn-login">
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
