package com.example.demo.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.modelos.Reserva;

import jakarta.transaction.Transactional;

@Repository
public interface ReservaRepositorio extends JpaRepository<Reserva, Integer> {

    // Método para buscar todas las reservas
	public abstract List<Reserva> findAll();
    // Método para buscar una reserva por su ID
	public abstract Reserva findById(int id);

    // Método para buscar reservas por el ID del usuario
	public abstract List<Reserva> findByUsuarioId(int usuarioId);

    // Método para buscar reservas por el ID de la clase de entrenamiento
	public abstract List<Reserva> findByClasesEntrenoId(int claseId);

	
    // Método para guardar o actualizar una reserva
    @SuppressWarnings("unchecked")
    @Transactional
    public abstract Reserva save(Reserva reserva);

    // Método para eliminar una reserva por su ID
    @Transactional
    public abstract void deleteById(int id);
}