package com.redrd.back_cvs.config.segurity.user;

import com.redrd.back_cvs.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SecionUserDetails implements UserDetails {

    private UUID id;
    private String email;
    private String password;

    private Collection<GrantedAuthority> authorities;

    public static SecionUserDetails buildUserDetails(Usuario user){
        List<GrantedAuthority> authoritties = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getUser_rol())
        );

        return new SecionUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authoritties
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {return password; }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }
    // Validar si el usario esta activo
    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
