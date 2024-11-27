import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sender, subject, content } = req.body;

    // Validate email content and sender
    if (!sender || !subject || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert email data into the 'inbox' table
    const { data, error } = await supabase
      .from('inbox')
      .insert([{ sender, subject, content, received_at: new Date() }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Email received successfully', data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
