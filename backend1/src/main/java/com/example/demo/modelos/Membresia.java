package com.example.demo.modelos;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;


/**
 * The persistent class for the membresias database table.
 * 
 */
@Entity
@Table(name="membresias")
@NamedQuery(name="Membresia.findAll", query="SELECT m FROM Membresia m")
public class Membresia implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Column(name="duracion_meses")
	private int duracionMeses;

	private Float precio;

	private String tipo;

	//bi-directional many-to-one association to Usuario
	//@JsonIgnore
	@OneToMany(mappedBy="membresia") //, fetch = FetchType.EAGER
	private List<Usuario> usuarios;

	public Membresia() {
	}
	
	public Membresia(int id, String tipo, float precio, int duracionMeses) {
		super();
		this.id = id;
		this.tipo = tipo;
		this.precio = precio;
		this.duracionMeses = duracionMeses;
		
	}
	

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getDuracionMeses() {
		return this.duracionMeses;
	}

	public void setDuracionMeses(int duracionMeses) {
		this.duracionMeses = duracionMeses;
	}

	public Float getPrecio() {
		return this.precio;
	}

	public void setPrecio(Float precio) {
		this.precio = precio;
	}

	public String getTipo() {
		return this.tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public List<Usuario> getUsuarios() {
		return this.usuarios;
	}

	public void setUsuarios(List<Usuario> usuarios) {
		this.usuarios = usuarios;
	}

	public Usuario addUsuario(Usuario usuario) {
		getUsuarios().add(usuario);
		usuario.setMembresia(this);

		return usuario;
	}

	public Usuario removeUsuario(Usuario usuario) {
		getUsuarios().remove(usuario);
		usuario.setMembresia(null);

		return usuario;
	}

}