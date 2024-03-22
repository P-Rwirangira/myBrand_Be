
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import IUser from '../models/User';
import { Error } from 'mongoose';
import { loginVal, signInVal } from '../validations/users';


const jwtSecret = 'Speed';

export const createUser = async (req: Request, res: Response) => {
  try {
    const {phone ,username,password, email, role } = req.body;

    const { error } = signInVal.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await IUser.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new IUser({ phone,username,password: hashedPassword, email ,role});
    await newUser.save();

    const token = jwt.sign({role: newUser.role }, jwtSecret, {
      expiresIn: '2h'
    });

    res.status(201)
      .header('Authorization', `Bearer ${token}`)
      .send({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email, password } = req.body;

    const { error } = loginVal.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await IUser.findOne({ $or: [{ email }] });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({role: user.role }, jwtSecret, {
      expiresIn: '10h'
    });

    res.status(200)
      .header('Authorization', `Bearer ${token}`)
      .send({ message: 'Login successful!!', token: token , role: user.role ,email: user.email });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await IUser.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    let userEmail = req.params.email;
    userEmail = userEmail.toLowerCase();
    const deletedUser = await IUser.findOneAndDelete({ email: userEmail });

    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
