package com.example.demo.repositorios;

import java.io.Serializable;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.modelos.Membresia;

import jakarta.transaction.Transactional;

public interface MembresiaRepositorio extends JpaRepository<Membresia, Serializable> {

	//@Bean
	public abstract List<Membresia> findAll();
	public abstract Membresia findById(int id);
	
	
	//revisar si la importación es la correcta si hay fallos
	@Transactional  
	public abstract void deleteById(int id);
	
	@Transactional 
	public abstract Membresia save(Membresia m);
	
}
