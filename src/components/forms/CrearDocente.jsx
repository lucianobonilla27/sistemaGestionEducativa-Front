import React, { useState, useContext } from 'react';
import { DocentesContext } from '../../context/DocentesContext';

function CrearDocente() {
  const { crearDocente } = useContext(DocentesContext);
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

    const result = await crearDocente(formData);

    if (result.success) {
      alert(result.message);
      setFormData({ email: '', contraseña: '', nombre: '', estado: 1 }); // Clear form
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
      <button type="submit" className="btn btn-primary">Crear Docente</button>
    </form>
  );
}

export default CrearDocente;
