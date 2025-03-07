package com.example.demo.controller;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@CrossOrigin
@RestController
@RequestMapping("/imagen")
public class ImagenControlador {
	@Value("${app.upload.dir:${user.home}/uploads/imagenes}")
    private String uploadDir;

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("result", "fail");
            response.put("message", "Por favor seleccione un archivo para subir");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            // Crear directorio si no existe
            String uploadPath = uploadDir + File.separator + "perfiles";
            Path dirPath = Paths.get(uploadPath);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            // Generar nombre único para la imagen
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String newFilename = timestamp + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
            
            // Guardar el archivo
            Path targetLocation = Paths.get(uploadPath).resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation);

            // La ruta relativa que se guardará en la base de datos
            String dbPath = "/imagenes/perfiles/" + newFilename;

            // Respuesta de éxito
            response.put("result", "ok");
            response.put("message", "Archivo subido correctamente");
            response.put("filename", newFilename);
            response.put("ruta", dbPath);  // Esta es la ruta que guardaremos en la BD

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException ex) {
            response.put("result", "fail");
            response.put("message", "Error al subir archivo: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}