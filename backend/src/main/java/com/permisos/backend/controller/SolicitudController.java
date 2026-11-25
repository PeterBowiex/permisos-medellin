
package com.permisos.backend.controller;

import com.permisos.backend.model.Documento;
import com.permisos.backend.model.Solicitud;
import com.permisos.backend.service.SolicitudService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> crearSolicitud(
            Authentication authentication,
            @RequestParam("tipoPermiso") String tipoPermiso,
            @RequestParam("direccionPredio") String direccionPredio,
            @RequestParam("matriculaInmobiliaria") String matriculaInmobiliaria,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "archivos", required = false) List<MultipartFile> archivos,
            @RequestParam(value = "tiposDocumentos", required = false) List<String> tiposDocumentos) {

        Solicitud solicitud = solicitudService.crearSolicitud(
                authentication.getName(),
                tipoPermiso,
                direccionPredio,
                matriculaInmobiliaria,
                descripcion,
                archivos,
                tiposDocumentos
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertirSolicitud(solicitud));
    }

    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<Map<String, Object>>> misSolicitudes(
            Authentication authentication) {

        List<Solicitud> solicitudes =
                solicitudService.obtenerSolicitudesPropietario(
                        authentication.getName()
                );

        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Solicitud solicitud : solicitudes) {
            respuesta.add(convertirSolicitud(solicitud));
        }

        return ResponseEntity.ok(respuesta);
    }

    private Map<String, Object> convertirSolicitud(Solicitud solicitud) {

        Map<String, Object> datos = new LinkedHashMap<>();

        datos.put("idRadicado", solicitud.getIdRadicado());
        datos.put("tipoPermiso", solicitud.getTipoPermiso());
        datos.put("direccionPredio", solicitud.getDireccionPredio());
        datos.put("matriculaInmobiliaria", solicitud.getMatriculaInmobiliaria());
        datos.put("descripcion", solicitud.getDescripcion());
        datos.put("estado", solicitud.getEstado());
        datos.put("fechaCreacion", solicitud.getFechaCreacion());

        List<Map<String, Object>> documentos = new ArrayList<>();

        for (Documento documento : solicitud.getDocumentos()) {
            Map<String, Object> archivo = new LinkedHashMap<>();

            archivo.put("id", documento.getId());
            archivo.put("nombreArchivo", documento.getNombreArchivo());
            archivo.put("tipoDocumento", documento.getTipoDocumento());
            archivo.put("formato", documento.getFormato());
            archivo.put("tamanioBytes", documento.getTamanioBytes());

            documentos.add(archivo);
        }

        datos.put("documentos", documentos);

        return datos;
    }
}
