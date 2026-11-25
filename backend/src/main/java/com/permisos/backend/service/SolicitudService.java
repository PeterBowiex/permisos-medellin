
package com.permisos.backend.service;

import com.permisos.backend.model.Documento;
import com.permisos.backend.model.Propietario;
import com.permisos.backend.model.Solicitud;
import com.permisos.backend.model.Usuario;
import com.permisos.backend.repository.SolicitudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioService usuarioService;

    public SolicitudService(
            SolicitudRepository solicitudRepository,
            UsuarioService usuarioService) {
        this.solicitudRepository = solicitudRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public Solicitud crearSolicitud(
            String email,
            String tipoPermiso,
            String direccionPredio,
            String matriculaInmobiliaria,
            String descripcion,
            List<MultipartFile> archivos,
            List<String> tiposDocumentos) {

        Usuario usuario = usuarioService.buscarPorEmail(email);

        if (!(usuario instanceof Propietario)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo los propietarios pueden crear solicitudes"
            );
        }

        if (tipoPermiso == null || tipoPermiso.isBlank()
                || direccionPredio == null || direccionPredio.isBlank()
                || matriculaInmobiliaria == null || matriculaInmobiliaria.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Completa los campos obligatorios"
            );
        }

        if (archivos == null) {
            archivos = new ArrayList<>();
        }

        if (tiposDocumentos == null) {
            tiposDocumentos = new ArrayList<>();
        }

        if (archivos.size() != tiposDocumentos.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cada archivo debe tener un tipo de documento"
            );
        }

        long cantidadFotos = tiposDocumentos.stream()
                .filter("FOTOGRAFIAS_PREDIO"::equals)
                .count();

        if (cantidadFotos > 5) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solo puedes cargar máximo 5 fotografías del predio"
            );
        }

        Solicitud solicitud = new Solicitud();
        solicitud.setTipoPermiso(tipoPermiso.trim());
        solicitud.setDireccionPredio(direccionPredio.trim());
        solicitud.setMatriculaInmobiliaria(matriculaInmobiliaria.trim());
        solicitud.setDescripcion(descripcion);

        solicitud.setPropietario((Propietario) usuario);

        solicitud = solicitudRepository.save(solicitud);

        Path carpeta = Paths.get(
                "uploads",
                "solicitudes",
                solicitud.getIdRadicado().toString()
        ).toAbsolutePath().normalize();

        try {
            Files.createDirectories(carpeta);

            for (int i = 0; i < archivos.size(); i++) {
                MultipartFile archivo = archivos.get(i);
                String tipoDocumento = tiposDocumentos.get(i);

                if (archivo == null || archivo.isEmpty()) {
                    continue;
                }

                guardarDocumento(
                        solicitud,
                        archivo,
                        tipoDocumento,
                        carpeta
                );
            }

            return solicitudRepository.save(solicitud);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "No fue posible guardar los archivos"
            );
        }
    }

    private void guardarDocumento(
            Solicitud solicitud,
            MultipartFile archivo,
            String tipoDocumento,
            Path carpeta) throws IOException {

        if (tipoDocumento == null || tipoDocumento.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo de documento es obligatorio"
            );
        }

        String nombreOriginal = archivo.getOriginalFilename();

        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            nombreOriginal = "archivo";
        }

        nombreOriginal = nombreOriginal.replaceAll("[\\\\/]", "_");

        String extension = "";

        int punto = nombreOriginal.lastIndexOf('.');
        if (punto >= 0) {
            extension = nombreOriginal.substring(punto + 1).toLowerCase();
        }

        boolean esFotografia = tipoDocumento.equals("FOTOGRAFIAS_PREDIO");

        if (esFotografia) {
            if (!List.of("jpg", "jpeg", "png", "webp").contains(extension)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Las fotografías deben ser JPG, JPEG, PNG o WEBP"
                );
            }

            if (archivo.getContentType() == null
                    || !archivo.getContentType().startsWith("image/")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El archivo seleccionado no es una imagen válida"
                );
            }

        } else {
            if (!extension.equals("pdf")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Los documentos deben estar en formato PDF"
                );
            }

            if (archivo.getContentType() != null
                    && !archivo.getContentType().equalsIgnoreCase("application/pdf")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El documento seleccionado no es un PDF válido"
                );
            }
        }

        String nombreSeguro = UUID.randomUUID() + "." + extension;
        Path destino = carpeta.resolve(nombreSeguro).normalize();

        if (!destino.startsWith(carpeta)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nombre de archivo no permitido"
            );
        }

        Files.copy(archivo.getInputStream(), destino);

        Documento documento = new Documento();
        documento.setNombreArchivo(nombreOriginal);
        documento.setFormato(extension);
        documento.setRutaArchivo(destino.toString());
        documento.setTipoDocumento(tipoDocumento);
        documento.setTipoContenido(archivo.getContentType());
        documento.setTamanioBytes(archivo.getSize());
        documento.setSolicitud(solicitud);

        solicitud.agregarDocumento(documento);
    }

    @Transactional(readOnly = true)
    public List<Solicitud> obtenerSolicitudesPropietario(String email) {

        Usuario usuario = usuarioService.buscarPorEmail(email);

        if (!(usuario instanceof Propietario)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tienes permiso para consultar estas solicitudes"
            );
        }

        return solicitudRepository.findByPropietarioId(usuario.getId());
    }
}
