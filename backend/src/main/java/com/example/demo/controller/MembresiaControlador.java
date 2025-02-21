package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modelos.Membresia;
import com.example.demo.repositorios.MembresiaRepositorio;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/membresia")
public class MembresiaControlador {

    @Autowired
    MembresiaRepositorio memRep;

    @GetMapping("/obtener")
    public List<DTO> getMembresias() {
        List<DTO> list_dto = new ArrayList<DTO>();
        List<Membresia> list_membresias = memRep.findAll();

        for (Membresia m : list_membresias) {
            DTO dto_membresia = new DTO();
            dto_membresia.put("id", m.getId());
            dto_membresia.put("tipo", m.getTipo());
            dto_membresia.put("precio", m.getPrecio());
            dto_membresia.put("duracion_meses", m.getDuracionMeses());

            // Agregamos el DTO a la lista.
            list_dto.add(dto_membresia);
        }

        return list_dto;
    }

    @PostMapping(path = "/obtener1", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO getMembresia(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_membresia = new DTO();
        Membresia m = memRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (m != null) {
            dto_membresia.put("id", m.getId());
            dto_membresia.put("tipo", m.getTipo());
            dto_membresia.put("precio", m.getPrecio());
            dto_membresia.put("duracion_meses", m.getDuracionMeses());
        } else {
            dto_membresia.put("result", "fail");
        }

        return dto_membresia;
    }

    @DeleteMapping(path = "/borrar1", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DTO deleteMembresia(@RequestBody DTO soloId, HttpServletRequest request) {
        DTO dto_membresia = new DTO();
        Membresia m = memRep.findById(Integer.parseInt(soloId.get("id").toString()));

        if (m != null) {
            memRep.delete(m);
            dto_membresia.put("borrado", "OK");
        }
        else dto_membresia.put("borrado", "fail");

        return dto_membresia;
    }

    @PostMapping(path = "/addmembresia")
    public void addMembresia(@RequestBody DatosAltaMembresia dam, HttpServletRequest request) {
        Membresia m = new Membresia(dam.id, dam.tipo, dam.precio, dam.duracionMeses);
        memRep.save(m);
    }

    static class DatosAltaMembresia {
        int id;
        String tipo;
        float precio;
        int duracionMeses;

        public DatosAltaMembresia(int id, String tipo, float precio, int duracionMeses) {
            super();
            this.id = id;
            this.tipo = tipo;
            this.precio = precio;
            this.duracionMeses = duracionMeses;
        }
    }
}