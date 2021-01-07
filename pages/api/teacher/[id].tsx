import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';
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
    const id = req.query.id as string;

    if (!id)
      return res
        .status(400)
        .json({ error: 'Missing teacher ID on request body' });

    let _id: ObjectID;

    try {
      _id = new ObjectID(id);
    } catch {
      return res.status(400).json({ error: 'Wrong objectID' });
    }

    const { db } = await connect();

    const response = await db.collection('users').findOne({ _id });
    if (!response) return res.status(400).json({ error: 'Teacher not found' });

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
