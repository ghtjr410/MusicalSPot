package com.housing.back.service;

import org.springframework.stereotype.Service;

import com.housing.back.entity.auth.BlacklistTokenEntity;
import com.housing.back.repository.auth.BlacklistTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtBlacklistService {
    
    private final BlacklistTokenRepository blacklistTokenRepository;

    public void addToBlacklist(String token, long expirationTimeInMillis) {
        BlacklistTokenEntity blacklistToken = BlacklistTokenEntity.builder().token(token).expiresAt(expirationTimeInMillis).build();

        blacklistTokenRepository.save(blacklistToken);
        
    }

    public boolean isBlacklisted(String token) {
        return blacklistTokenRepository.existsByToken(token);
    }
}