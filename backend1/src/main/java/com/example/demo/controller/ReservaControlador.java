package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modelos.ClaseEntreno;
import com.example.demo.modelos.Reserva;
import com.example.demo.modelos.Usuario;
import com.example.demo.repositorios.ClaseEntrenoRepositorio;
import com.example.demo.repositorios.ReservaRepositorio;
import com.example.demo.repositorios.UsuarioRepositorio;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/reserva")
public class ReservaControlador {

    @Autowired
    private ReservaRepositorio reservaRep;
    @Autowired
    private UsuarioRepositorio usuRep;
    @Autowired
    private ClaseEntrenoRepositorio claseRep;

    // Obtener todas las reservas
    @GetMapping("/obtener")
    public List<DTO> getReservas() {
        List<DTO> list_dto = new ArrayList<>();
        List<Reserva> list_reservas = reservaRep.findAll();

        for (Reserva r : list_reservas) {
            DTO dto_reserva = new DTO();
            dto_reserva.put("id", r.getId());
            dto_reserva.put("fechaReserva", r.getFechaReserva());
            dto_reserva.put("usuarioId", r.getUsuario().getId());
            dto_reserva.put("claseId", r.getClasesEntreno().getId());
            list_dto.add(dto_reserva);
        }

        return list_dto;
    }

    // Obtener una reserva por su ID
    @PostMapping(path = "/obtenerPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO getReservaPorId(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_reserva = new DTO();
        Reserva r = reservaRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (r != null) {
            dto_reserva.put("id", r.getId());
            dto_reserva.put("fechaReserva", r.getFechaReserva());
            dto_reserva.put("usuarioId", r.getUsuario().getId());
            dto_reserva.put("claseId", r.getClasesEntreno().getId());
        } else {
            dto_reserva.put("result", "fail");
        }

        return dto_reserva;
    }

    // Obtener reservas por ID de usuario
    @PostMapping(path = "/obtenerPorUsuario", consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<DTO> getReservasPorUsuario(@RequestBody DTO usuarioId, HttpServletRequest request) {
        List<DTO> list_dto = new ArrayList<>();
        List<Reserva> list_reservas = reservaRep.findByUsuarioId(Integer.parseInt(usuarioId.get("usuarioId").toString()));

        for (Reserva r : list_reservas) {
            DTO dto_reserva = new DTO();
            dto_reserva.put("id", r.getId());
            dto_reserva.put("fechaReserva", r.getFechaReserva());
            dto_reserva.put("usuarioId", r.getUsuario().getId());
            dto_reserva.put("claseId", r.getClasesEntreno().getId());
            list_dto.add(dto_reserva);
        }

        return list_dto;
    }

    // Obtener reservas por ID de clase de entrenamiento
    @PostMapping(path = "/obtenerPorClase", consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<DTO> getReservasPorClase(@RequestBody DTO claseId, HttpServletRequest request) {
        List<DTO> list_dto = new ArrayList<>();
        List<Reserva> list_reservas = reservaRep.findByClasesEntrenoId(Integer.parseInt(claseId.get("claseId").toString()));

        for (Reserva r : list_reservas) {
            DTO dto_reserva = new DTO();
            dto_reserva.put("id", r.getId());
            dto_reserva.put("fechaReserva", r.getFechaReserva());
            dto_reserva.put("usuarioId", r.getUsuario().getId());
            dto_reserva.put("claseId", r.getClasesEntreno().getId());
            list_dto.add(dto_reserva);
        }

        return list_dto;
    }

    
    @PostMapping(path = "/obtenerReservasPorDniCliente", consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<DTO> obtenerClasesReservadasPorDni(@RequestBody DTO solicitudDni, HttpServletRequest request) {
        List<DTO> list_dto = new ArrayList<>();

        // Verificar si el DNI está presente en la solicitud
        if (solicitudDni == null || solicitudDni.get("dni") == null) {
            DTO errorDTO = new DTO();
            errorDTO.put("result", "fail");
            errorDTO.put("message", "El campo 'dni' es requerido");
            list_dto.add(errorDTO);
            return list_dto;
        }

        try {
            // Obtener el DNI del cuerpo de la solicitud
            String dni = solicitudDni.get("dni").toString();

            // Buscar el usuario por DNI
            Usuario usuario = usuRep.findByDni(dni);

            if (usuario == null) {
                DTO errorDTO = new DTO();
                errorDTO.put("result", "fail");
                errorDTO.put("message", "Usuario no encontrado");
                list_dto.add(errorDTO);
                return list_dto;
            }

            // Obtener las reservas del usuario
            List<Reserva> reservas = reservaRep.findByUsuarioId(usuario.getId());

            // Construir la lista de clases reservadas
            for (Reserva r : reservas) {
                DTO dto_clase = new DTO();
                dto_clase.put("idClase", r.getClasesEntreno().getId());
                dto_clase.put("nombreClase", r.getClasesEntreno().getNombre());
                dto_clase.put("horario", r.getClasesEntreno().getHorario().toString());
                dto_clase.put("capacidadMaxima", r.getClasesEntreno().getCapacidadMaxima());
                dto_clase.put("entrenador", r.getClasesEntreno().getEntrenadores().getNombre());
                dto_clase.put("imagen", r.getClasesEntreno().getImagen());
                list_dto.add(dto_clase);
            }
        } catch (Exception e) {
            // Manejar cualquier excepción
            DTO errorDTO = new DTO();
            errorDTO.put("result", "fail");
            errorDTO.put("message", "Error al obtener las clases reservadas: " + e.getMessage());
            list_dto.add(errorDTO);
        }

        return list_dto;
    }
    
    
    @PostMapping(path = "/addReserva", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO addReserva(@RequestBody DatosCreacionReserva dcr, HttpServletRequest request) {
        DTO responseDTO = new DTO();

        try {
            Reserva r = new Reserva();
            r.setFechaReserva(dcr.fechaReserva);

            // Buscar el usuario por ID
            Usuario usuario = usuRep.findById(dcr.usuarioId);
            if (usuario == null) {
                responseDTO.put("result", "fail");
                responseDTO.put("message", "Usuario no encontrado");
                return responseDTO;
            }
            r.setUsuario(usuario);

            // Buscar la clase por ID
            ClaseEntreno clase = claseRep.findById(dcr.claseEntrenoId);
            if (clase == null) {
                responseDTO.put("result", "fail");
                responseDTO.put("message", "Clase no encontrada");
                return responseDTO;
            }
            r.setClasesEntreno(clase);

            // Guardar la reserva
            reservaRep.save(r);

            responseDTO.put("result", "ok");
            responseDTO.put("message", "Reserva creada correctamente");
        } catch (Exception e) {
            responseDTO.put("result", "fail");
            responseDTO.put("message", "Error al crear la reserva: " + e.getMessage());
        }

        return responseDTO;
    }

    @PutMapping(path = "/editarReserva", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO editarReserva(@RequestBody DatosCreacionReserva dcr, HttpServletRequest request) {
        DTO responseDTO = new DTO();

        try {
            // Buscar la reserva existente por su ID
            Reserva reserva = reservaRep.findById(dcr.id);
            if (reserva == null) {
                responseDTO.put("result", "fail");
                responseDTO.put("message", "Reserva no encontrada");
                return responseDTO;
            }

            // Actualizar los campos si se proporcionan
            if (dcr.fechaReserva != null) {
                reserva.setFechaReserva(dcr.fechaReserva);
            }
            if (dcr.usuarioId > 0) {
                Usuario usuario = usuRep.findById(dcr.usuarioId);
                if (usuario == null) {
                    responseDTO.put("result", "fail");
                    responseDTO.put("message", "Usuario no encontrado");
                    return responseDTO;
                }
                reserva.setUsuario(usuario);
            }
            if (dcr.claseEntrenoId > 0) {
                ClaseEntreno clase = claseRep.findById(dcr.claseEntrenoId);
                if (clase == null) {
                    responseDTO.put("result", "fail");
                    responseDTO.put("message", "Clase no encontrada");
                    return responseDTO;
                }
                reserva.setClasesEntreno(clase);
            }

            // Guardar la reserva actualizada
            reservaRep.save(reserva);

            responseDTO.put("result", "ok");
            responseDTO.put("message", "Reserva actualizada correctamente");
        } catch (Exception e) {
            responseDTO.put("result", "fail");
            responseDTO.put("message", "Error al actualizar la reserva: " + e.getMessage());
        }

        return responseDTO;
    }
    
    
    // Eliminar una reserva por su ID
    @DeleteMapping(path = "/deleteReservaPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO deleteReserva(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO responseDTO = new DTO();
        Reserva r = reservaRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (r != null) {
            reservaRep.delete(r);
            responseDTO.put("result", "ok");
            responseDTO.put("message", "Reserva eliminada correctamente");
        } else {
            responseDTO.put("result", "fail");
            responseDTO.put("message", "Reserva no encontrada");
        }

        return responseDTO;
    }

    // Clase interna para los datos de creación de reserva
    static class DatosCreacionReserva {
    	int id;
        Date fechaReserva;
        int usuarioId;
        int claseEntrenoId; 

        public DatosCreacionReserva(int id, Date fechaReserva, int usuarioId, int claseEntrenoId) {
        	this.id = id;
        	this.fechaReserva = fechaReserva;
            this.usuarioId = usuarioId;
            this.claseEntrenoId = claseEntrenoId;
        }
    }
}