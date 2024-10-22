import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import './register.css';

interface IFormInput {
  nombre_cliente: string;
  apellido_cliente: string;
  email: string;
  password_cliente: string;
  numero_telefono?: string;
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  ciudad: string;
  codigo_postal: string;
  descripcion: string;
}

const API_LINK = import.meta.env.VITE_API_LINK || 'http://localhost:3000';
const SECRET_KEY = 'tu_clave_secreta';  // Usa la misma clave que en tu backend

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm<IFormInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);  // Estado para almacenar las colonias
  const [codigoPostal, setCodigoPostal] = useState('');    // Estado para almacenar el código postal
  const [ciudad, setCiudad] = useState('');                // Estado para almacenar la ciudad
  const [mostrarCampos, setMostrarCampos] = useState(false);  // Controlar la visibilidad de Colonia y Ciudad

  // Función para verificar el código postal en la API de Zippopotam y obtener las colonias
  const fetchColonias = async (codigo_postal: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/MX/${codigo_postal}`);
      if (!response.ok) {
        setColonias([]);  // Limpiar colonias si el código postal no es válido
        setMostrarCampos(false);  // Ocultar campos si el código postal no es válido
        return null;
      }
      const data = await response.json();
      const nombresColonias = data.places.map((place: any) => place['place name']);
      setColonias(nombresColonias);  // Actualiza las colonias
      setMostrarCampos(true);  // Muestra los campos de Colonia y Ciudad
    } catch (error) {
      console.error('Error al obtener las colonias de Zippopotam:', error);
    }
  };

  // Función para verificar el código postal y obtener la ciudad desde tu API local
  const fetchCiudad = async (codigo_postal: string) => {
    try {
      const response = await fetch(`${API_LINK}/api/codigo-postal/${codigo_postal}`);
      if (!response.ok) {
        setCiudad('');  // Limpiar la ciudad si no es válida
        return null;
      }
      const data = await response.json();
      const { ciudad } = data;
      setCiudad(ciudad);
      setValue('ciudad', ciudad);  // Establece la ciudad en el formulario
    } catch (error) {
      console.error('Error al obtener la ciudad desde tu API:', error);
    }
  };

  // Maneja el cambio en el código postal
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigo_postal = e.target.value;
    setCodigoPostal(codigo_postal);

    if (codigo_postal.length === 5) {
      // Solo llama a las API cuando el código postal tiene 5 caracteres
      await fetchColonias(codigo_postal);  // Llamada a Zippopotam para obtener las colonias
      await fetchCiudad(codigo_postal);  // Llamada a tu API local para obtener la ciudad
    } else {
      // Ocultar los campos si el código postal no es válido
      setMostrarCampos(false);
      setCiudad('');  // Resetea la ciudad
    }
  };

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
        <input type="password" {...register('password_cliente', { required: true })} />
        {errors.password_cliente && <span>Este campo es requerido</span>}
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
        <label>Código Postal</label>
        <input
          {...register('codigo_postal', { required: true })}
          value={codigoPostal}
          onChange={handlePostalCodeChange}
        />
        {errors.codigo_postal && <span>{errors.codigo_postal.message || 'Este campo es requerido'}</span>}
      </div>

      <div>
        <label>Descripción</label>
        <textarea {...register('descripcion')} />
      </div>

      {/* Mostrar Colonia y Ciudad solo cuando el código postal sea válido */}
      {mostrarCampos && (
        <>
          <div>
            <label>Colonia</label>
            {colonias.length > 0 ? (
              <select {...register('colonia', { required: true })}>
                {colonias.map((colonia, index) => (
                  <option key={index} value={colonia}>
                    {colonia}
                  </option>
                ))}
              </select>
            ) : (
              <input {...register('colonia', { required: true })} />
            )}
            {errors.colonia && <span>Este campo es requerido</span>}
          </div>

          <div>
            <label>Ciudad</label>
            <input
              {...register('ciudad', { required: true })}
              value={ciudad}  // Establece el valor del input desde el estado
              disabled  // Deshabilita el campo para que no se pueda modificar
            />
            {errors.ciudad && <span>Este campo es requerido</span>}
          </div>
        </>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
};

export default RegisterForm;
