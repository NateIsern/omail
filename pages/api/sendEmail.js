import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { recipient, subject, content } = req.body;

    // Validate email content and recipient
    if (!recipient || !subject || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert email data into the 'sent' table
    const { data, error } = await supabase
      .from('sent')
      .insert([{ recipient, subject, content, sent_at: new Date() }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Email sent successfully', data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
