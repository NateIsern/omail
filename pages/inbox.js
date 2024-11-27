import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabaseClient';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      const { data, error } = await supabaseClient
        .from('inbox')
        .select('*')
        .order('received_at', { ascending: false });

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
    const { error } = await supabaseClient
      .from('inbox')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting email:', error);
    } else {
      setEmails(emails.filter((email) => email.id !== id));
    }
  };

  const handleMarkAsSpam = async (id) => {
    const { error } = await supabaseClient
      .from('inbox')
      .update({ is_spam: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking email as spam:', error);
    } else {
      setEmails(emails.map((email) => (email.id === id ? { ...email, is_spam: true } : email)));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Inbox</h1>
      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <h2>{email.subject}</h2>
              <p>{email.content}</p>
              <p>From: {email.sender}</p>
              <p>Received at: {new Date(email.received_at).toLocaleString()}</p>
              <button onClick={() => handleDelete(email.id)}>Delete</button>
              <button onClick={() => handleMarkAsSpam(email.id)}>Mark as Spam</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
