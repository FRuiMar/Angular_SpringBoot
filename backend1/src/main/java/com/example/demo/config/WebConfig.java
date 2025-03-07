package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtener ruta absoluta del directorio del proyecto
        String projectDir = System.getProperty("user.dir");
        String uploadPath = projectDir + File.separator + "uploads";
        
        // Crear directorio si no existe
        File directory = new File(uploadPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // La ruta debe terminar con una barra
        String fileUrl = "file:///" + directory.getAbsolutePath().replace("\\", "/") + "/";
        
        System.out.println("Configurando recursos estáticos:");
        System.out.println("- URL pattern: /uploads/**");
        System.out.println("- Directorio físico: " + fileUrl);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileUrl);
    }
}