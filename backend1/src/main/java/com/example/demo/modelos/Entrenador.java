package com.example.demo.modelos;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;


/**
 * The persistent class for the entrenadores database table.
 * 
 */
@Entity
@Table(name="entrenadores")
@NamedQuery(name="Entrenador.findAll", query="SELECT e FROM Entrenador e")
public class Entrenador implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;
	private String apellido;
	private String dni;
	private String especialidad;
	private String imagen;
	private String nombre;

	//bi-directional many-to-one association to ClaseEntreno
	@OneToMany(mappedBy="entrenadores")
	private List<ClaseEntreno> clasesEntreno;

	public Entrenador() {
	}

	public Entrenador(int id, String dni, String nombre, 
			String apellido, String especialidad, String imagen) {
		super();
		this.id = id;
		this.dni = dni;
		this.nombre = nombre;
		this.apellido = apellido;
		this.especialidad = especialidad;
		this.imagen = imagen;
	}
	
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getApellido() {
		return this.apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public String getDni() {
		return this.dni;
	}

	public void setDni(String dni) {
		this.dni = dni;
	}

	public String getEspecialidad() {
		return this.especialidad;
	}

	public void setEspecialidad(String especialidad) {
		this.especialidad = especialidad;
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

	public List<ClaseEntreno> getClasesEntreno() {
		return this.clasesEntreno;
	}

	public void setClasesEntreno(List<ClaseEntreno> clasesEntreno) {
		this.clasesEntreno = clasesEntreno;
	}

	public ClaseEntreno addClasesEntreno(ClaseEntreno clasesEntreno) {
		getClasesEntreno().add(clasesEntreno);
		clasesEntreno.setEntrenadores(this);

		return clasesEntreno;
	}

	public ClaseEntreno removeClasesEntreno(ClaseEntreno clasesEntreno) {
		getClasesEntreno().remove(clasesEntreno);
		clasesEntreno.setEntrenadores(null);

		return clasesEntreno;
	}

}