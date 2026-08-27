/**
 * Tests for Input Sanitization
 * 
 * Validates that input sanitization prevents injection attacks and XSS
 */

import { describe, it, expect } from '@jest/globals';
import {
  escapeHtml,
  sanitizeInput,
  sanitizeSqlInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeFileName,
  removeNullBytes,
} from '@/lib/validation/sanitizers.js';

describe('Input Sanitization', () => {
  describe('HTML Escape', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = escapeHtml(input);
      
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should escape quotes', () => {
      const input = '"malicious" content';
      const result = escapeHtml(input);
      
      expect(result).toContain('&quot;');
    });

    it('should escape ampersands', () => {
      const input = 'AT&T';
      const result = escapeHtml(input);
      
      expect(result).toContain('&amp;');
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(escapeHtml(null)).toBe(null);
      expect(escapeHtml(undefined)).toBe(undefined);
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should remove DROP commands', () => {
      const input = "'; DROP TABLE users; --";
      const result = sanitizeSqlInput(input);
      
      expect(result.toUpperCase()).not.toContain('DROP');
    });

    it('should remove SQL comments', () => {
      const input = "data /* malicious comment */";
      const result = sanitizeSqlInput(input);
      
      expect(result).not.toContain('/*');
      expect(result).not.toContain('*/');
    });

    it('should remove dangerous keywords', () => {
      const keywords = ['DELETE', 'UPDATE', 'INSERT', 'UNION', 'SELECT'];
      
      keywords.forEach(keyword => {
        const input = `${keyword} FROM table`;
        const result = sanitizeSqlInput(input);
        
        expect(result.toUpperCase()).not.toContain(keyword);
      });
    });

    it('should remove quotes', () => {
      const input = `' OR '1'='1`;
      const result = sanitizeSqlInput(input);
      
      expect(result).not.toContain("'");
    });
  });

  describe('Email Sanitization', () => {
    it('should validate valid email', () => {
      const input = 'user@example.com';
      const result = sanitizeEmail(input);
      
      expect(result).toContain('@');
      expect(result).toContain('.');
    });

    it('should lowercase email', () => {
      const input = 'USER@EXAMPLE.COM';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('user@example.com');
    });

    it('should remove invalid characters', () => {
      const input = 'user+tag@example.com<script>';
      const result = sanitizeEmail(input);
      
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should trim whitespace', () => {
      const input = '  user@example.com  ';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('user@example.com');
    });
  });

  describe('Phone Sanitization', () => {
    it('should keep valid phone characters', () => {
      const input = '(11) 98765-4321';
      const result = sanitizePhone(input);
      
      expect(result).toMatch(/\d+/);
    });

    it('should remove invalid characters', () => {
      const input = '+55 11 98765-4321 ext. 123';
      const result = sanitizePhone(input);
      
      expect(result).not.toContain('ext');
      expect(result).not.toContain('.');
    });

    it('should have max length', () => {
      const input = '1'.repeat(100);
      const result = sanitizePhone(input);
      
      expect(result.length).toBeLessThanOrEqual(20);
    });
  });

  describe('URL Sanitization', () => {
    it('should accept valid HTTPS URLs', () => {
      const input = 'https://example.com/path';
      const result = sanitizeUrl(input);
      
      expect(result).toContain('https');
    });

    it('should accept valid HTTP URLs', () => {
      const input = 'http://example.com';
      const result = sanitizeUrl(input);
      
      expect(result).toContain('http');
    });

    it('should reject JavaScript URLs', () => {
      const input = 'javascript:alert("XSS")';
      const result = sanitizeUrl(input);
      
      expect(result).toBe('');
    });

    it('should reject data URLs', () => {
      const input = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizeUrl(input);
      
      expect(result).toBe('');
    });
  });

  describe('Filename Sanitization', () => {
    it('should remove illegal characters', () => {
      const input = 'file<script>.txt';
      const result = sanitizeFileName(input);
      
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should remove leading dots', () => {
      const input = '...malicious.txt';
      const result = sanitizeFileName(input);
      
      expect(result).not.toMatch(/^\.+/);
    });

    it('should replace spaces', () => {
      const input = 'my file name.txt';
      const result = sanitizeFileName(input);
      
      expect(result).toContain('_');
      expect(result).not.toContain(' ');
    });

    it('should limit length', () => {
      const input = 'a'.repeat(500) + '.txt';
      const result = sanitizeFileName(input);
      
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('Null Byte Removal', () => {
    it('should remove null bytes', () => {
      const input = 'data\x00injection';
      const result = removeNullBytes(input);
      
      expect(result).not.toContain('\x00');
    });

    it('should remove control characters', () => {
      const input = 'data\x01\x02\x03injection';
      const result = removeNullBytes(input);
      
      expect(result).not.toContain('\x01');
    });
  });

  describe('Generic Sanitization', () => {
    it('should sanitize text type', () => {
      const input = '<script>alert("test")</script>';
      const result = sanitizeInput(input, 'text');
      
      expect(result).not.toContain('<');
    });

    it('should sanitize email type', () => {
      const input = 'USER@EXAMPLE.COM';
      const result = sanitizeInput(input, 'email');
      
      expect(result).toBe('user@example.com');
    });

    it('should sanitize HTML type', () => {
      const input = '<img src=x onerror="alert()">';
      const result = sanitizeInput(input, 'html');
      
      expect(result).toContain('&lt;');
    });

    it('should use text as default', () => {
      const input = '<script>';
      const result = sanitizeInput(input);
      
      expect(result).not.toContain('<');
    });

    it('should handle undefined type', () => {
      const input = 'test data';
      const result = sanitizeInput(input, undefined);
      
      expect(result).toBe('test data');
    });
  });

  describe('XSS Prevention', () => {
    const xssPayloads = [
      '<img src=x onerror="alert()">',
      '<svg onload="alert()">',
      '<iframe src="javascript:alert()">',
      '<body onload="alert()">',
      '<input onfocus="alert()" autofocus>',
      '<select onfocus="alert()" autofocus>',
      '<textarea onfocus="alert()" autofocus>',
      'javascript:alert()',
      'data:text/html,<script>alert()</script>',
    ];

    xssPayloads.forEach((payload, index) => {
      it(`should prevent XSS payload ${index + 1}`, () => {
        const result = escapeHtml(payload);
        
        // Should not have unescaped angle brackets
        expect(result).not.toContain(payload.substring(0, 1) === '<' ? '<' : 'javascript:');
      });
    });
  });

  describe('SQL Injection Prevention', () => {
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin' --",
      "' UNION SELECT * FROM users --",
      "1; DELETE FROM users; --",
    ];

    sqlPayloads.forEach((payload, index) => {
      it(`should prevent SQL injection payload ${index + 1}`, () => {
        const result = sanitizeSqlInput(payload);
        
        // Should not contain dangerous patterns
        expect(result.toUpperCase()).not.toContain('DROP');
        expect(result.toUpperCase()).not.toContain('DELETE');
        expect(result.toUpperCase()).not.toContain('UNION');
      });
    });
  });

  describe('Whitespace Normalization', () => {
    it('should normalize multiple spaces', () => {
      const input = 'text    with    spaces';
      const result = sanitizeInput(input, 'text');
      
      expect(result).not.toContain('    ');
    });

    it('should trim leading/trailing spaces', () => {
      const input = '   text   ';
      const result = sanitizeInput(input, 'text');
      
      expect(result).toBe(result.trim());
    });
  });

  describe('Length Limits', () => {
    it('should limit text length', () => {
      const input = 'a'.repeat(2000);
      const result = sanitizeInput(input, 'text');
      
      expect(result.length).toBeLessThanOrEqual(1000);
    });

    it('should limit email length', () => {
      const input = 'a'.repeat(300) + '@test.com';
      const result = sanitizeInput(input, 'email');
      
      expect(result.length).toBeLessThanOrEqual(254);
    });
  });
});
