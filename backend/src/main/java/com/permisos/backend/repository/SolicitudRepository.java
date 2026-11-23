package com.permisos.backend.repository;

import com.permisos.backend.model.EstadoSolicitud;
import com.permisos.backend.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByPropietarioId(Long propietarioId);

    List<Solicitud> findByEstado(EstadoSolicitud estado);
}
