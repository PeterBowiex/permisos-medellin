
package com.permisos.backend.service;

import com.permisos.backend.dto.RegistroRequest;
import com.permisos.backend.model.Propietario;
import com.permisos.backend.model.Usuario;
import com.permisos.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Propietario registrarPropietario(RegistroRequest datos) {
        if (usuarioRepository.existsByEmail(datos.email())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "El correo ya está registrado"
            );
        }

        Propietario propietario = new Propietario();
        propietario.setNombre(datos.nombre());
        propietario.setEmail(datos.email());
        propietario.setClaveHash(passwordEncoder.encode(datos.clave()));
        propietario.setTelefono(datos.telefono());
        propietario.setDireccion(datos.direccion());

        return usuarioRepository.save(propietario);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Usuario no encontrado"
            ));
    }
}
