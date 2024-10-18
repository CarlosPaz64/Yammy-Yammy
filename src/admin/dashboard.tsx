import Carrusel1 from './Carrusel1';
const Dashboard = () => {
  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <p>Esta es la vista del administrador</p>
      
      {/* Llama al componente Carrusel1 */}
      <div>
        <h2>Gestionar Carrusel 1</h2>
        <Carrusel1 />
      </div>
    </div>
  );
};

export default Dashboard;
