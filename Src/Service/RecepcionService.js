import apiConexion from "./Conexion";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Obtener pacientes
export const obtenerPacientes = async () => {
  try {
    const response = await apiConexion.get("/pacientes");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return { success: false, data: [] };
  }
};

//listar especualidades
export const getEspecialidades = async () => {
    try {
        const response = await apiConexion.get("/especialidades");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error en getEspecialidades:", error.response?.data || error.message);
        return { success: false, message: "No se pudieron cargar las especialidades." };
    }
};

//agrefar medico
export const agregarMedico = async (medicoData) => {
    try {
        const response = await apiConexion.post("/AgregarDoctores", medicoData);
        if (response.status === 201) {
            return { success: true, message: "Médico agregado exitosamente." };
        }
        return { success: false, message: "No se pudo agregar al médico." };
    } catch (error) {
        console.error("Error en agregarMedico:", error.response?.data || error.message);
        const message = error.response?.data?.message || "Ocurrió un error en el servidor.";
        return { success: false, message };
    }
};

//obtener doctor por id
export const obtenerDoctorPorId = async (id) => {
    try {
        const response = await apiConexion.get(`/doctores/${id}`);
        if (response.status === 200) {
            return { success: true, data: response.data.data };
        }
        return { success: false, message: "No se pudo obtener la información del médico." };
    } catch (error) {
        console.error("Error en obtenerDoctorPorId:", error.response?.data || error.message);
        return { success: false, message: "Error al cargar los datos del médico." };
    }
};


// Obtener médico por ID
export const listarDoctorPorId = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.get(`/listardoctores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Error obtenerDoctorPorId:", error.response?.data || error.message);
    return { success: false, message: "Error al obtener el médico" };
  }
};

// Actualizar médico
export const actualizarMedico = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.put(`/doctores/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error actualizarMedico:", error.response?.data || error.message);
    return { success: false, message: "Error al actualizar el médico" };
  }
};

// Obtener especialidades
export const listarEspecialidades = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.get(`/listarespecialidades`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Error getEspecialidades:", error.response?.data || error.message);
    return { success: false, message: "Error al cargar especialidades" };
  }
};

//obtner doctores
export const obtenerDoctores = async () => {
  try {
    const response = await apiConexion.get("/doctores");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    return { success: false, data: [] };
  }
};

//buscar paciente por nombre
export const buscarPacientePorNombreOCedula = async (query) => {
  try {
    const response = await apiConexion.get(`/pacientes/buscar`, {
      params: { q: query },
    });
    console.log("🩺 Resultado búsqueda:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en buscarPacientePorNombreOCedula:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al buscar pacientes por nombre o cédula.",
    };
  }
};

//listar  docto
export const listardoc = async () => {
  try {
    const response = await apiConexion.get("/listardoc");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    return { success: false, data: [] };
  }
};

// Buscar paciente por cédula
export const buscarPacientePorDocumento = async (documento) => {
  try {
    const res = await apiConexion.get(`/pacientes/documento/${documento}`);
    return res.data; // retorna el JSON del backend
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // Error inesperado
    console.error("Error al buscar paciente:", error);
    return { success: false, message: "Error al conectar con el servidor." };
  }
};

//creer cita
export const crearCita = async (citaData) => {
  try {
    const response = await apiConexion.post("/citas", citaData);
    if (response.status === 201) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error en crearCita:", error.response?.data || error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Error al crear la cita" 
    };
  }
};

//obtner estaducsticas
export const obtenerEstadisticasRecepcion = async () => {
  try {
    const response = await apiConexion.get("/recepcion/estadisticas");
    console.log("📊 Estadísticas recibidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas:", error);
    return { success: false, message: "Error al obtener estadísticas" };
  }
};

//obtenner citas hoy
export const obtenerCitasHoy = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await apiConexion.get("/citas-hoy-recepcion", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data, 
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error al cargar las citas de hoy.",
      };
    }
  } catch (error) {
    console.error("❌ Error al obtener las citas de hoy:", error);
    return {
      success: false,
      message: "Error de conexión al cargar las citas.",
    };
  }
};

//editar perfil recepcion
export const updateRecepcionistaPerfil = async (userData) => {
    try {
        const response = await apiConexion.put('/me/recepcionista', userData);
        return { success: true, message: "Perfil actualizado correctamente. Los cambios se reflejarán la próxima vez que inicie sesión.", user: response.data };
    } catch (error) {
        console.error("Error en updateMedicoPerfil:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error al actualizar el perfil del médico";
        return { success: false, message: errorMessage };
    }
};

//eliminar cuenta recepcionista
export async function eliminarCuentaRecepcionista() {
    try {
        const token = await AsyncStorage.getItem("userToken");
        
        if (!token) {
            return { success: false, message: "No hay sesión activa." };
        }

        const response = await apiConexion.delete('/eliminarCuenta');

        if (response.data && response.data.success) {
            await AsyncStorage.multiRemove(["userToken", "rolUser", "userData"]);
            return { success: true, message: response.data.message };
        } else {
            return { success: false, message: response.data.message || "Error al eliminar la cuenta." };
        }
        
    } catch (error) {
        console.error("Error en el servicio de eliminación de cuenta del recepcionista:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error de red o servidor al eliminar.";
        return { success: false, message: errorMessage };
    }
}

//Cambiar contraseña
export const changePassword = async (current_password, new_password) => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await apiConexion.post('/recepcionista/change-password', {
            current_password,
            new_password,
            new_password_confirmation: new_password,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return {
            success: true,
            message: response.data.message || "Contraseña cambiada correctamente."
        };
    } catch (error) {
        console.error("Error en changePassword service:", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message || "Error al cambiar la contraseña. Verifica la contraseña actual.";
        return {
            success: false,
            message: errorMessage
        };
    }
};

//acctualiza estado cita
export const actualizarEstadoCita = async (id, estado) => {
  try {
    const response = await apiConexion.put(`/citas/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error("Error en actualizarEstadoCita:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actualizar el estado de la cita.",
    };
  }
};


//eliminnar doctor
export const eliminarDoctor = async (id) => {
  try {
    const response = await apiConexion.delete(`/doctores/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en eliminarDoctor:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al eliminar el doctor.",
    };
  }
};

// --- GESTIÓN DE CONSULTORIOS ---

// Obtener todos los consultorios
export const obtenerConsultorios = async () => {
  try {
    const response = await apiConexion.get("/listarConsultorios");
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error en obtenerConsultorios:", error.response?.data || error.message);
    return { success: false, message: "Error al cargar los consultorios." };
  }
};

// Obtener un consultorio por ID
export const obtenerConsultorioPorId = async (id) => {
    try {
        const response = await apiConexion.get(`/consultorioByID/${id}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        console.error("Error en obtenerConsultorioPorId:", error.response?.data || error.message);
        return { success: false, message: "Error al cargar el consultorio." };
    }
};

// Agregar un nuevo consultorio
export const agregarConsultorio = async (data) => {
    try {
        const response = await apiConexion.post("/CrearConsultorios", data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error en agregarConsultorio:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al agregar el consultorio." };
    }
};

// Actualizar un consultorio
export const actualizarConsultorio = async (id, data) => {
    try {
        const response = await apiConexion.put(`/EditarConsultorios/${id}`, data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error en actualizarConsultorio:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al actualizar el consultorio." };
    }
};

// Eliminar un consultorio
export const eliminarConsultorio = async (id) => {
    try {
        const response = await apiConexion.delete(`/EliminarConsultorio/${id}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        console.error("Error en eliminarConsultorio:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al eliminar el consultorio." };
    }
};

// --- GESTIÓN DE ESPECIALIDADES ---
export const obtenerEspecialidades = async () => {
  try {
    const response = await apiConexion.get("/listarespecialidades");
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error en obtenerEspecialidades:", error.response?.data || error.message);
    return { success: false, message: "Error al cargar las especialidades." };
  }
};

// Obtener una especialidad por ID
export const listarEspecialidadPorId = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.get(`/especialidades/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Error obtenerEspecialidadPorId:", error.response?.data || error.message);
    return { success: false, message: "Error al obtener la Especialidad" };
  }
};

// Agregar una nueva especialidad
export const agregarEspecialidad = async (data) => {
    try {
        const response = await apiConexion.post("/crearEspecialidades", data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error en agregarEspecialidad:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al agregar la especialidad." };
    }
};

// Actualizar una especialidad
export const actualizarEspecialidad = async (id, data) => {
    try {
        const response = await apiConexion.put(`/especialidades/${id}`, data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error en actualizarEspecialidad:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al actualizar la especialidad." };
    }
};

// Eliminar una especialidad
export const eliminarEspecialidad = async (id) => {
    try {
        const response = await apiConexion.delete(`/especialidades/${id}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        console.error("Error en eliminarEspecialidad:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al eliminar la especialidad." };
    }
};