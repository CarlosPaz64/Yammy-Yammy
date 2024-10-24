import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// se define el esquema de validación con zod
const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// se define los tipos basados en el esquema
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log('Datos del formulario:', data);

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
