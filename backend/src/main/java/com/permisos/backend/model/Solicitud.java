package com.permisos.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitud")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRadicado;

    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private String direccionPredio;

    @Column(nullable = false)
    private String matriculaInmobiliaria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    @ManyToOne(optional = false)
    private Propietario propietario;

    @ManyToOne
    private Funcionario funcionario;

    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Documento> documentos = new ArrayList<>();

    @PrePersist
    void alCrear() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public Long getIdRadicado() {
        return idRadicado;
    }

    public void setIdRadicado(Long idRadicado) {
        this.idRadicado = idRadicado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getDireccionPredio() {
        return direccionPredio;
    }

    public void setDireccionPredio(String direccionPredio) {
        this.direccionPredio = direccionPredio;
    }

    public String getMatriculaInmobiliaria() {
        return matriculaInmobiliaria;
    }

    public void setMatriculaInmobiliaria(String matriculaInmobiliaria) {
        this.matriculaInmobiliaria = matriculaInmobiliaria;
    }

    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
    }

    public Propietario getPropietario() {
        return propietario;
    }

    public void setPropietario(Propietario propietario) {
        this.propietario = propietario;
    }

    public Funcionario getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionario funcionario) {
        this.funcionario = funcionario;
    }

    public List<Documento> getDocumentos() {
        return documentos;
    }

    public void setDocumentos(List<Documento> documentos) {
        this.documentos = documentos;
    }
}
