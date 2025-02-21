package com.example.demo.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.jwSecurity.AutenticadorJWT;
import com.example.demo.modelos.Membresia;
import com.example.demo.modelos.Rol;
import com.example.demo.modelos.Usuario;
import com.example.demo.repositorios.MembresiaRepositorio;
import com.example.demo.repositorios.UsuarioRepositorio;

import jakarta.servlet.http.Cookie;
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
	    
	    // Find the user by ID
	    Usuario usu = usuRep.findByDni(u.dni);
	    
	    if (usu != null) {
	    	usu.setNombre(u.nombre);
	    	usu.setApellido(u.apellido);
	    	usu.setEmail(u.email);
	        
	        if (u.pass != null && !u.pass.isEmpty()) {
	            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	            String hashedPassword = encoder.encode(u.pass);
	            usu.setContrasena(hashedPassword);
	        }

	        usu.setRol(u.rol);
	        
	        usu.setImagen(u.imagen);
	        
	        Membresia membresia = memRep.findById(u.membresia);
	        usu.setMembresia(membresia);
	        
	        usuRep.save(usu);
	        usuDTO.put("result", "ok");
	    } else {
	    	usuDTO.put("result", "fail");
	    	usuDTO.put("message", "User not found");
	    }
	    
	    return usuDTO;
	}
	
	
	
	
	@PutMapping(path = "/editUsuarioPorId", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO editUserById(@RequestBody DatosCreacionUsuario u, HttpServletRequest request) {
	    DTO usuDTO = new DTO();
	    
	    // Find the user by ID
	    Usuario usu = usuRep.findById(u.id);
	    
	    if (usu != null) {
	    	usu.setDni(u.dni);
	    	usu.setNombre(u.nombre);
	    	usu.setApellido(u.apellido);
	    	usu.setEmail(u.email);
	        
	        if (u.pass != null && !u.pass.isEmpty()) {
	            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	            String hashedPassword = encoder.encode(u.pass);
	            usu.setContrasena(hashedPassword);
	        }

	        usu.setRol(u.rol);
	        
	        usu.setImagen(u.imagen);
	        
	        Membresia membresia = memRep.findById(u.membresia);
	        usu.setMembresia(membresia);
	        
	        usuRep.save(usu);
	        usuDTO.put("result", "ok");
	    } else {
	    	usuDTO.put("result", "fail");
	    	usuDTO.put("message", "User not found");
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
	
	
	@PostMapping(path = "/addUsuario", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO addUsuario(@RequestBody DatosCreacionUsuario u, HttpServletRequest request) {
	    DTO responseDTO = new DTO(); // Crear un DTO para la respuesta

	    try {
	        // Verificar si el usuario ya existe (por ejemplo, por email o DNI)
	        Usuario usuarioExistente = usuRep.findByEmail(u.email);
	        if (usuarioExistente != null) {
	            responseDTO.put("result", "fail");
	            responseDTO.put("message", "El usuario con este email ya existe");
	            return responseDTO;
	        }

	        // Codificar la contraseña
	        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	        String hashedPassword = encoder.encode(u.pass);

	        // Asignar el rol (si no se proporciona, se asigna Rol.NORMAL por defecto)
	        Rol rol = u.rol != null ? Rol.valueOf(u.rol.toString()) : Rol.NORMAL;

	        // Obtener la membresia
	        Membresia membresia = memRep.findById(u.membresia);
	        if (membresia == null) {
	            responseDTO.put("result", "fail");
	            responseDTO.put("message", "La membresía especificada no existe");
	            return responseDTO;
	        }

	        // Crear y guardar el nuevo usuario
	        Usuario nuevoUsuario = new Usuario(u.id, u.dni, u.nombre, u.apellido, u.email, hashedPassword, rol, u.imagen, membresia);
	        usuRep.save(nuevoUsuario);

	        // Respuesta de éxito
	        responseDTO.put("result", "ok");
	        responseDTO.put("message", "Usuario creado correctamente");
	        responseDTO.put("id", nuevoUsuario.getId()); // Opcional: devolver el ID del nuevo usuario
	    } catch (Exception e) {
	        // Manejo de excepciones
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
	
	
	
	
	
	@PostMapping(path = "/authenticate", consumes = MediaType.APPLICATION_JSON_VALUE)
	public DTO autenticaUsuario(@RequestBody UserAuthenticationData input, HttpServletRequest request,
	        HttpServletResponse response) {
	    DTO dto = new DTO();
	    dto.put("result", "fail");

	    // Buscar el usuario por email (o DNI, si prefieres)
	    Usuario authenticatedUser = usuRep.findByEmail(input.email);
	    
	    if (authenticatedUser != null) {
	        // Usar BCrypt para verificar si las contraseñas coinciden
	        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	        if (encoder.matches(input.pass, authenticatedUser.getContrasena())) {
	            dto.put("result", "ok");
	            dto.put("jwt", AutenticadorJWT.codifyJWT(authenticatedUser));

	            // Crear la cookie con el JWT
	            Cookie c = new Cookie("jwt", AutenticadorJWT.codifyJWT(authenticatedUser));
	            c.setHttpOnly(true);  // La cookie solo es accesible desde el servidor
	            c.setSecure(false);   // Si estás en HTTPS, cambia a true
	            c.setPath("/");       // La cookie es válida para toda la aplicación
	            c.setMaxAge(-1);      // La cookie expira cuando se cierra el navegador
	            response.addCookie(c);
	        }
	    }

	    return dto;
	}
	
	
	
	@GetMapping(path = "/who")
	public DTO getAuthenticated(HttpServletRequest request) {
	    DTO userDTO = new DTO();
	    userDTO.put("result", "fail");

	    // Obtener las cookies de la solicitud
	    Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            // Buscar la cookie "jwt"
	            if (cookie.getName().equals("jwt")) {
	                // Extraer el ID del usuario desde el token JWT
	                int authUserId = AutenticadorJWT.getUserIdFromJWT(cookie.getValue());
	                if (authUserId != -1) {
	                    // Buscar al usuario en la base de datos
	                    Usuario u = usuRep.findById(authUserId);
	                    if (u != null) {
	                        // Devolver los datos del usuario
	                        userDTO.put("result", "ok");
	                        userDTO.put("id", u.getId());
	                        userDTO.put("dni", u.getDni());
	                        userDTO.put("nombre", u.getNombre());
	                        userDTO.put("apellido", u.getApellido());
	                        userDTO.put("email", u.getEmail());
	                        userDTO.put("rol", u.getRol());
	                        userDTO.put("imagen", u.getImagen());
	                        userDTO.put("membresia", u.getMembresia());
	                        return userDTO;
	                    }
	                }
	            }
	        }
	    }

	    // Si no se encuentra la cookie o el usuario, devolver "fail"
	    userDTO.put("result", "fail");
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
		Rol rol;
		String imagen;
		int membresia;


		public DatosCreacionUsuario(int id, String dni, String nombre, String apellido, String email, String pass,
				Rol rol, String imagen, int membresia) {
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

	}
		
}
