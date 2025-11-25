import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import { env } from '../config/env';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const jwtSecret: Secret = env.jwtSecret;
const jwtOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn,
};

const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret, jwtOptions);
};

const sanitizeUser = (user: IUser) => ({
  _id: user._id.toString(),
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role }: { email?: string; password?: string; role?: UserRole } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ValidationError('Email is already registered');
    }

    const user = new User({
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'admin' : 'user',
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: { email?: string; password?: string } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new UnauthorizedError();
    }

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

