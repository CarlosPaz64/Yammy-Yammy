import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { toast } from 'react-toastify';

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
  descripcion_ubicacion: string;
}

const API_LINK = import.meta.env.VITE_API_LINK || 'https://yamy-yamy-api.vercel.app';
const SECRET_KEY = 'tu_clave_secreta';

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<IFormInput>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mostrarCampos, setMostrarCampos] = useState(false);
  const [errorFetch, setErrorFetch] = useState<string | false>(false);

  const fetchColoniasYCiudad = async (codigo_postal: string) => {
    try {
      const response = await fetch(`${API_LINK}/api/codigo-postal/${codigo_postal}`);
      if (!response.ok) {
        const errorData = await response.json(); // Captura el mensaje del backend
        setErrorFetch(errorData.message || "Código postal no encontrado");
        setColonias([]);
        setCiudad('');
        setMostrarCampos(false);
        return;
      }
  
      const data = await response.json();
      const { ciudad, colonias } = data;
  
      setCiudad(ciudad);
      setColonias(colonias);
      setValue('ciudad', ciudad);
      setMostrarCampos(true);
      setErrorFetch(false); // Limpia el error si el fetch es exitoso
    } catch (error) {
      console.error('Error al obtener la ciudad y colonias:', error);
      setErrorFetch("Error al conectarse al servidor"); // Mensaje genérico para errores de conexión
      setColonias([]);
      setCiudad('');
      setMostrarCampos(false);
    }
  };

  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigo_postal = e.target.value;
    setCodigoPostal(codigo_postal);
  
    if (codigo_postal.length === 5) {
      await fetchColoniasYCiudad(codigo_postal);
    } else {
      setMostrarCampos(false);
      setCiudad('');
      setColonias([]);
      setErrorFetch(false); // Limpia el error cuando el código postal no es válido
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
  
      if (response.ok) {
        toast.success('Usuario registrado exitosamente. Redirigiendo al login...', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate('/login'); // Manda al usuario al login
      } else {
        toast.error('Error al registrar el usuario.', {
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
      toast.error('Error en el registro de usuario.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };  

  const nextStep = async () => {
    let fieldsToValidate: (keyof IFormInput)[] = [];
    if (currentStep === 1) fieldsToValidate = ['nombre_cliente', 'apellido_cliente'];
    if (currentStep === 2) fieldsToValidate = ['email', 'password_cliente'];
    if (currentStep === 3) fieldsToValidate = ['numero_telefono'];
    if (currentStep === 4) fieldsToValidate = ['calle', 'numero_exterior', 'codigo_postal', 'colonia'];
  
    const isValid = await trigger(fieldsToValidate);
  
    if (isValid) setCurrentStep((prev) => prev + 1);
  };
  
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const navigate = useNavigate();

  return (
    <React.Fragment>{/* Fragmento react, se puede utilizar tambien el Fragmento <></> para envolver todos los hijos en un elemento padre */}
      <section className='body-register'>
        <div className='container'>
          {/*Encabezado del formulario, aqui va el número de pasos de la página*/}
          <header>Registro<br />de usuario</header>
          <div className="progress-bar">
            {['Nombre', 'Usuario', 'Teléfono', 'Domicilio'].map((step, index) => (
              <div
                className={`step ${currentStep > index ? 'active' : ''} ${currentStep === index + 1 ? 'current' : ''}`}
                key={index}
              >
                <p>{step}</p>
                <div className="bullet">
                  {/* Muestra el número si es el paso actual, o un check si está completo */}
                  {currentStep > index ? (
                    <span className="check-symbol">✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/*Formularios del 1 al 5*/}
          <div className='form-outer'>
            <form className='form-register' onSubmit={handleSubmit(onSubmit)}>
              {/* Paso 1: Nombre */}
              {currentStep === 1 && (
                <div className='page slide-page'>
                  <div className='title'>Nombre Completo</div>
                  <div className='field'>
                    <div className='label'>Nombre: </div>
                    <input {...register('nombre_cliente', { required: true })} />
                    {errors.nombre_cliente && <span className='span'>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Apellido: </div>
                    <input {...register('apellido_cliente', { required: true })} />
                    {errors.apellido_cliente && <span className='span'>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <button type="button" className='firstNext next' onClick={nextStep}>Next</button>
                  </div>
                </div>
              )}
              {/* Paso 2: Usuario */}
              {currentStep === 2 && (
                <div className="page">
                  <div className='title'>Usuario</div>
                  <div className='field'>
                    <div className='label'>Email: </div>
                    <input type="email" {...register('email', { required: true })} />
                    {errors.email && <span className='span'>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Contraseña: </div>
                    <input type="password" {...register('password_cliente', {
                      required: 'La contraseña es obligatoria',
                      minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres',
                      },
                    })} />
                    {errors.password_cliente && <span className='span'>{errors.password_cliente.message}</span>}
                  </div>
                  <div className='field btns'>                    
                    <button type="button" className="prev-1 prev" onClick={prevStep}>Previous</button>
                    <button type="button" className="next-1 next" onClick={nextStep}>Next</button>
                  </div>
                </div>
              )}
              {/* Paso 3: Teléfono */}
                {currentStep === 3 && (
                  <div className="page">
                    <div className="title">Teléfono</div>
                    <div className="field">
                      <div className="label">Número de Teléfono:</div>
                      <input
                        {...register('numero_telefono', {
                          required: 'El número de teléfono es obligatorio',
                          minLength: {
                            value: 10,
                            message: 'El número de teléfono debe tener 10 caracteres',
                          },
                          maxLength: {
                            value: 10,
                            message: 'El número de teléfono debe tener 10 caracteres',
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Solo se permiten números',
                          },
                        })}
                      />
                      {errors.numero_telefono && (
                        <p className="error-message">{errors.numero_telefono.message}</p>
                      )}
                    </div>
                    <div className="field btns">
                      <button type="button" className="prev-2 prev" onClick={prevStep}>
                        Previous
                      </button>
                      <button type="button" className="next-2 next" onClick={nextStep}>
                        Next
                      </button>
                    </div>
                  </div>
                )}
              {/* Paso 4: Domicilio */}
              {currentStep === 4 && (
                <div className="page">
                  <div className='title'>Domicilio</div>
                  <div className='field'>
                    <div className='label'>Calle: </div>
                    <input {...register('calle', { required: true })} />
                    {errors.calle && <span className='span'>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Número Exterior: </div>
                    <input {...register('numero_exterior', { required: true })} />
                    {errors.numero_exterior && <span className='span'>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Número Interior (Opcional): </div>
                    <input {...register('numero_interior')} />
                  </div>
                  <div className="field">
                    <div className="label">Código Postal: </div>
                    <div className="input-with-icon">
                      <input
                        {...register("codigo_postal", {
                          required: "Este campo es obligatorio",
                          minLength: { value: 5, message: "El código postal debe tener 5 caracteres" },
                          maxLength: { value: 5, message: "El código postal debe tener 5 caracteres" },
                        })}
                        value={codigoPostal}
                        onChange={handlePostalCodeChange}
                        maxLength={5}
                        placeholder="97000"
                      />
                      <i
                        className="fa fa-info-circle tooltip-icon"
                        aria-hidden="true"
                        title="Solo se aceptan códigos postales de Mérida, Progreso, Kanasí y Umán"
                      ></i>
                    </div>
                    {errors.codigo_postal && <span className='span'>{errors.codigo_postal.message}</span>}
                    {errorFetch && <span className='span' style={{ color: "red" }}>{errorFetch}</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Descripción: </div>
                    <textarea {...register('descripcion_ubicacion')} />
                  </div>
                  {mostrarCampos && (
                    <>
                      <div className='field'>
                        <label className='label'>Colonia</label>
                        <select {...register('colonia', { required: true })}>
                          {colonias.map((colonia, index) => (
                            <option key={index} value={colonia}>{colonia}</option>
                          ))}
                        </select>
                        {errors.colonia && <span className='span'>Este campo es requerido</span>}
                      </div>
                      <div className='field'>
                        <label className='label'>Ciudad</label>
                        <input {...register('ciudad')} value={ciudad} disabled />
                      </div>
                    </>
                  )}
                  <div className='field btns'>
                    <button type="button" className="prev-4 prev" onClick={prevStep}>Previous</button>
                    <button type="submit" className="next-4 next" disabled={isLoading}>{isLoading ? 'Registrando...' : 'Registrar'}</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default RegisterForm;