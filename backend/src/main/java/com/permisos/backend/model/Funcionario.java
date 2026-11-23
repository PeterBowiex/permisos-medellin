package com.permisos.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "funcionario")
public class Funcionario extends Usuario {

    private String cargo;
    private String curaduriaAsignada;

    @OneToMany(mappedBy = "funcionario")
    private List<Solicitud> solicitudes = new ArrayList<>();

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getCuraduriaAsignada() {
        return curaduriaAsignada;
    }

    public void setCuraduriaAsignada(String curaduriaAsignada) {
        this.curaduriaAsignada = curaduriaAsignada;
    }

    public List<Solicitud> getSolicitudes() {
        return solicitudes;
    }

    public void setSolicitudes(List<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
    }
}
