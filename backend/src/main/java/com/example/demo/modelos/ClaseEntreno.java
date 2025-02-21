package com.example.demo.modelos;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the clases database table.
 * 
 */
@Entity
@Table(name="clases")
@NamedQuery(name="ClaseEntreno.findAll", query="SELECT c FROM ClaseEntreno c")
public class ClaseEntreno implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;
	@Column(name="capacidad_maxima")
	private int capacidadMaxima;
	@Temporal(TemporalType.TIMESTAMP) //porque uso tb la hora.
	private Date horario;
	private String imagen;
	private String nombre;
	//bi-directional many-to-one association to Entrenador
	@ManyToOne
	@JoinColumn(name="entrenador_id")
	private Entrenador entrenadores;

	//bi-directional many-to-one association to Reserva
	@OneToMany(mappedBy="clasesEntreno")
	private List<Reserva> reservas;
	
	public ClaseEntreno() {
	}
	
	public ClaseEntreno(int id, String nombre, Date horario, 
			int capacidad, Entrenador entrenador, String imagen ) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.horario = horario;
		this.capacidadMaxima = capacidad;
		this.entrenadores = entrenador;
		this.imagen = imagen;
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getCapacidadMaxima() {
		return this.capacidadMaxima;
	}

	public void setCapacidadMaxima(int capacidadMaxima) {
		this.capacidadMaxima = capacidadMaxima;
	}

	public Date getHorario() {
		return this.horario;
	}

	public void setHorario(Date horario) {
		this.horario = horario;
	}

	public String getImagen() {
		return this.imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Entrenador getEntrenadores() {
		return this.entrenadores;
	}

	public void setEntrenadores(Entrenador entrenadores) {
		this.entrenadores = entrenadores;
	}

	public List<Reserva> getReservas() {
		return this.reservas;
	}

	public void setReservas(List<Reserva> reservas) {
		this.reservas = reservas;
	}

	public Reserva addReserva(Reserva reserva) {
		getReservas().add(reserva);
		reserva.setClasesEntreno(this);

		return reserva;
	}

	public Reserva removeReserva(Reserva reserva) {
		getReservas().remove(reserva);
		reserva.setClasesEntreno(null);

		return reserva;
	}

}