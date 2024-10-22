import Carrusel1 from './Carrusel1';
const Dashboard = () => {
  return (
    <div>
      <h1>Bienvenido a Yammy Yammy</h1>
      <p>Esta es la vista del Usuario</p>
      
      {/* Llama al componente Carrusel1 */}
      <div>
        <h2>Gestionar Carrusel 1</h2>
        <Carrusel1 />
      </div>
    </div>
  );
};

export default Dashboard;
