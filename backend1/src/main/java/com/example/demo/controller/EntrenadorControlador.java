package com.example.demo.controller;

import java.util.ArrayList;
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

import com.example.demo.modelos.Entrenador;
import com.example.demo.repositorios.EntrenadorRepositorio;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/entrenador")
public class EntrenadorControlador {

    @Autowired
    EntrenadorRepositorio entrenadorRep;

    @GetMapping("/obtener")
    public List<DTO> getEntrenadores() {
        List<DTO> list_dto = new ArrayList<DTO>();
        List<Entrenador> list_entrenadores = entrenadorRep.findAll();

        for (Entrenador e : list_entrenadores) {
            DTO dto_entrenador = new DTO();
            dto_entrenador.put("id", e.getId());
            dto_entrenador.put("nombre", e.getNombre());
            dto_entrenador.put("apellido", e.getApellido());
            dto_entrenador.put("dni", e.getDni());
            dto_entrenador.put("especialidad", e.getEspecialidad());
            dto_entrenador.put("imagen", e.getImagen());

            // Agregamos el DTO a la lista.
            list_dto.add(dto_entrenador);
        }

        return list_dto;
    }

    @PostMapping(path = "/obtener1", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO getEntrenador(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_entrenador = new DTO();
        Entrenador e = entrenadorRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (e != null) {
            dto_entrenador.put("id", e.getId());
            dto_entrenador.put("nombre", e.getNombre());
            dto_entrenador.put("apellido", e.getApellido());
            dto_entrenador.put("dni", e.getDni());
            dto_entrenador.put("especialidad", e.getEspecialidad());
            dto_entrenador.put("imagen", e.getImagen());
        } else {
            dto_entrenador.put("result", "fail");
        }

        return dto_entrenador;
    }

    @PostMapping(path = "/addentrenador")
    public void addEntrenador(@RequestBody DatosAltaEntrenador dae, HttpServletRequest request) {
        Entrenador e = new Entrenador(dae.id, dae.dni, dae.nombre, 
                dae.apellido, dae.especialidad, dae.imagen);
        entrenadorRep.save(e);
    }

    @PutMapping(path = "/editEntrenadorPorDni", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO editEntrenadorPorDni(@RequestBody DatosAltaEntrenador dae, HttpServletRequest request) {
        DTO dto_entrenador = new DTO();
        
        // Buscar el entrenador por DNI
        Entrenador e = entrenadorRep.findByDni(dae.dni);
        
        if (e != null) {
            // Actualizar los campos del entrenador
            e.setNombre(dae.nombre);
            e.setApellido(dae.apellido);
            e.setEspecialidad(dae.especialidad);
            e.setImagen(dae.imagen);
            
            // Guardar los cambios en la base de datos
            entrenadorRep.save(e);
            dto_entrenador.put("result", "ok");
        } else {
            dto_entrenador.put("result", "fail");
            dto_entrenador.put("message", "Entrenador no encontrado");
        }
        
        return dto_entrenador;
    }
    
    
    @PutMapping(path = "/editEntrenadorPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO editEntrenadorPorId(@RequestBody DatosAltaEntrenador dae, HttpServletRequest request) {
        DTO dto_entrenador = new DTO();
        
        // Buscar el entrenador por ID
        Entrenador e = entrenadorRep.findById(dae.id);
        
        if (e != null) {
            // Actualizar los campos del entrenador
            e.setDni(dae.dni);
            e.setNombre(dae.nombre);
            e.setApellido(dae.apellido);
            e.setEspecialidad(dae.especialidad);
            e.setImagen(dae.imagen);

            
            // Guardar los cambios en la base de datos
            entrenadorRep.save(e);
            dto_entrenador.put("result", "ok");
        } else {
            dto_entrenador.put("result", "fail");
            dto_entrenador.put("message", "Entrenador no encontrado");
        }
        
        return dto_entrenador;
    }
    
    
    
    @DeleteMapping(path = "/borrarEntrenadorPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO deleteEntrenador(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_entrenador = new DTO();
        Entrenador e = entrenadorRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (e != null) {
            entrenadorRep.delete(e);
            dto_entrenador.put("Entrenador elmininado Correctamente", "OK");
        }
        else dto_entrenador.put("borrado", "fail");

        return dto_entrenador;
    }


    static class DatosAltaEntrenador {
        int id;
        String dni;
        String nombre;
        String apellido;
        String especialidad;
        String imagen;

        public DatosAltaEntrenador(int id, String dni, String nombre, 
                String apellido, String especialidad, String imagen) {
            super();
            this.id = id;
            this.dni = dni;
            this.nombre = nombre;
            this.apellido = apellido;
            this.especialidad = especialidad;
            this.imagen = imagen;
        }
    }
}