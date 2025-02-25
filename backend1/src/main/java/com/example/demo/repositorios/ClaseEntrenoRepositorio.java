package com.example.demo.repositorios;

import java.io.Serializable;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.modelos.ClaseEntreno;


import jakarta.transaction.Transactional;


@Repository
public interface ClaseEntrenoRepositorio extends JpaRepository<ClaseEntreno, Serializable> {

	@Bean
	public abstract List<ClaseEntreno> findAll();
	public abstract ClaseEntreno findById(int id);
	
	public abstract ClaseEntreno findByNombre(String nombre);

	
	@SuppressWarnings("unchecked")
	@Transactional
	public abstract ClaseEntreno save(ClaseEntreno ce);
	
	@Transactional
	public abstract void delete(ClaseEntreno ce);
	@Transactional
	public abstract void deleteById(int id);
}
