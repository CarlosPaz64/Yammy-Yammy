import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CryptoJS from 'crypto-js';  // Importa CryptoJS para la encriptación

const API_LINK = import.meta.env.VITE_API_LINK || 'http://localhost:3000';
const SECRET_KEY = 'tu_clave_secreta';  // Usa la misma clave que en tu backend

// Esquema de validación usando zod
const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Encriptar los datos usando AES
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      const response = await fetch(`${API_LINK}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),  // Enviar los datos encriptados
      });

      const result = await response.json();

      if (response.ok) {
        // Login exitoso, recibir token y user ID
        const { token, userId } = result;
        console.log('Token:', token);
        console.log('User ID:', userId);
        alert('Inicio de sesión exitoso');
      } else {
        // Muestra los errores en caso de fallo
        console.error('Error al iniciar sesión:', result);
        alert(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <h2>Iniciar Sesión</h2>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            {...register('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            {...register('password')}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginForm;
