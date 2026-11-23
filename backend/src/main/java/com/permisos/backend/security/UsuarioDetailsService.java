package com.permisos.backend.security;

import com.permisos.backend.model.Funcionario;
import com.permisos.backend.model.Usuario;
import com.permisos.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        String rol = (usuario instanceof Funcionario) ? "FUNCIONARIO" : "PROPIETARIO";

        return User.withUsername(usuario.getEmail())
                .password(usuario.getClaveHash())
                .roles(rol)
                .build();
    }
}