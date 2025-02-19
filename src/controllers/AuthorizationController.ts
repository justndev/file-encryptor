import { encryptionService } from "../services/encryptionService";
import firebaseService from "../services/firebaseService";

interface ValidationResult {
    isValid: boolean;
    error: string;
  }
  
  class AuthController {
    validateEmail(email: string): ValidationResult {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        return { isValid: false, error: 'Email is required' };
      }
      if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
      }
      
      return { isValid: true, error: '' };
    }
  
    validatePassword(password: string, confirmPassword?: string): ValidationResult {
      if (!password) {
        return { isValid: false, error: 'Password is required' };
      }
      if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters' };
      }
      if (confirmPassword !== undefined && password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match' };
      }
      
      return { isValid: true, error: '' };
    }
  
    async login(email: string, password: string): Promise<void> {
      const emailValidation = this.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }
  
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
      }
  
      try {
        await firebaseService.login(email, password);

      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  
    async register(email: string, password: string, confirmPassword: string): Promise<void> {
      const emailValidation = this.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }
  
      const passwordValidation = this.validatePassword(password, confirmPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
      }
  
      try {
        const result = await firebaseService.register(email, password);
        firebaseService.storeEncryptionKey(result.user.uid, encryptionService.generateEncryptionKey())
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  }
  
  export const authController = new AuthController();
