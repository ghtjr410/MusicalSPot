package com.housing.back.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.housing.back.entity.auth.BlacklistTokenEntity;

public interface BlacklistTokenRepository extends JpaRepository<BlacklistTokenEntity, Long> {

    boolean existsByToken(String token);
}
