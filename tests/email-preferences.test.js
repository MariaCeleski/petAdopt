/**
 * Tests for Email Preferences System
 * 
 * Requirements: 8.4 (email template customization), 8.5 (unsubscribe option)
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import {
  generateUnsubscribeToken,
  getOrCreateEmailPreferences,
  shouldSendNotification,
  updateNotificationPreference,
  updateAllNotificationPreferences,
  unsubscribeFromAll,
  resubscribe,
  getEmailPreferences,
  getUnsubscribeUrl,
  getManagePreferencesUrl,
  NOTIFICATION_TYPES
} from '../src/lib/email/preferences';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Email Preferences', () => {
  let testUser;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: `test-email-prefs-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
        emailVerified: new Date()
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.emailPreference.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.$disconnect();
  });

  describe('generateUnsubscribeToken', () => {
    it('should generate a unique token', () => {
      const token1 = generateUnsubscribeToken();
      const token2 = generateUnsubscribeToken();

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toEqual(token2);
      expect(token1.length).toBeGreaterThan(30);
    });
  });

  describe('getOrCreateEmailPreferences', () => {
    it('should create email preferences for new user', async () => {
      const preferences = await getOrCreateEmailPreferences(testUser.id);

      expect(preferences).toBeDefined();
      expect(preferences.userId).toEqual(testUser.id);
      expect(preferences.adoptionNotifications).toBe(true);
      expect(preferences.statusChangeNotifications).toBe(true);
      expect(preferences.petMatchingAlerts).toBe(true);
      expect(preferences.newsletter).toBe(true);
      expect(preferences.unsubscribedAll).toBe(false);
      expect(preferences.unsubscribeToken).toBeDefined();
    });

    it('should return existing preferences for existing user', async () => {
      const preferences1 = await getOrCreateEmailPreferences(testUser.id);
      const preferences2 = await getOrCreateEmailPreferences(testUser.id);

      expect(preferences1.id).toEqual(preferences2.id);
      expect(preferences1.unsubscribeToken).toEqual(preferences2.unsubscribeToken);
    });
  });

  describe('shouldSendNotification', () => {
    it('should return true by default for all notification types', async () => {
      const adoptionNotif = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.ADOPTION_REQUEST
      );
      const statusChangeNotif = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.STATUS_CHANGE
      );
      const petMatchingNotif = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.PET_MATCHING
      );
      const newsletterNotif = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.NEWSLETTER
      );

      expect(adoptionNotif).toBe(true);
      expect(statusChangeNotif).toBe(true);
      expect(petMatchingNotif).toBe(true);
      expect(newsletterNotif).toBe(true);
    });

    it('should return false when unsubscribedAll is true', async () => {
      // Unsubscribe from all
      await unsubscribeFromAll((await getOrCreateEmailPreferences(testUser.id)).unsubscribeToken);

      const adoptionNotif = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.ADOPTION_REQUEST
      );

      expect(adoptionNotif).toBe(false);
    });

    it('should return false for disabled notification types', async () => {
      // First, resubscribe to get back to normal state
      const preferences = await getOrCreateEmailPreferences(testUser.id);
      await resubscribe(testUser.id);

      // Disable adoption notifications
      await updateNotificationPreference(
        testUser.id,
        NOTIFICATION_TYPES.ADOPTION_REQUEST,
        false
      );

      const shouldSend = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.ADOPTION_REQUEST
      );

      expect(shouldSend).toBe(false);

      // But other types should still be enabled
      const petMatchingShouldSend = await shouldSendNotification(
        testUser.id,
        NOTIFICATION_TYPES.PET_MATCHING
      );

      expect(petMatchingShouldSend).toBe(true);
    });
  });

  describe('updateNotificationPreference', () => {
    it('should update individual notification preference', async () => {
      // Reset to all enabled
      await resubscribe(testUser.id);

      await updateNotificationPreference(
        testUser.id,
        NOTIFICATION_TYPES.NEWSLETTER,
        false
      );

      const preferences = await getEmailPreferences(testUser.id);

      expect(preferences.newsletter).toBe(false);
      expect(preferences.adoptionNotifications).toBe(true);
    });

    it('should throw on invalid notification type', async () => {
      await expect(
        updateNotificationPreference(testUser.id, 'INVALID_TYPE', false)
      ).rejects.toThrow('Unknown notification type');
    });
  });

  describe('updateAllNotificationPreferences', () => {
    it('should update multiple preferences at once', async () => {
      await updateAllNotificationPreferences(testUser.id, {
        adoptionNotifications: false,
        statusChangeNotifications: false,
        petMatchingAlerts: true,
        newsletter: true
      });

      const preferences = await getEmailPreferences(testUser.id);

      expect(preferences.adoptionNotifications).toBe(false);
      expect(preferences.statusChangeNotifications).toBe(false);
      expect(preferences.petMatchingAlerts).toBe(true);
      expect(preferences.newsletter).toBe(true);
    });

    it('should throw on invalid preference key', async () => {
      await expect(
        updateAllNotificationPreferences(testUser.id, {
          invalidKey: true
        })
      ).rejects.toThrow('Unknown notification type');
    });
  });

  describe('unsubscribeFromAll and resubscribe', () => {
    it('should unsubscribe from all emails', async () => {
      const preferences = await getOrCreateEmailPreferences(testUser.id);
      const token = preferences.unsubscribeToken;

      const unsubscribed = await unsubscribeFromAll(token);

      expect(unsubscribed.unsubscribedAll).toBe(true);
      expect(unsubscribed.adoptionNotifications).toBe(false);
      expect(unsubscribed.statusChangeNotifications).toBe(false);
      expect(unsubscribed.petMatchingAlerts).toBe(false);
      expect(unsubscribed.newsletter).toBe(false);
    });

    it('should resubscribe to all emails', async () => {
      await resubscribe(testUser.id);

      const preferences = await getEmailPreferences(testUser.id);

      expect(preferences.unsubscribedAll).toBe(false);
      expect(preferences.adoptionNotifications).toBe(true);
      expect(preferences.statusChangeNotifications).toBe(true);
      expect(preferences.petMatchingAlerts).toBe(true);
      expect(preferences.newsletter).toBe(true);
    });

    it('should resubscribe to specific notification types only', async () => {
      await resubscribe(testUser.id, {
        adoptionNotifications: true,
        statusChangeNotifications: false,
        petMatchingAlerts: true,
        newsletter: false
      });

      const preferences = await getEmailPreferences(testUser.id);

      expect(preferences.unsubscribedAll).toBe(false);
      expect(preferences.adoptionNotifications).toBe(true);
      expect(preferences.statusChangeNotifications).toBe(false);
      expect(preferences.petMatchingAlerts).toBe(true);
      expect(preferences.newsletter).toBe(false);
    });

    it('should throw on invalid unsubscribe token', async () => {
      await expect(
        unsubscribeFromAll('invalid-token-12345')
      ).rejects.toThrow('Invalid or expired unsubscribe token');
    });
  });

  describe('getEmailPreferences', () => {
    it('should return user preferences without sensitive fields', async () => {
      const preferences = await getEmailPreferences(testUser.id);

      expect(preferences.adoptionNotifications).toBeDefined();
      expect(preferences.statusChangeNotifications).toBeDefined();
      expect(preferences.petMatchingAlerts).toBeDefined();
      expect(preferences.newsletter).toBeDefined();
      expect(preferences.unsubscribedAll).toBeDefined();
      expect(preferences.unsubscribeToken).toBeDefined();
      expect(preferences.updatedAt).toBeDefined();
    });
  });

  describe('URL generation', () => {
    it('should generate unsubscribe URL', async () => {
      const preferences = await getOrCreateEmailPreferences(testUser.id);
      const url = getUnsubscribeUrl(preferences.unsubscribeToken);

      expect(url).toContain('/api/email/unsubscribe');
      expect(url).toContain(`token=${preferences.unsubscribeToken}`);
    });

    it('should generate manage preferences URL', async () => {
      const preferences = await getOrCreateEmailPreferences(testUser.id);
      const url = getManagePreferencesUrl(preferences.unsubscribeToken);

      expect(url).toContain('/dashboard/email-preferences');
      expect(url).toContain(`token=${preferences.unsubscribeToken}`);
    });
  });

  describe('NOTIFICATION_TYPES constant', () => {
    it('should have all required notification types', () => {
      expect(NOTIFICATION_TYPES.ADOPTION_REQUEST).toBe('adoptionNotifications');
      expect(NOTIFICATION_TYPES.STATUS_CHANGE).toBe('statusChangeNotifications');
      expect(NOTIFICATION_TYPES.PET_MATCHING).toBe('petMatchingAlerts');
      expect(NOTIFICATION_TYPES.NEWSLETTER).toBe('newsletter');
    });
  });
});
