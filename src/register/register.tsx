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
  tipo_tarjeta: 'Visa' | 'MasterCard' | 'American Express';
  numero_tarjeta: string;
  fecha_tarjeta: string;
  cvv: string;
}

const API_LINK = import.meta.env.VITE_API_LINK || 'http://localhost:3000';
const SECRET_KEY = 'tu_clave_secreta';  // Usa la misma clave que en tu backend

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mostrarCampos, setMostrarCampos] = useState(false);

  // Función para obtener la ciudad y colonias desde tu API local
  const fetchColoniasYCiudad = async (codigo_postal: string) => {
    try {
      const response = await fetch(`${API_LINK}/api/codigo-postal/${codigo_postal}`);
      if (!response.ok) {
        setColonias([]);
        setCiudad('');
        setMostrarCampos(false);
        return null;
      }
      const data = await response.json();
      const { ciudad, colonias } = data;

      setCiudad(ciudad);
      setColonias(colonias);
      setValue('ciudad', ciudad);
      setMostrarCampos(true);
    } catch (error) {
      console.error('Error al obtener la ciudad y colonias desde la API:', error);
      setColonias([]);
      setCiudad('');
      setMostrarCampos(false);
    }
  };

  // Maneja el cambio en el código postal
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigo_postal = e.target.value;
    setCodigoPostal(codigo_postal);

    if (codigo_postal.length === 5) {
      await fetchColoniasYCiudad(codigo_postal);
    } else {
      setMostrarCampos(false);
      setCiudad('');
      setColonias([]);
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
        <input type="password" {...register('password_cliente', { 
          required: 'La contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
          } 
          })} />
        {errors.password_cliente && <span>{errors.password_cliente.message}</span>}
      </div>

      <div>
        <label>Número de Teléfono</label>
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
              value={ciudad}
              disabled
            />
            {errors.ciudad && <span>Este campo es requerido</span>}
          </div>
        </>
      )}

      {/* Campos de la tarjeta */}
      <div>
        <label>Tipo de Tarjeta</label>
        <select {...register('tipo_tarjeta', { required: true })}>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="American Express">American Express</option>
        </select>
        {errors.tipo_tarjeta && <span>Este campo es requerido</span>}
      </div>

      <div>
        <label>Número de Tarjeta</label>
        <input {...register('numero_tarjeta', { required: true, minLength: 15, maxLength: 16 })} />
        {errors.numero_tarjeta && <span>El número de tarjeta es inválido</span>}
      </div>

      <div>
        <label>Fecha de Expiración</label>
        <input type="text" placeholder="MM/YY" {...register('fecha_tarjeta', { required: true, pattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/ })} />
        {errors.fecha_tarjeta && <span>Formato inválido. Usa MM/YY</span>}
      </div>

      <div>
        <label>CVV</label>
        <input type="text" {...register('cvv', { required: true, minLength: 3, maxLength: 4 })} />
        {errors.cvv && <span>El CVV es inválido</span>}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
};

export default RegisterForm;
