package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.example.demo.jwSecurity.AutenticadorJWT;
import com.example.demo.modelos.Membresia;
import com.example.demo.modelos.Rol;
import com.example.demo.modelos.Usuario;
import com.example.demo.repositorios.MembresiaRepositorio;
import com.example.demo.repositorios.UsuarioRepositorio;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
@RequestMapping("/usuario")
public class UsuarioControlador {

	@Autowired
	UsuarioRepositorio usuRep;
	@Autowired
	MembresiaRepositorio memRep;

	
	
	//private final String uploadDir = "src/main/resources/static/uploads";
	private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
	
	

	@GetMapping("/obtener")
	public List<DTO> getUsuarios() {
		List<DTO> userList_DTO = new ArrayList<>();
		List<Usuario> list_usu = usuRep.findAll();
		for (Usuario u : list_usu) {
			DTO usuDTO = new DTO();
			usuDTO.put("id", u.getId());
			usuDTO.put("dni", u.getDni());
			usuDTO.put("nombre", u.getNombre());
			usuDTO.put("apellido", u.getApellido());
			usuDTO.put("email", u.getEmail());
			usuDTO.put("contraseña", u.getContrasena());
			usuDTO.put("rol", u.getRol());
			usuDTO.put("imagen", u.getImagen());
			usuDTO.put("membresia", u.getMembresia().getTipo());
			userList_DTO.add(usuDTO);
		}

		return userList_DTO;
	}

	@PostMapping(path = "/obtenerPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO getUser(@RequestBody DTO soloid, HttpServletRequest request) {
		DTO usuDTO = new DTO();
		Usuario u = usuRep.findById(Integer.parseInt(soloid.get("id").toString()));
		if (u != null) {
			usuDTO.put("id", u.getId());
			usuDTO.put("dni", u.getDni());
			usuDTO.put("nombre", u.getNombre());
			usuDTO.put("apellido", u.getApellido());
			usuDTO.put("email", u.getEmail());
			usuDTO.put("contraseña", u.getContrasena());
			usuDTO.put("rol", u.getRol());
			usuDTO.put("imagen", u.getImagen());
			usuDTO.put("membresia", u.getMembresia().getTipo());

		} else {
			usuDTO.put("result", "fail");
		}
		return usuDTO;
	}

	@PostMapping(path = "/obtenerPorDni", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO getUserByDni(@RequestBody DTO solicitud, HttpServletRequest request) {
		DTO usuDTO = new DTO();
		Usuario u = usuRep.findByDni(solicitud.get("dni").toString()); // Llama al método findByDni

		if (u != null) {
			usuDTO.put("id", u.getId());
			usuDTO.put("dni", u.getDni());
			usuDTO.put("nombre", u.getNombre());
			usuDTO.put("apellido", u.getApellido());
			usuDTO.put("email", u.getEmail());
			usuDTO.put("contraseña", u.getContrasena());
			usuDTO.put("rol", u.getRol());
			usuDTO.put("imagen", u.getImagen());
			usuDTO.put("membresia", u.getMembresia().getTipo());
		} else {
			usuDTO.put("result", "fail");
		}
		return usuDTO;
	}

	@PostMapping(path = "/obtenerPorNombre", consumes = MediaType.APPLICATION_JSON_VALUE)
	public List<DTO> getUsersByNombre(@RequestBody DTO solicitud, HttpServletRequest request) {
		List<DTO> listDTO = new ArrayList<>();
		List<Usuario> usuarios = usuRep.findByNombre(solicitud.get("nombre").toString());

		if (!usuarios.isEmpty()) {
			for (Usuario u : usuarios) {
				DTO usuDTO = new DTO();
				usuDTO.put("id", u.getId());
				usuDTO.put("dni", u.getDni());
				usuDTO.put("nombre", u.getNombre());
				usuDTO.put("apellido", u.getApellido());
				usuDTO.put("email", u.getEmail());
				usuDTO.put("contraseña", u.getContrasena());
				usuDTO.put("rol", u.getRol());
				usuDTO.put("imagen", u.getImagen());
				usuDTO.put("membresia", u.getMembresia().getTipo());
				listDTO.add(usuDTO); // Agrega cada usuario a la lista
			}
		} else {
			DTO errorDTO = new DTO();
			errorDTO.put("result", "fail");
			listDTO.add(errorDTO); // Devuelve un mensaje de error si no hay resultados
		}

		return listDTO;
	}

	@PostMapping(path = "/obtenerPorEmail", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO getUserByEmail(@RequestBody DTO solicitud, HttpServletRequest request) {
		DTO usuDTO = new DTO();
		Usuario u = usuRep.findByEmail(solicitud.get("email").toString()); // Llama al método findByEmail

		if (u != null) {
			usuDTO.put("id", u.getId());
			usuDTO.put("dni", u.getDni());
			usuDTO.put("nombre", u.getNombre());
			usuDTO.put("apellido", u.getApellido());
			usuDTO.put("email", u.getEmail());
			usuDTO.put("contraseña", u.getContrasena());
			usuDTO.put("rol", u.getRol());
			usuDTO.put("imagen", u.getImagen());
			usuDTO.put("membresia", u.getMembresia().getTipo());
		} else {
			usuDTO.put("result", "fail");
		}
		return usuDTO;
	}

	@PutMapping(path = "/editUsuarioPorDni", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO editUserByDni(@RequestBody DatosCreacionUsuario u, HttpServletRequest request) {
		DTO usuDTO = new DTO();

		// Buscar el usuario por DNI
		Usuario usu = usuRep.findByDni(u.dni);

		if (usu != null) {
			// Actualizar los campos básicos
			usu.setNombre(u.nombre);
			usu.setApellido(u.apellido);
			usu.setEmail(u.email);

			// Actualizar la contraseña si se proporciona
			if (u.pass != null && !u.pass.isEmpty()) {
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				String hashedPassword = encoder.encode(u.pass);
				usu.setContrasena(hashedPassword);
			}

			// Asignar el rol (si no se proporciona, se asigna Rol.NORMAL por defecto)
	        Rol rol;
	        if (u.rol != null) {
	            try {
	                rol = Rol.valueOf(u.rol.toUpperCase()); // Convertir a mayúsculas para coincidir con el enum
	                System.out.println("Rol convertido correctamente: " + rol);
	            } catch (IllegalArgumentException e) {
	            	System.out.println("Error al convertir el rol. Asignando NORMAL.");
	                // Si el rol no es válido, asignar un valor por defecto
	                rol = Rol.NORMAL;
	            }
	        } else {
	            // Si el rol es null, asignar un valor por defecto
	            rol = Rol.NORMAL;
	        }

			// Actualizar la imagen
			usu.setImagen(u.imagen);

			// Actualizar la membresía
			Membresia membresia = memRep.findById(u.membresia);
			if (membresia != null) {
				usu.setMembresia(membresia);
			} else {
				usuDTO.put("result", "fail");
				usuDTO.put("message", "Membresía no encontrada");
				return usuDTO;
			}

			// Guardar el usuario actualizado
			usuRep.save(usu);
			usuDTO.put("result", "ok");
		} else {
			usuDTO.put("result", "fail");
			usuDTO.put("message", "Usuario no encontrado");
		}

		return usuDTO;
	}

	@PutMapping(path = "/editUsuarioPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO editUserById(@RequestBody DatosCreacionUsuario u, HttpServletRequest request) {
	    DTO usuDTO = new DTO();

	    System.out.println("Petición recibida para editar usuario con ID: " + u.id);
	    
	    // Find the user by ID
	    Usuario usu = usuRep.findById(u.id);

	    if (usu != null) {
	        System.out.println("Usuario encontrado: " + usu.getNombre() + " (ID: " + usu.getId() + ")");
	        
	        usu.setDni(u.dni);
	        usu.setNombre(u.nombre);
	        usu.setApellido(u.apellido);
	        usu.setEmail(u.email);

	        // Update password if provided
	        if (u.pass != null && !u.pass.isEmpty()) {
	            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	            String hashedPassword = encoder.encode(u.pass);
	            usu.setContrasena(hashedPassword);
	            System.out.println("Contraseña actualizada");
	        }

	        // Asignar el rol (si no se proporciona, se asigna Rol.NORMAL por defecto)
	        Rol rol;
	        if (u.rol != null) {
	            try {
	                System.out.println("Valor recibido para rol: " + u.rol);
	                rol = Rol.valueOf(u.rol.toUpperCase()); // Convertir a mayúsculas para coincidir con el enum
	                System.out.println("Rol convertido correctamente: " + rol);
	            } catch (IllegalArgumentException e) {
	                System.out.println("Error al convertir el rol. Asignando NORMAL.");
	                rol = Rol.NORMAL;
	            }
	        } else {
	            System.out.println("Rol no proporcionado. Asignando NORMAL.");
	            rol = Rol.NORMAL;
	        }
	        
	        System.out.println("Rol antes de asignar: " + usu.getRol());
	        usu.setRol(rol);
	        System.out.println("Rol después de asignar: " + usu.getRol());
	        
	        // Update imagen
	        usu.setImagen(u.imagen);
	        System.out.println("Imagen actualizada: " + (u.imagen != null ? "Sí" : "No"));

	        // Update membresia
	        Membresia membresia = memRep.findById(u.membresia);
	        if (membresia != null) {
	            usu.setMembresia(membresia);
	            System.out.println("Membresía actualizada: " + membresia.getTipo());
	        } else {
	            System.out.println("Membresía no encontrada");
	            usuDTO.put("result", "fail");
	            usuDTO.put("message", "Membresía no encontrada");
	            return usuDTO;
	        }

	        System.out.println("Rol actualizado antes de guardar: " + usu.getRol());

	        // Save the updated user
	        usuRep.save(usu);
	        System.out.println("Usuario guardado correctamente en la base de datos");
	        
	        // Verificar si se guardó correctamente
	        Usuario usuarioVerificado = usuRep.findById(u.id);
	        System.out.println("Rol después de guardar: " + usuarioVerificado.getRol());
	        
	        usuDTO.put("result", "ok");
	    } else {
	        System.out.println("Usuario no encontrado con ID: " + u.id);
	        usuDTO.put("result", "fail");
	        usuDTO.put("message", "Usuario no encontrado");
	    }

	    return usuDTO;
	}


//	@PostMapping(path = "/addUsuario", consumes = MediaType.APPLICATION_JSON_VALUE)
//	public void addUsuario(@RequestBody DatosCreacionUsuario u, HttpServletRequest request) {
//	    
//	    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//	    String hashedPassword = encoder.encode(u.pass);
//	    
//	    Rol rol = u.rol != null ? Rol.valueOf(u.rol.toString()) : Rol.NORMAL;
//	    
//	    Membresia membresia = memRep.findById(u.membresia);
//
//	    usuRep.save(new Usuario(u.id, u.dni, u.nombre, u.apellido, u.email, hashedPassword, rol, u.imagen, membresia));
//
//	}


	
	@PostMapping(path = "/addUsuario", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public DTO addUsuarioConImagen(
	        @RequestPart("datos") DatosCreacionUsuario datos,
	        @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
	    
	    DTO responseDTO = new DTO();
	    
	    try {
	        // Verificar si el usuario ya existe
	        Usuario usuarioExistente = usuRep.findByDni(datos.dni);
	        if (usuarioExistente != null) {
	            responseDTO.put("result", "fail");
	            responseDTO.put("message", "El usuario con este DNI ya existe");
	            return responseDTO;
	        }
	        
	        // Procesar la imagen si existe
	        String rutaImagen = "";
	        File destFile = null; // Declarar la variable aquí para que esté disponible en todo el método
	        
	        if (imagen != null && !imagen.isEmpty()) {
	            try {
	                // Crear directorio si no existe
	                File uploadPath = new File(uploadDir);
	                if (!uploadPath.exists()) {
	                    uploadPath.mkdirs();
	                }
	                
	                // Generar nombre único para el archivo
	                String originalFilename = imagen.getOriginalFilename();
	                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
	                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
	                String newFilename = timestamp + "_" + datos.dni + fileExtension;
	                
	                // Ruta completa del archivo
	                destFile = new File(uploadPath, newFilename); // Asignar aquí
	                
	                // Transferir archivo
	                imagen.transferTo(destFile);
	                
	                // La ruta que se guardará en la BD
	                rutaImagen = "/uploads/" + newFilename;
	            } catch (IOException e) {
	                e.printStackTrace();
	                responseDTO.put("result", "fail");
	                responseDTO.put("message", "Error al procesar la imagen: " + e.getMessage());
	                return responseDTO;
	            }
	        }
	        
	        // Resto del código igual que tenías...
	        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	        String hashedPassword = encoder.encode(datos.pass);
	        
	        Rol rol;
	        if (datos.rol != null) {
	            try {
	                rol = Rol.valueOf(datos.rol.toUpperCase());
	            } catch (IllegalArgumentException e) {
	                rol = Rol.NORMAL;
	            }
	        } else {
	            rol = Rol.NORMAL;
	        }
	        
	        Membresia membresia = memRep.findById(datos.membresia);
	        if (membresia == null) {
	            responseDTO.put("result", "fail");
	            responseDTO.put("message", "La membresía especificada no existe");
	            return responseDTO;
	        }
	        
	        // Usar la ruta de imagen procesada
	        Usuario nuevoUsuario = new Usuario(datos.id, datos.dni, datos.nombre, datos.apellido, 
	                                       datos.email, hashedPassword, rol, rutaImagen, membresia);
	        usuRep.save(nuevoUsuario);
	        
	        System.out.println("=== INFORMACIÓN DE SUBIDA DE ARCHIVOS ===");
	        System.out.println("Directorio de uploads: " + uploadDir);
	        
	        // Solo imprimir la ruta del archivo si realmente se subió una imagen
	        if (destFile != null) {
	            System.out.println("Archivo guardado en: " + destFile.getAbsolutePath());
	        } else {
	            System.out.println("No se subió ninguna imagen");
	        }
	        
	        System.out.println("URL para acceder: http://localhost:8080" + rutaImagen);
	        System.out.println("=======================================");
	        
	        responseDTO.put("result", "ok");
	        responseDTO.put("message", "Usuario creado correctamente");
	        responseDTO.put("id", nuevoUsuario.getId());
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        responseDTO.put("result", "fail");
	        responseDTO.put("message", "Error al crear el usuario: " + e.getMessage());
	    }
	    
	    return responseDTO;
	}
	
	
	
	@DeleteMapping(path = "/deleteUsuarioPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO deleteUser(@RequestBody DTO soloid, HttpServletRequest request) {
		DTO userDTO = new DTO();
		Usuario u = usuRep.findById(Integer.parseInt(soloid.get("id").toString()));

		if (u != null) {
			usuRep.delete(u); // Elimina el usuario de la base de datos
			userDTO.put("result", "ok");
			userDTO.put("message", "Usuario eliminado correctamente");
		} else {
			userDTO.put("result", "fail");
			userDTO.put("message", "Usuario no encontrado");
		}

		return userDTO;
	}

	@PostMapping(path = "/auth", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO autenticaUsuario(@RequestBody UserAuthenticationData input, HttpServletRequest request,
			HttpServletResponse response) {
		DTO dto = new DTO();
		
		// Buscar el usuario por email (o DNI, o lo que decida al final)
		Usuario authenticatedUser = usuRep.findByEmail(input.email);

		if (authenticatedUser != null) {
			// Usar BCrypt para verificar si las contraseñas coinciden
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			if (encoder.matches(input.pass, authenticatedUser.getContrasena())) {
				
				//aquí gener el token JWT
				String token = AutenticadorJWT.codifyJWT(authenticatedUser);
				
				dto.put("result", "ok");
				dto.put("jwt", token);

				// Crear la cookie con el JWT  //si uso las cabeceras esto creo que no hace falta.
//				Cookie c = new Cookie("jwt", token);
//				c.setHttpOnly(true); // La cookie solo es accesible desde el servidor
//				c.setSecure(false); // Si estás en HTTPS, cambia a true
//				c.setPath("/"); // La cookie es válida para toda la aplicación
//				c.setMaxAge(-1); // La cookie expira cuando se cierra el navegador
//				response.addCookie(c);
			} else {
				 // Si la contraseña no es correcta, devolver un DTO con resultado "fail".
	            dto.put("result", "fail");
	            dto.put("msg", "Contraseña incorrecta");
			}
		} else {
	        // Si no se encuentra el usuario, devolver un DTO con resultado "fail".
	        dto.put("result", "fail");
	        dto.put("msg", "Usuario no encontrado");
		}
		return dto;
	}

//	@GetMapping(path = "/who") //este sería para cookies.. pero voy a usar cabeceras.
//	public DTO getAuthenticated(HttpServletRequest request) {
//		DTO userDTO = new DTO();
//		userDTO.put("result", "fail");
//
//		// Obtener las cookies de la solicitud
//		Cookie[] cookies = request.getCookies();
//		if (cookies != null) {
//			for (Cookie cookie : cookies) {
//				// Buscar la cookie "jwt"
//				if (cookie.getName().equals("jwt")) {
//					// Extraer el ID del usuario desde el token JWT
//					int authUserId = AutenticadorJWT.getUserIdFromJWT(cookie.getValue());
//					if (authUserId != -1) {
//						// Buscar al usuario en la base de datos
//						Usuario u = usuRep.findById(authUserId);
//						if (u != null) {
//							// Devolver los datos del usuario
//							userDTO.put("result", "ok");
//							userDTO.put("id", u.getId());
//							userDTO.put("dni", u.getDni());
//							userDTO.put("nombre", u.getNombre());
//							userDTO.put("apellido", u.getApellido());
//							userDTO.put("email", u.getEmail());
//							userDTO.put("rol", u.getRol());
//							userDTO.put("imagen", u.getImagen());
//							userDTO.put("membresia", u.getMembresia());
//							return userDTO;
//						}
//					}
//				}
//			}
//		}
//
//		// Si no se encuentra la cookie o el usuario, devolver "fail"
//		userDTO.put("result", "fail");
//		return userDTO;
//	}

	
	@GetMapping(path = "/who") //este sería para cookies.. pero voy a usar cabeceras.
	public DTO getAuthenticated(HttpServletRequest request) {
		DTO userDTO = new DTO();
		userDTO.put("result", "fail");

		
		 // Obtener el token desde el header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        	userDTO.put("msg", "No se ha enviado el token JWT en el header");
            return userDTO;
        }

        // Extraer el token eliminando "Bearer "
        String token = authHeader.substring(7);
        
        
     // Obtener el ID del usuario desde el token
        int authUsuario = AutenticadorJWT.getUserIdFromJWT(token);
        if (authUsuario == -1) {
        	userDTO.put("msg", "Token inválido o usuario no autenticado");
            return userDTO;
        }
        
     // Buscar el usuario en la base de datos
        Usuario u = usuRep.findById(authUsuario);
        if (u != null) {
        	userDTO.put("id", u.getId());
        	userDTO.put("nombre", u.getNombre());
        	userDTO.put("apellido", u.getApellido());
        	userDTO.put("dni", u.getDni());
        	userDTO.put("email", u.getEmail());
        	//userDTO.put("fecha_nacimiento", u.getFechaNacimiento().toString());
        	userDTO.put("rol", u.getRol());
        	userDTO.put("imagen", u.getImagen());
			userDTO.put("membresia", u.getMembresia().getTipo());
			
			
        	userDTO.put("result", "ok");
        	userDTO.put("msg", "Usuario autenticado");
        	
        } else {
        	
        	userDTO.put("msg", "Usuario no encontrado");
        }
        
		return userDTO;
	}
	
	
	static class UserAuthenticationData {
		String email;
		String pass;

		public UserAuthenticationData(String email, String pass) {
			this.email = email;
			this.pass = pass;
		}
	}

	static class DatosCreacionUsuario {

		int id;
		String dni;
		String nombre;
		String apellido;
		String email;
		String pass;
		String rol;
		String imagen;
		int membresia;

	    // Constructor sin argumentos necesario para deserialización 
	    public DatosCreacionUsuario() {
	    }
	    
		public DatosCreacionUsuario(int id, String dni, String nombre, String apellido, String email, String pass,
				String Rol, String imagen, int membresia, String rol) {
			super();
			this.id = id;
			this.dni = dni;
			this.nombre = nombre;
			this.apellido = apellido;
			this.email = email;
			this.pass = pass;
			this.rol = rol;
			this.imagen = imagen;
			this.membresia = membresia;
		}
		
		// Getters y setters necesarios para deserialización
	    public int getId() { return id; }
	    public void setId(int id) { this.id = id; }
	    
	    public String getDni() { return dni; }
	    public void setDni(String dni) { this.dni = dni; }
	    
	    public String getNombre() { return nombre; }
	    public void setNombre(String nombre) { this.nombre = nombre; }
	    
	    public String getApellido() { return apellido; }
	    public void setApellido(String apellido) { this.apellido = apellido; }
	    
	    public String getEmail() { return email; }
	    public void setEmail(String email) { this.email = email; }
	    
	    public String getPass() { return pass; }
	    public void setPass(String pass) { this.pass = pass; }
	    
	    public String getRol() { return rol; }
	    public void setRol(String rol) { this.rol = rol; }
	    
	    public String getImagen() { return imagen; }
	    public void setImagen(String imagen) { this.imagen = imagen; }
	    
	    public int getMembresia() { return membresia; }
	    public void setMembresia(int membresia) { this.membresia = membresia; }

	}

}
