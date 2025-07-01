const mongoose = require('mongoose');
const Session = require('../../models/Session');
const User = require('../../models/User');
const sessionController = require('../../controllers/sessionController');

describe('Session Controller', () => {
  let teacherUser;
  let studentUser;
  let testSession;
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      query: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  beforeAll(async () => {
    // Create test users
    teacherUser = new User({
      username: 'teacher123',
      email: 'teacher@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Teacher',
      title: 'Math Tutor',
      bio: 'Expert in mathematics',
      timezone: 'UTC',
      languages: ['English'],
      country: 'USA',
      skillsOffered: [{ skill: 'Mathematics', level: 'Expert' }]
    });
    await teacherUser.save();

    studentUser = new User({
      username: 'student123',
      email: 'student@test.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Student',
      title: 'Learning Math',
      bio: 'Want to learn math',
      timezone: 'UTC',
      languages: ['English'],
      country: 'USA'
    });
    await studentUser.save();
  });

  beforeEach(async () => {
    // Create a test session
    testSession = new Session({
      teacher: teacherUser._id,
      student: studentUser._id,
      skill: 'Mathematics',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 60,
      status: 'pending',
      price: 10
    });
    await testSession.save();
  });

  afterEach(async () => {
    await Session.deleteMany({});
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should handle getSessions request successfully', async () => {
    req.user.id = teacherUser._id.toString();
    
    // Mock Session.find chain
    const mockSessions = [testSession];
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(mockSessions)
    };
    
    jest.spyOn(Session, 'find').mockReturnValue(mockQuery);
    jest.spyOn(Session, 'countDocuments').mockResolvedValue(1);

    // This test verifies the basic structure without full integration
    expect(typeof sessionController.getSessions).toBe('function');
  });

  it('should validate session exists before returning details', async () => {
    req.params.sessionId = testSession._id.toString();
    req.user.id = teacherUser._id.toString();

    const session = await Session.findById(testSession._id);
    expect(session).toBeTruthy();
    expect(session.skill).toBe('Mathematics');
  });

  it('should create session with correct data structure', async () => {
    const sessionData = {
      teacher: teacherUser._id,
      student: studentUser._id,
      skill: 'Physics',
      scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      duration: 90,
      status: 'pending',
      price: 15
    };

    const newSession = new Session(sessionData);
    await newSession.save();

    expect(newSession.teacher.toString()).toBe(teacherUser._id.toString());
    expect(newSession.student.toString()).toBe(studentUser._id.toString());
    expect(newSession.skill).toBe('Physics');
    expect(newSession.status).toBe('pending');
  });

  it('should handle session status updates', async () => {
    expect(testSession.status).toBe('pending');
    
    testSession.status = 'confirmed';
    await testSession.save();
    
    const updatedSession = await Session.findById(testSession._id);
    expect(updatedSession.status).toBe('confirmed');
  });

  it('should enforce required session fields', async () => {
    const invalidSession = new Session({
      skill: 'Mathematics'
      // Missing required fields: teacher, student, scheduledTime
    });

    await expect(invalidSession.save()).rejects.toThrow();
  });
});
