import React, { useEffect, useState } from "react";

function EditarDocente({ docente, onClose, updateDocente }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });

  useEffect(() => {
    if (docente) {
      setFormData({
        nombre: docente.nombre,
        email: docente.email,
      });
    }
  }, [docente]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDocente(docente.id_docente, formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre
        </label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

export default EditarDocente;
