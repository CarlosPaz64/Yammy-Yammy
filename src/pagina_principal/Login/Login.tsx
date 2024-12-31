import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useAppDispatch } from '../../hooks/reduxHooks'; 
import { login } from '../../slices/autentiSlice';
import { setUser } from '../../slices/userSlice';
import { toast } from 'react-toastify';

const API_LINK = import.meta.env.VITE_API_LINK || 'https://yamy-yamy-api.vercel.app';
const SECRET_KEY = 'tu_clave_secreta';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = (
    token: string,
    user: { nombre_cliente: string; apellido_cliente: string; email: string }
  ) => {
    // Actualiza el estado de autenticación y usuario en Redux
    dispatch(login(token));
    dispatch(setUser(user));
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Encripta los datos del formulario
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
    
      const response = await fetch(`${API_LINK}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),
      });
    
      const result = await response.json();
    
      if (response.ok) {
        const { token, userId, nombre, apellido, email } = result;
    
        // Guarda el token y userId en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
    
        // Actualiza Redux con el token y la información del usuario
        handleLogin(token, { nombre_cliente: nombre, apellido_cliente: apellido, email });
    
        // Redirige al usuario a la página principal
        navigate('/');
    
        // Notificación de éxito
        toast.success('¡Inicio de sesión exitoso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else {
        console.error('Error al iniciar sesión:', result);
    
        toast.error(result.message || 'Error al iniciar sesión', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    
      toast.error('Error al conectar con la API. Inténtalo de nuevo más tarde.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div>
      <form className='form-login' onSubmit={handleSubmit(onSubmit)}>
        <h2 className='text-login'>Iniciar Sesión</h2>
        <div className="form-group">
          <label className='label-login' htmlFor="email">Correo Electrónico</label>
          <input className='input-login' type="email" id="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label className='label-login' htmlFor="password">Contraseña</label>
          <input className='input-login' type="password" id="password" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" className="login-button">Iniciar Sesión</button>
        <p className="register-link">
        ¿No estás registrado?{' '}
        <span 
          className='register-link-text'
          onClick={() => navigate('/registro')}
        >
          Dale click aquí
        </span>
      </p>
      </form>
    </div>
  );
};

export default LoginForm;
