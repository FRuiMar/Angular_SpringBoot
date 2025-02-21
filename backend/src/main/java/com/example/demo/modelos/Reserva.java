package com.example.demo.modelos;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.Date;


/**
 * The persistent class for the reservas database table.
 * 
 */
@Entity
@Table(name="reservas")
@NamedQuery(name="Reserva.findAll", query="SELECT r FROM Reserva r")
public class Reserva implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="fecha_reserva")
	private Date fechaReserva;

	//bi-directional many-to-one association to ClaseEntreno
	@ManyToOne
	@JoinColumn(name="clase_id")
	private ClaseEntreno clasesEntreno;

	//bi-directional many-to-one association to Usuario
	@ManyToOne
	@JoinColumn(name="usuario_id")
	private Usuario usuario;

	public Reserva() {
	}
	
	public Reserva(int id, Date fechaReserva, 
			ClaseEntreno clasesEntreno, Usuario usuario ) {
		super();
		this.id = id;
		this.fechaReserva = fechaReserva;
		this.clasesEntreno = clasesEntreno;
		this.usuario = usuario;
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getFechaReserva() {
		return this.fechaReserva;
	}

	public void setFechaReserva(Date fechaReserva) {
		this.fechaReserva = fechaReserva;
	}

	public ClaseEntreno getClasesEntreno() {
		return this.clasesEntreno;
	}

	public void setClasesEntreno(ClaseEntreno clasesEntreno) {
		this.clasesEntreno = clasesEntreno;
	}

	public Usuario getUsuario() {
		return this.usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

}