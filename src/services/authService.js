import axios from "axios";
import { mockUsers } from "../data/mockData";

// Mock API service for authentication
class AuthService {
  constructor() {
    this.baseURL = "/api/auth";
    this.setupInterceptors();
  }

  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async login(credentials) {
    // Mock authentication logic
    const user = mockUsers.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async register(userData) {
    // Mock registration logic
    const existingUser = mockUsers.find((u) => u.email === userData.email);

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: "customer",
      createdAt: new Date().toISOString(),
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
    };

    mockUsers.push(newUser);
    const token = this.generateToken(newUser);
    const { password, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const decoded = this.decodeToken(token);
      const user = mockUsers.find((u) => u.id === decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async refreshToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    // In a real app, this would call the refresh endpoint
    const decoded = this.decodeToken(token);
    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    // Simple mock token - in production, use JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return btoa(JSON.stringify(payload));
  }

  decodeToken(token) {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      throw new Error("Invalid token format");
    }
  }

  logout() {
    localStorage.removeItem("token");
  }
}

export const authService = new AuthService();
