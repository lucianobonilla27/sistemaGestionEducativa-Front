import React, { useState, useContext } from 'react';
import { AlumnosContext } from '../../context/AlumnosContext';

function CrearAlumno() {
  const { crearAlumno } = useContext(AlumnosContext);
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
      <label htmlFor="email" className="form-label">
        Email:
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <label htmlFor="contraseña" className="form-label">
        Contraseña:
        <input
          type="password"
          name="contraseña"
          className="form-control"
          value={formData.contraseña}
          onChange={handleInputChange}
          required
        />
      </label>
      <label htmlFor="nombre" className="form-label">
        Nombre:
        <input
          type="text"
          name="nombre"
          className="form-control"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit" className="btn btn-primary">Crear Alumno</button>
    </form>
  );
}

export default CrearAlumno;
