package com.wms.wms_backend.common.config;

import com.wms.wms_backend.domain.auth.oauth2.CustomOAuth2UserService;
import com.wms.wms_backend.domain.auth.oauth2.OAuth2SuccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

    public SecurityConfig(AuthTokenFilter authTokenFilter, CustomOAuth2UserService customOAuth2UserService, OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.authTokenFilter = authTokenFilter;
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/health",
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/items").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.POST, "/api/warehouses", "/api/areas", "/api/zones", "/api/locations").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouses/*", "/api/areas/*", "/api/zones/*", "/api/locations/*").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.DELETE, "/api/warehouses/*", "/api/areas/*", "/api/zones/*", "/api/locations/*").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.POST, "/api/receivings/*/confirm").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.POST, "/api/shippings/*/confirm").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.POST, "/api/purchase-returns/*/confirm").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .requestMatchers(HttpMethod.POST, "/api/sales-returns/*/confirm").hasAnyRole("ADMIN", "STAFF", "GUEST")
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
