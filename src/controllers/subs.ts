import { Request, Response } from 'express';
import Subscriber from '../models/Sub'; 
import { subVal } from '../validations/subs';

// Get all subscribers
export const getAllSubs = async (req: Request, res: Response) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve subscribers' });
  }
};

// Get one subscriber by ID
export const getSubs = async (req: Request, res: Response) => {
  try {
    const subscriberId = req.params.id; 
    const subscriber = await Subscriber.findById(subscriberId);

    if (subscriber) {
      res.status(200).json(subscriber);
    } else {
      res.status(404).json({ error: 'Subscriber not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve subscriber' });
  }
};

// Create a new subscriber
export const createSubs = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const { error } = subVal.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newSubscriber = new Subscriber({
      email,
    });
    const savedSubscriber = await newSubscriber.save();
    res.status(201).json({ subscriber: savedSubscriber, message: 'Subscriber added successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a subscriber by ID
export const deleteSubs = async (req: Request, res: Response) => {
  try {
    const subscriberId = req.params.id;
    const deletedSubscriber = await Subscriber.findByIdAndDelete(subscriberId);

    if (deletedSubscriber) {
      res.status(200).json({ message: 'Subscriber deleted successfully' });
    } else {
      res.status(404).json({ error: 'Subscriber not found' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
};
