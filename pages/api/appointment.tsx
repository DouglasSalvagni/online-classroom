import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';
import { ObjectID } from 'mongodb';
import { getSession } from 'next-auth/client';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  date: string;
  teacher_name: string;
  teacher_id: string;
  studant_name: string;
  studant_id: string;
  courses: string;
  location: string;
  appointment_link: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Não logado' });
  } 

  if (req.method === 'POST') {
    const {
      date,
      teacher_name,
      teacher_id,
      studant_name,
      studant_id,
      courses,
      location,
      appointment_link,
    }: {
      date: string;
      teacher_name: string;
      teacher_id: string;
      studant_name: string;
      studant_id: string;
      courses: string;
      location: string;
      appointment_link: string;
    } = req.body;

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !studant_name ||
      !studant_id ||
      !courses ||
      !location
    )
      return res
        .status(400)
        .json({ error: 'Missing parameter on request body' });

    const { db } = await connect();

    const teacherExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(teacher_id) });
    if (!teacherExists)
      return res.status(400).json({
        error: `Teacher ${teacher_name} with ID ${teacher_id} does not exist`,
      });

    const studantExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(studant_id) });
    if (!studantExists)
      return res.status(400).json({
        error: `Teacher ${studant_name} with ID ${studant_id} does not exist`,
      });

    const appointment = {
      date,
      teacher_name,
      teacher_id,
      studant_name,
      studant_id,
      courses,
      location,
      appointment_link: appointment_link || '',
    };

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(teacher_id) },
        { $push: { appointments: appointment }, $inc: { coins: 1 } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(studant_id) },
        { $push: { appointments: appointment }, $inc: { coins: -1 } }
      );

    res.status(200).json(appointment);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
