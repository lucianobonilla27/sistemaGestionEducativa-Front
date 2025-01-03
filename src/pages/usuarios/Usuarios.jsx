import { useState } from "react";
import { useAlumnos } from "../../context/AlumnosContext";
import { useDocentes } from "../../context/DocentesContext";
import { useUser } from "../../context/UserContext";
import { useCursos } from "../../context/CursosContext";
import "./usuarios.css";

function Usuarios() {
  const { agregarAlumno, alumnos } = useAlumnos();
  const { agregarDocente, docentes } = useDocentes();
  const { usuarios, crearUsuario } = useUser();
  const { cursos } = useCursos();
  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
    role: "alumno",
    nombre: "",
    estado: "Activo",
    cursos: [],
  });

  const [showModal, setShowModal] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarCursoSeleccionado = (cursoId) => {
    setFormulario((prevFormulario) => {
      const cursosSeleccionados = prevFormulario.cursos.includes(cursoId)
        ? prevFormulario.cursos.filter((id) => id !== cursoId) // Desmarcar
        : [...prevFormulario.cursos, cursoId]; // Marcar

      return { ...prevFormulario, cursos: cursosSeleccionados };
    });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    const { email, password, role, nombre, estado, cursos } = formulario;
    console.log("Formulario enviado:", formulario);
  
    try {
      if (role === "alumno") {
        const alumnoData = { id: crypto.randomUUID(), nombre, estado, cursos };
        console.log("Enviando datos de alumno:", alumnoData);
        const alumno = await agregarAlumno(alumnoData);
  
        if (!alumno?.id) throw new Error("Alumno no creado correctamente");
  
        await crearUsuario({
          id: crypto.randomUUID(),
          email,
          password,
          role,
          personaId: alumno.id,
        });
      } else if (role === "docente") {
        const docenteData = { id: crypto.randomUUID(), nombre, estado, cursos };
        console.log("Enviando datos de docente:", docenteData);
        const docente = await agregarDocente(docenteData);
  
        if (!docente?.id) throw new Error("Docente no creado correctamente");
  
        await crearUsuario({
          id: crypto.randomUUID(),
          email,
          password,
          role,
          personaId: docente.id,
        });
      } else {
        await crearUsuario({
          id: crypto.randomUUID(),
          email,
          password,
          role,
          personaId: null,
        });
      }
  
      alert("Usuario registrado exitosamente");
      setShowModal(false);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  

  const obtenerNombreYEstado = (usuario) => {
    if (usuario.role === "alumno") {
      const alumno = alumnos.find((a) => a.id === usuario.personaId);
      return {
        nombre: alumno?.nombre || "N/A",
        estado: alumno?.estado || "N/A",
      };
    } else if (usuario.role === "docente") {
      const docente = docentes.find((d) => d.id === usuario.personaId);
      return {
        nombre: docente?.nombre || "N/A",
        estado: docente?.estado || "N/A",
      };
    }
    return { nombre: "N/A", estado: "N/A" };
  };

  return (
    <div className="usuarios-container">
      <h1 className="text-center my-4">Gestión de Usuarios</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Crear Usuario
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const { nombre, estado } = obtenerNombreYEstado(usuario);
              return (
                <tr key={usuario.id}>
                  <td>{usuario.email}</td>
                  <td>{usuario.role}</td>
                  <td>{nombre}</td>
                  <td>{estado}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={manejarRegistro}>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formulario.email}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formulario.password}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Rol</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formulario.role}
                      onChange={manejarCambio}
                    >
                      <option value="alumno">Alumno</option>
                      <option value="docente">Docente</option>
                      <option value="admin">Administrador</option>
                      <option value="finanzas">Finanzas</option>
                    </select>
                  </div>
                  {(formulario.role === "alumno" ||
                    formulario.role === "docente") && (
                    <>
                      <div className="mb-3">
                        <label>Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          value={formulario.nombre}
                          onChange={manejarCambio}
                        />
                      </div>
                      <div className="mb-3">
                        <label>Estado</label>
                        <select
                          className="form-select"
                          name="estado"
                          value={formulario.estado}
                          onChange={manejarCambio}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label>Cursos</label>
                        <div className="form-check">
                          {cursos.map((curso) => (
                            <div key={curso.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={curso.id}
                                checked={formulario.cursos.includes(curso.id)}
                                onChange={() => manejarCursoSeleccionado(curso.id)}
                                id={`curso-${curso.id}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`curso-${curso.id}`}
                              >
                                {curso.nombre}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Registrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
