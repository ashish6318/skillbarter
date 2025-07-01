const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

describe('User Model', () => {
  let userData;

  beforeEach(() => {
    userData = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Software Developer',
      bio: 'Passionate about coding and teaching',
      timezone: 'UTC',
      languages: ['English', 'Spanish'],
      country: 'USA'
    };
  });

  describe('User Creation', () => {
    it('should create a valid user', async () => {
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.credits).toBe(5); // Default credits
      expect(savedUser.isActive).toBe(true);
      expect(savedUser.isVerified).toBe(false);
    });

    it('should hash password before saving', async () => {
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2b\$/); // bcrypt hash format
    });

    it('should require username, email, password, firstName, and lastName', async () => {
      const user = new User({});
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique username', async () => {
      const user1 = new User(userData);
      await user1.save();

      const user2 = new User({ ...userData, email: 'different@email.com' });
      await expect(user2.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const user1 = new User(userData);
      await user1.save();

      const user2 = new User({ ...userData, username: 'differentuser' });
      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const user = new User({ ...userData, email: 'invalid-email' });
      await expect(user.save()).rejects.toThrow();
    });

    it('should validate username format', async () => {
      const user = new User({ ...userData, username: 'invalid user!' });
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce minimum password length', async () => {
      const user = new User({ ...userData, password: '123' });
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    let user;

    beforeEach(async () => {
      user = new User(userData);
      await user.save();
    });

    describe('comparePassword', () => {
      it('should return true for correct password', async () => {
        const isMatch = await user.comparePassword('password123');
        expect(isMatch).toBe(true);
      });

      it('should return false for incorrect password', async () => {
        const isMatch = await user.comparePassword('wrongpassword');
        expect(isMatch).toBe(false);
      });
    });

    describe('updateRating', () => {
      it('should update rating correctly for first review', async () => {
        await user.updateRating(4.5);
        
        expect(user.rating).toBe(4.5);
        expect(user.totalReviews).toBe(1);
      });

      it('should calculate average rating correctly', async () => {
        await user.updateRating(4);
        await user.updateRating(5);
        
        expect(user.rating).toBe(4.5);
        expect(user.totalReviews).toBe(2);
      });
    });

    describe('getPublicProfile', () => {
      it('should exclude sensitive information', () => {
        const publicProfile = user.getPublicProfile();

        expect(publicProfile.password).toBeUndefined();
        expect(publicProfile.email).toBeUndefined();
        expect(publicProfile.reportCount).toBeUndefined();
        expect(publicProfile.isBanned).toBeUndefined();
        expect(publicProfile.banReason).toBeUndefined();
        expect(publicProfile.banExpiresAt).toBeUndefined();
        
        expect(publicProfile.username).toBe(userData.username);
        expect(publicProfile.firstName).toBe(userData.firstName);
        expect(publicProfile.lastName).toBe(userData.lastName);
      });
    });
  });

  describe('Virtual Properties', () => {
    it('should return correct fullName', async () => {
      const user = new User(userData);
      expect(user.fullName).toBe('John Doe');
    });
  });

  describe('Skills Management', () => {
    let user;

    beforeEach(async () => {
      user = new User({
        ...userData,
        skillsOffered: [{
          skill: 'JavaScript',
          category: 'Technology',
          experience: 'Expert',
          description: 'Frontend and backend development'
        }],
        skillsWanted: [{
          skill: 'Python',
          category: 'Technology',
          level: 'Intermediate',
          priority: 'High'
        }]
      });
      await user.save();
    });

    it('should save skills offered correctly', () => {
      expect(user.skillsOffered).toHaveLength(1);
      expect(user.skillsOffered[0].skill).toBe('JavaScript');
      expect(user.skillsOffered[0].category).toBe('Technology');
      expect(user.skillsOffered[0].experience).toBe('Expert');
    });

    it('should save skills wanted correctly', () => {
      expect(user.skillsWanted).toHaveLength(1);
      expect(user.skillsWanted[0].skill).toBe('Python');
      expect(user.skillsWanted[0].level).toBe('Intermediate');
      expect(user.skillsWanted[0].priority).toBe('High');
    });
  });

  describe('Availability Management', () => {
    it('should save availability correctly', async () => {
      const user = new User({
        ...userData,
        availability: [{
          day: 'Monday',
          timeSlots: [{
            startTime: '09:00',
            endTime: '17:00'
          }]
        }]
      });
      
      await user.save();
      
      expect(user.availability).toHaveLength(1);
      expect(user.availability[0].day).toBe('Monday');
      expect(user.availability[0].timeSlots[0].startTime).toBe('09:00');
      expect(user.availability[0].timeSlots[0].endTime).toBe('17:00');
    });
  });
});
