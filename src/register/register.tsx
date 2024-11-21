import React, { useState, useEffect } from 'react';
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
  descripcion_ubicacion: string;
  tipo_tarjeta: 'Visa' | 'MasterCard' | 'American Express';
  numero_tarjeta: string;
  fecha_tarjeta: string;
  cvv: string;
}

const API_LINK = import.meta.env.VITE_API_LINK || 'http://localhost:3000';
const SECRET_KEY = 'tu_clave_secreta';

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormInput>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mostrarCampos, setMostrarCampos] = useState(false);

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
      console.error('Error al obtener la ciudad y colonias:', error);
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
    }
  };

  useEffect(() => {
    if (currentStep === 5) {
      const cardTypeSelect = document.getElementById('cardType') as HTMLSelectElement | null;
      const cardImage = document.getElementById('cardImage') as HTMLImageElement | null;
      const cardNumberInput = document.getElementById('cardNumber') as HTMLInputElement | null;
      const expiryDateInput = document.getElementById('expiryDate') as HTMLInputElement | null;
      const cvvInput = document.getElementById('cvv') as HTMLInputElement | null;
  
      const toggleCvvButton = document.createElement('button');
      toggleCvvButton.textContent = 'Mostrar';
      toggleCvvButton.type = 'button';
      toggleCvvButton.style.marginLeft = '10px';
  
      if (cardTypeSelect && cardImage && cardNumberInput && expiryDateInput && cvvInput) {
        // Evento para cambiar la imagen de la tarjeta
        cardTypeSelect.addEventListener('change', (e: Event) => {
          const cardType = (e.target as HTMLSelectElement).value.toLowerCase();
          switch (cardType) {
            case 'visa':
              cardImage.src = 'http://localhost:3000/assets/card_images/Visa.png';
              break;
            case 'mastercard':
              cardImage.src = 'http://localhost:3000/assets/card_images/MasterCard.png';
              break;
            case 'amex':
              cardImage.src = 'http://localhost:3000/assets/card_images/AmericanExpress.png';
              break;
            default:
              cardImage.src = 'http://localhost:3000/assets/card_images/Default.png';
          }
        });
  
        // Formatear número de tarjeta
        cardNumberInput.addEventListener('input', () => {
          let value = cardNumberInput.value.replace(/\D/g, '');
          value = value.match(/.{1,4}/g)?.join(' ') || '';
          cardNumberInput.value = value;
        });
  
        // Formatear fecha de vencimiento
        expiryDateInput.addEventListener('input', () => {
          let value = expiryDateInput.value.replace(/\D/g, '');
          if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
          }
          expiryDateInput.value = value.substring(0, 5);
        });
  
        // Mostrar/Ocultar CVV
        cvvInput.type = 'password';
        toggleCvvButton.addEventListener('click', () => {
          if (cvvInput.type === 'password') {
            cvvInput.type = 'text';
            toggleCvvButton.textContent = 'Ocultar';
          } else {
            cvvInput.type = 'password';
            toggleCvvButton.textContent = 'Mostrar';
          }
        });
        cvvInput.parentElement?.appendChild(toggleCvvButton);
      }
  
      return () => {
        // Limpiar eventos
        cardTypeSelect?.removeEventListener('change', () => {});
        cardNumberInput?.removeEventListener('input', () => {});
        expiryDateInput?.removeEventListener('input', () => {});
        toggleCvvButton.removeEventListener('click', () => {});
        toggleCvvButton.remove();
      };
    }
  }, [currentStep]); 

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
        alert('Usuario registrado exitosamente');
      } else {
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      alert('Error en el registro de usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <React.Fragment>{/* Fragmento react, se puede utilizar tambien el Fragmento <></> para envolver todos los hijos en un elemento padre */}
      <section className='body-register'>
        <div className='container'>
          {/*Encabezado del formulario, aqui va el número de pasos de la página*/}
          <header>Registro<br />de usuario</header>
          <div className='progress-bar'>
            {/*Se iteran los pasos del formulario del 1 al 5 y se le añade la clase active*/}
            {['Nombre', 'Usuario', 'Teléfono', 'Domicilio', 'Tarjeta'].map((step, index) => (
              <div className={`step ${currentStep > index ? 'active' : ''}`} key={index}>
                <p>{step}</p>
                <div className='bullet'><span>{index + 1}</span></div>
                <div className='material-symbols-outlined'>check</div>
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
                    {errors.nombre_cliente && <span>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Apellido: </div>
                    <input {...register('apellido_cliente', { required: true })} />
                    {errors.apellido_cliente && <span>Este campo es requerido</span>}
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
                    {errors.email && <span>Este campo es requerido</span>}
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
                    {errors.password_cliente && <span>{errors.password_cliente.message}</span>}
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
                  <div className='title'>Télefono</div>
                  <div className='field'>
                    <div className='label'>Número de Teléfono: </div>
                    <input {...register('numero_telefono', {required: true})} />
                  </div>
                  <div className='field btns'>
                    <button type="button" className="prev-2 prev" onClick={prevStep}>Previous</button>
                    <button type="button" className="next-2 next" onClick={nextStep}>Next</button>
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
                    {errors.calle && <span>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Número Exterior: </div>
                    <input {...register('numero_exterior', { required: true })} />
                    {errors.numero_exterior && <span>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Número Interior (Opcional): </div>
                    <input {...register('numero_interior')} />
                  </div>
                  <div className='field'>
                    <div className='label'>Código Postal: </div>
                    <input {...register('codigo_postal', { required: true })} value={codigoPostal} onChange={handlePostalCodeChange} />
                    {errors.codigo_postal && <span>Este campo es requerido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Descripción: </div>
                    <textarea {...register('descripcion_ubicacion')} />
                  </div>
                  {mostrarCampos && (
                    <>
                      <div>
                        <label>Colonia</label>
                        <select {...register('colonia', { required: true })}>
                          {colonias.map((colonia, index) => (
                            <option key={index} value={colonia}>{colonia}</option>
                          ))}
                        </select>
                        {errors.colonia && <span>Este campo es requerido</span>}
                      </div>
                      <div>
                        <label>Ciudad</label>
                        <input {...register('ciudad')} value={ciudad} disabled />
                      </div>
                    </>
                  )}
                  <div className='field btns'>
                    <button type="button" className="prev-3 prev" onClick={prevStep}>Previous</button>
                    <button type="button" className="next-3 next" onClick={nextStep}>Next</button>
                  </div>
                </div>
              )}
              {/* Paso 5: Tarjeta */}
              {currentStep === 5 && (
                <div className="page">
                  <div className='title'>Datos de la Tarjeta</div>
                  <div className='field'>
                    <div className='label'>Tipo de Tarjeta: </div>
                    <select {...register('tipo_tarjeta', { required: true })}>
                      <option value="Visa">Visa</option>
                      <option value="MasterCard">MasterCard</option>
                      <option value="American Express">American Express</option>
                    </select>
                    {errors.tipo_tarjeta && <span>Este campo es requerido</span>}
                  </div>
                  {/* Aqui se visualiza la tarjeta seleccionada por el cliente */}
                  <div className='card-preview'>
                    <img id="cardType" alt="Card Preview" />
                  </div>
                  <div className='field'>
                    <div className='label'>Número de Tarjeta: </div>
                    <input {...register('numero_tarjeta', { required: true, minLength: 15, maxLength: 16 })} />
                    {errors.numero_tarjeta && <span>El número de tarjeta es inválido</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>Fecha de Expiración: </div>
                    <input type="text" placeholder="MM/YY" {...register('fecha_tarjeta', {
                      required: true,
                      pattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                    })} />
                    {errors.fecha_tarjeta && <span>Formato inválido. Usa MM/YY</span>}
                  </div>
                  <div className='field'>
                    <div className='label'>CVV: </div>
                    <input type="text" {...register('cvv', { required: true, minLength: 3, maxLength: 4 })} />
                    {errors.cvv && <span>El CVV es inválido</span>}
                  </div>
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