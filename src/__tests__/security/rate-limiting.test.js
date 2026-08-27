/**
 * Tests for Rate Limiting Module
 * 
 * Validates that rate limiting works correctly and prevents abuse
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { rateLimiter, RATE_LIMIT_CONFIGS, createRateLimitKey } from '@/lib/rate-limiting/index.js';

describe('Rate Limiter', () => {
  beforeEach(async () => {
    await rateLimiter.initialize();
  });

  describe('Rate Limiting Initialization', () => {
    it('should initialize successfully', async () => {
      expect(rateLimiter.initialized).toBe(true);
    });

    it('should have all configs defined', () => {
      const configs = Object.keys(RATE_LIMIT_CONFIGS);
      expect(configs).toContain('auth');
      expect(configs).toContain('upload');
      expect(configs).toContain('petCreate');
      expect(configs).toContain('general');
    });
  });

  describe('Rate Limit Checking', () => {
    it('should allow requests within limit', async () => {
      const result = await rateLimiter.checkLimit('test-client', 'auth', 1);
      expect(result.success).toBe(true);
      expect(result.remaining).toBeLessThan(5);
    });

    it('should block requests exceeding limit', async () => {
      const clientId = 'test-rate-limit-exceeded';
      const config = RATE_LIMIT_CONFIGS.auth;

      // Consume all points
      for (let i = 0; i < config.points; i++) {
        await rateLimiter.checkLimit(clientId, 'auth', 1);
      }

      // Next request should be blocked
      const result = await rateLimiter.checkLimit(clientId, 'auth', 1);
      expect(result.success).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should return correct headers', async () => {
      const result = await rateLimiter.checkLimit('test-headers', 'auth', 1);
      
      expect(result.headers).toHaveProperty('X-RateLimit-Limit');
      expect(result.headers).toHaveProperty('X-RateLimit-Remaining');
      expect(result.headers).toHaveProperty('X-RateLimit-Reset');
    });

    it('should support different limits per type', async () => {
      const authLimit = RATE_LIMIT_CONFIGS.auth.points;
      const uploadLimit = RATE_LIMIT_CONFIGS.upload.points;
      const generalLimit = RATE_LIMIT_CONFIGS.general.points;

      expect(authLimit).toBeLessThan(uploadLimit);
      expect(uploadLimit).toBeLessThan(generalLimit);
    });

    it('should handle multiple concurrent requests', async () => {
      const clientId = 'test-concurrent';
      const promises = [];

      // Criar 5 requisições concorrentes
      for (let i = 0; i < 5; i++) {
        promises.push(rateLimiter.checkLimit(clientId, 'auth', 1));
      }

      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;

      // Todos devem ser bem-sucedidos dentro do limite
      expect(successful).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Rate Limit Key Generation', () => {
    it('should generate valid keys', () => {
      const key = createRateLimitKey('192.168.1.1');
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('should handle special characters', () => {
      const key = createRateLimitKey('user@example.com');
      expect(key).not.toContain('@');
      expect(key).not.toContain('.');
    });

    it('should include suffix if provided', () => {
      const key = createRateLimitKey('192.168.1.1', 'auth');
      expect(key).toContain('auth');
    });

    it('should have max length', () => {
      const longId = 'a'.repeat(1000);
      const key = createRateLimitKey(longId);
      expect(key.length).toBeLessThanOrEqual(256);
    });
  });

  describe('Rate Limit Status', () => {
    it('should return status for key', async () => {
      const clientId = 'test-status';
      
      // Make a request first
      await rateLimiter.checkLimit(clientId, 'auth', 1);
      
      // Get status
      const status = await rateLimiter.getStatus(clientId, 'auth');
      expect(status).toHaveProperty('points');
      expect(status).toHaveProperty('remaining');
      expect(status.remaining).toBeLessThan(status.points);
    });

    it('should return full points for new key', async () => {
      const status = await rateLimiter.getStatus('new-key-status', 'auth');
      expect(status.remaining).toBe(status.points);
    });
  });

  describe('Rate Limit Reset', () => {
    it('should reset rate limit for key', async () => {
      const clientId = 'test-reset';
      const config = RATE_LIMIT_CONFIGS.auth;

      // Consume all points
      for (let i = 0; i < config.points; i++) {
        await rateLimiter.checkLimit(clientId, 'auth', 1);
      }

      // Verify limited
      let result = await rateLimiter.checkLimit(clientId, 'auth', 1);
      expect(result.success).toBe(false);

      // Reset
      await rateLimiter.reset(clientId, 'auth');

      // Should work again
      result = await rateLimiter.checkLimit(clientId, 'auth', 1);
      expect(result.success).toBe(true);
    });
  });

  describe('Rate Limit Configs', () => {
    it('auth should have strict limits', () => {
      const config = RATE_LIMIT_CONFIGS.auth;
      expect(config.points).toBeLessThanOrEqual(5);
      expect(config.duration).toBeLessThanOrEqual(900);
    });

    it('public GET should have high limits', () => {
      const config = RATE_LIMIT_CONFIGS.publicGet;
      expect(config.points).toBeGreaterThanOrEqual(1000);
    });

    it('all configs should have blockDuration', () => {
      Object.values(RATE_LIMIT_CONFIGS).forEach(config => {
        expect(config.blockDuration).toBeGreaterThan(0);
      });
    });
  });

  describe('Rate Limit Edge Cases', () => {
    it('should handle zero points consumption', async () => {
      const result = await rateLimiter.checkLimit('test-zero', 'auth', 0);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(RATE_LIMIT_CONFIGS.auth.points);
    });

    it('should handle multiple points consumption', async () => {
      const clientId = 'test-multi-points';
      const config = RATE_LIMIT_CONFIGS.general;

      // Consume 50 points
      const result = await rateLimiter.checkLimit(clientId, 'general', 50);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(config.points - 50);
    });

    it('should handle invalid limit type gracefully', async () => {
      try {
        await rateLimiter.checkLimit('test', 'invalid-type', 1);
        // Should throw
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('not encontrado');
      }
    });
  });
});
