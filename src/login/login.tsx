import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const API_URL = import.meta.env.VITE_API_LINK;
const SECRET_KEY = 'my-secret-key'; // Clave secreta compartida entre frontend y backend

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // Encriptar los datos con AES
  const encriptarDatos = (data: string): string => {
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // Devuelve la cadena completa generada por CryptoJS
  };

  const handleLogin = async (data: FormData) => {
    try {
      // Encriptar los datos antes de enviarlos al backend
      const encriptedUsername = encriptarDatos(data.username);
      const encriptedPassword = encriptarDatos(data.password);

      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: encriptedUsername,
          password: encriptedPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Almacenar el token en localStorage
        localStorage.setItem('token', result.token);

        // Redirigir a la ruta de dashboard del admin tras un login exitoso
        navigate('/admin/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit(handleLogin)}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            {...register('username', { required: 'El username es requerido' })}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register('password', { required: 'El password es requerido' })}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
