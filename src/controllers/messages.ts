import { Request, Response } from 'express';
import Message from '../models/Message'; 
import {msgVal} from '../validations/messages';
// get
export const getAllMessages = async (req: Request, res: Response) => {
  try {
   
    const messages = await Message.find();

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};


// one message
export const getMessageById = async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id; 

    const message = await Message.findById(messageId);

    if (message) {
      res.status(200).json(message);
    } else {
    
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve message' });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const {phone,names, email, message } = req.body;
    const { error } = msgVal.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const query = new Message({
      names,
      email,
      phone,
      message,
    });
    const savedQuery = await query.save();
    res.status(201).json({ Query: savedQuery, message: 'Your message is sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
}
export const deleteMessageById = async (req: Request, res: Response) => {
    try {
      const messageId = req.params.id;
      const deletedMessage = await Message.findByIdAndDelete(messageId);
  
      if (deletedMessage) {
        res.status(200).json({ message: 'Message deleted successfully' });
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to delete message' });
    }
  };
