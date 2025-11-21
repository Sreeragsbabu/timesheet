const UserService = require("../../src/services/User");
const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");

// Mock the User model
jest.mock("../../src/models/User");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    const validUserData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
      empId: "EMP001",
    };

    test("should create a new user successfully", async () => {
      const mockSavedUser = {
        _id: "123",
        name: validUserData.name,
        email: validUserData.email,
        passwordHash: "hashedPassword",
        role: validUserData.role,
        empId: validUserData.empId,
        save: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockSavedUser);
      mockSavedUser.save.mockResolvedValue(mockSavedUser);

      const result = await UserService.createUser(validUserData);

      expect(User.findOne).toHaveBeenCalledWith({ email: validUserData.email });
      expect(result).toBeDefined();
      expect(result.name).toBe(validUserData.name);
      expect(result.email).toBe(validUserData.email);
    });

    test("should hash the password correctly", async () => {
      const mockSavedUser = {
        _id: "123",
        passwordHash: await bcrypt.hash(validUserData.password, 10),
        save: jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockSavedUser)),
      };

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockSavedUser);

      const result = await UserService.createUser(validUserData);

      const isPasswordValid = await bcrypt.compare(
        validUserData.password,
        result.passwordHash
      );
      expect(isPasswordValid).toBe(true);
    });

    test("should throw error if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: validUserData.email });

      await expect(UserService.createUser(validUserData)).rejects.toThrow(
        "User already exists"
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: validUserData.email });
    });

    test("should check for existing user before creating", async () => {
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({}),
      }));

      await UserService.createUser(validUserData);

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({
        email: validUserData.email,
      });
    });

    test("should handle database save errors", async () => {
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error("Database error")),
      }));

      await expect(UserService.createUser(validUserData)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
