package com.example.demo.repositorios;

import java.io.Serializable;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.modelos.Usuario;

import jakarta.transaction.Transactional;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Serializable> {
	@Bean
	public abstract List<Usuario> findAll();
	public abstract Usuario findById(int id);
	
	public abstract Usuario findByDni(String dni);
	public abstract List<Usuario> findByNombre(String nombre);
	
	public abstract Usuario findByEmail(String email);
	
	@Transactional  
	public abstract void deleteById(int id);
	
	@SuppressWarnings("unchecked")
	@Transactional
	public abstract Usuario save(Usuario u);
	
	
}
