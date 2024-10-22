import React from 'react';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';

interface IFormInput {
  nombre_cliente: string;
  apellido_cliente: string;
  email: string;
  password: string;
  numero_telefono?: string;
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  ciudad: string;
  codigo_postal: string;
}

const API_LINK = import.meta.env.VITE_API_LINK || 'http://localhost:3000';
const SECRET_KEY = 'tu_clave_secreta';  // Usa la misma clave que en tu backend

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    try {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      const response = await fetch(`${API_LINK}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Usuario registrado exitosamente', result);
        alert('Usuario registrado exitosamente');
      } else {
        console.error('Error en el registro:', result);
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al encriptar o enviar los datos:', error);
      alert('Error en el registro de usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Registro de Usuario</h1>

      <div>
        <label>Nombre</label>
        <input {...register('nombre_cliente', { required: true })} />
        {errors.nombre_cliente && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Apellido</label>
        <input {...register('apellido_cliente', { required: true })} />
        {errors.apellido_cliente && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register('email', { required: true })} />
        {errors.email && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Contraseña</label>
        <input type="password" {...register('password', { required: true })} />
        {errors.password && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Número de Teléfono (Opcional)</label>
        <input {...register('numero_telefono')} />
      </div>

      <div>
        <label>Calle</label>
        <input {...register('calle', { required: true })} />
        {errors.calle && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Número Exterior</label>
        <input {...register('numero_exterior', { required: true })} />
        {errors.numero_exterior && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Número Interior (Opcional)</label>
        <input {...register('numero_interior')} />
      </div>

      <div>
        <label>Colonia</label>
        <input {...register('colonia', { required: true })} />
        {errors.colonia && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Ciudad</label>
        <input {...register('ciudad', { required: true })} />
        {errors.ciudad && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Código Postal</label>
        <input {...register('codigo_postal', { required: true })} />
        {errors.codigo_postal && <span>Este campo es requerido</span>}
      </div>

      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegisterForm;
