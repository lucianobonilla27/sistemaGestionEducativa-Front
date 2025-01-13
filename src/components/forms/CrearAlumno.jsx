import React, { useState } from 'react';
import { useUsuario } from '../../context/UsuarioContext';

function CrearAlumno() {
  const { crearAlumno } = useUsuario();
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
    nombre: '',
    estado: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await crearAlumno(formData);

    if (result.success) {
      alert(result.message);
      setFormData({ email: '', contraseña: '', nombre: '', estado: 1 }); // Limpiar formulario
    } else {
      alert('Error: ' + result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Alumno</h2>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Contraseña:
        <input
          type="password"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Nombre:
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Crear Alumno</button>
    </form>
  );
}

export default CrearAlumno;
