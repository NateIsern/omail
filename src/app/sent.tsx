import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Sent = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      const { data, error } = await supabase
        .from('sent')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
      } else {
        setEmails(data);
      }
      setLoading(false);
    };

    fetchEmails();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('sent')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting email:', error);
    } else {
      setEmails(emails.filter((email) => email.id !== id));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sent Emails</h1>
      {emails.length === 0 ? (
        <p>No sent emails found.</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <h2>{email.subject}</h2>
              <p>{email.content}</p>
              <p>To: {email.recipient}</p>
              <p>Sent at: {new Date(email.sent_at).toLocaleString()}</p>
              <button onClick={() => handleDelete(email.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sent;
