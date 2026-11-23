package com.permisos.backend.controller;

import com.permisos.backend.dto.RegistroRequest;
import com.permisos.backend.model.Funcionario;
import com.permisos.backend.model.Propietario;
import com.permisos.backend.model.Usuario;
import com.permisos.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registrar(@Valid @RequestBody RegistroRequest datos) {
        Propietario p = usuarioService.registrarPropietario(datos);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", p.getId(), "nombre", p.getNombre(), "email", p.getEmail()));
    }

    @GetMapping("/yo")
    public Map<String, Object> yo(Authentication authentication) {
        Usuario u = usuarioService.buscarPorEmail(authentication.getName());
        String rol = (u instanceof Funcionario) ? "FUNCIONARIO" : "PROPIETARIO";
        return Map.of("id", u.getId(), "nombre", u.getNombre(), "email", u.getEmail(), "rol", rol);
    }
}