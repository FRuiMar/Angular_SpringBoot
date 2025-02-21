package com.example.demo.repositorios;

import java.io.Serializable;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.modelos.ClaseEntreno;
import com.example.demo.modelos.Entrenador;

import jakarta.transaction.Transactional;

public interface EntrenadorRepositorio extends JpaRepository<Entrenador, Serializable> {
	
	@Bean
	public abstract List<Entrenador> findAll();
	public abstract Entrenador findById(int id);
	public abstract Entrenador findByDni(String dni);
	
	public abstract ClaseEntreno findByNombre(String nombre);
	
	@SuppressWarnings("unchecked")
	@Transactional 
	public abstract Entrenador save(Entrenador e);
	
	@Transactional 
	public abstract void delete(Entrenador e);
	@Transactional  
	public abstract void deleteById(int id);
	

}
