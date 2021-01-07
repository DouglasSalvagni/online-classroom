import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';
import { ObjectID } from 'mongodb';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  // SHOW USER PROFILE

  if (req.method === 'GET') {
    const { id } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ error: 'Missing teacher ID on request body' });

    const { db } = await connect();

    const response = await db
      .collection('users')
      .findOne({ _id: new ObjectID(id) });
    if (!response) return res.status(400).json({ error: 'Teacher not found' });

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
