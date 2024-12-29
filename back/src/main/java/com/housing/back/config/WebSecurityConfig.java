package com.housing.back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.housing.back.filter.JwtAuthenticationFilter;
import com.housing.back.handler.OAuth2SuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configurable
@Configuration // Spring configuration 클래스임을 나타냅니다.
@EnableWebSecurity // 웹 보안 활성화
// 생성자 주입 (RequiredArgsConstructor 사용시 final 필드에 대해 자동으로 생성자 생성)
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final DefaultOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    
    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception{

        httpSecurity
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource()) // CORS 설정 적용
            )
            .csrf(CsrfConfigurer::disable)  // CSRF 보호 비활성화
            .httpBasic(HttpBasicConfigurer::disable) // HTTP 기본 인증 비활성화
            .sessionManagement(sessionManagement -> sessionManagement
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // 세션을 사용하지 않도록 설정 (JWT를 사용하기 때문)
            )
            .authorizeHttpRequests(request -> request
                .requestMatchers("/","/api/v1/auth/**", "/oauth2/**","/error**","/api/v1/public/**","/ws/**", "/chatRoom/**","/topic/**","app/**","/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll() // 인증 없이 접근 허용
                .requestMatchers("/api/v1/user/**").hasRole("USER") // USER 역할이 필요한 경로
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN") // ADMIN 역할이 필요한 경로
                .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요    
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2")) // OAuth2 인증 엔드포인트 설정
                .redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*")) // OAuth2 인증 후 리다이렉션 엔드포인트 설정
                .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService)) // OAuth2 사용자 정보 서비스 설정
                .successHandler(oAuth2SuccessHandler) // OAuth2 성공 핸들러 설정
            )
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(new FailedAuthenticationEntryPoint()) // 인증 실패 시 처리 핸들러 설정
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // JWT 인증 필터 추가

            System.out.println("Security configuration completed.");

        return httpSecurity.build();

    }

    @Bean
    protected CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // 나중에 클라이언트 배포하는 주소를 적으면됌
        corsConfiguration.addAllowedOrigin("http://localhost:3000"); // 클라이언트 도메인 명시
        corsConfiguration.addAllowedOrigin("https://musical.ghtjr.com"); // 배포 서버 도메인 명시
        // corsConfiguration.addAllowedOrigin("*"); // 모든 출처 허용
        corsConfiguration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
        corsConfiguration.addAllowedHeader("*"); // 모든 헤더 허용
        corsConfiguration.setAllowCredentials(true); // 자격 증명 허용 // 추가한거임 @@@@

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        System.out.println("CORS configuration completed.");

        return source;
    }
        
}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint{

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
        AuthenticationException authException) throws IOException, ServletException {

        System.out.println("Authentication failed for request: " + request.getRequestURI());
        System.out.println("AuthenticationException: " + authException.getMessage());
        
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        // {"code": "NP", "message":"No Permission."}
        response.getWriter().write("{\"code\": \"NP\", \"message\":\"No Permission.\"}"); 

    }
    
}
