package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.http.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modelos.ClaseEntreno;
import com.example.demo.modelos.Entrenador;
import com.example.demo.repositorios.ClaseEntrenoRepositorio;
import com.example.demo.repositorios.EntrenadorRepositorio;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/claseEntreno")
public class ClaseEntrenoControlador {

    @Autowired
    ClaseEntrenoRepositorio claseEntrenoRep;
	@Autowired
	EntrenadorRepositorio entrenadorRep;

    @GetMapping("/obtener")
    public List<DTO> getClasesEntreno() {
        List<DTO> list_dto = new ArrayList<DTO>();
        List<ClaseEntreno> list_clases = claseEntrenoRep.findAll();


        for (ClaseEntreno ce : list_clases) {
            DTO dto_clase = new DTO();
            dto_clase.put("id", ce.getId());
            dto_clase.put("nombre", ce.getNombre());
            dto_clase.put("horario", ce.getHorario().toString());
            dto_clase.put("capacidad_maxima", ce.getCapacidadMaxima());
            dto_clase.put("entrenador", ce.getEntrenadores().getNombre());
            dto_clase.put("imagen", ce.getImagen());

            // Agregamos el DTO a la lista.
            list_dto.add(dto_clase);
        }

        return list_dto;
    }

    @PostMapping(path = "/obtener1", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO getClaseEntreno(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_clase = new DTO();
        ClaseEntreno ce = claseEntrenoRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (ce != null) {
            dto_clase.put("id", ce.getId());
            dto_clase.put("nombre", ce.getNombre());
            dto_clase.put("horario", ce.getHorario().toString());
            dto_clase.put("capacidad_maxima", ce.getCapacidadMaxima());
            dto_clase.put("entrenador", ce.getEntrenadores().getNombre());
            dto_clase.put("imagen", ce.getImagen());
        } else {
            dto_clase.put("result", "fail");
        }

        return dto_clase;
    }

    @DeleteMapping(path = "/deleteClasePorId", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO deleteClaseEntreno(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_clase = new DTO();
        ClaseEntreno ce = claseEntrenoRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (ce != null) {
            claseEntrenoRep.delete(ce);
            dto_clase.put("borrado", "OK");
        }
        else dto_clase.put("borrado", "fail");

        return dto_clase;
    }

    
    @PostMapping(path = "/addclase", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO addClaseEntreno(@RequestBody DatosAltaClaseEntreno dace, HttpServletRequest request) {
        DTO responseDTO = new DTO(); // Crear un DTO para la respuesta

        try {
            // Verificar si el entrenador existe
            Entrenador entrenador = entrenadorRep.findById(dace.entrenadores);
            if (entrenador == null) {
                responseDTO.put("result", "fail");
                responseDTO.put("message", "El entrenador especificado no existe");
                return responseDTO;
            }

            // Crear y guardar la nueva clase de entrenamiento
            ClaseEntreno ce = new ClaseEntreno(dace.id, dace.nombre, dace.horario, dace.capacidadMaxima, entrenador, dace.imagen);
            claseEntrenoRep.save(ce);

            // Respuesta de éxito
            responseDTO.put("result", "ok");
            responseDTO.put("message", "Clase de entrenamiento creada correctamente");
        } catch (Exception e) {
            // Manejo de excepciones
            responseDTO.put("result", "fail");
            responseDTO.put("message", "Error al crear la clase de entrenamiento: " + e.getMessage());
        }

        return responseDTO;
    }

    
    @PutMapping(path = "/editarClasePorId", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO editarClasePorId(@RequestBody DatosAltaClaseEntreno dace, HttpServletRequest request) {
        DTO responseDTO = new DTO(); // Crear un DTO para la respuesta

        try {
            // Buscar la clase de entrenamiento por ID
            ClaseEntreno ce = claseEntrenoRep.findById(dace.id);

            if (ce != null) {
                // Verificar si el entrenador existe
                Entrenador entrenador = entrenadorRep.findById(dace.entrenadores);
                if (entrenador == null) {
                    responseDTO.put("result", "fail");
                    responseDTO.put("message", "El entrenador especificado no existe");
                    return responseDTO;
                }

                // Actualizar los campos de la clase de entrenamiento
                ce.setNombre(dace.nombre);
                ce.setHorario(dace.horario);
                ce.setCapacidadMaxima(dace.capacidadMaxima);
                ce.setEntrenadores(entrenador);
                ce.setImagen(dace.imagen);

                // Guardar los cambios en la base de datos
                claseEntrenoRep.save(ce);

                // Respuesta de éxito
                responseDTO.put("result", "ok");
                responseDTO.put("message", "Clase de entrenamiento actualizada correctamente");
            } else {
                responseDTO.put("result", "fail");
                responseDTO.put("message", "Clase de entrenamiento no encontrada");
            }
        } catch (Exception e) {
            // Manejo de excepciones
            responseDTO.put("result", "fail");
            responseDTO.put("message", "Error al actualizar la clase de entrenamiento: " + e.getMessage());
        }

        return responseDTO;
    }
    
    
    
    
    
    
    
    static class DatosAltaClaseEntreno {
        int id;
        String nombre;
        Date horario;
        int capacidadMaxima;
        int entrenadores;
        String imagen;

        public DatosAltaClaseEntreno(int id, String nombre, Date horario,
                                     int capacidadMaxima, int entrenadores, String imagen) {
            super();
            this.id = id;
            this.nombre = nombre;
            this.horario = horario;
            this.capacidadMaxima = capacidadMaxima;
            this.entrenadores = entrenadores;
            this.imagen = imagen;
        }
    }
}