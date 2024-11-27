import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Compose() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email inputs
    if (!recipient || !subject || !content) {
      setError('All fields are required');
      return;
    }

    const { data, error } = await supabase
      .from('sent')
      .insert([{ recipient, subject, content, sent_at: new Date() }]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Email sent successfully');
      setRecipient('');
      setSubject('');
      setContent('');
    }
  };

  return (
    <div>
      <h1>Compose Email</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient:</label>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
