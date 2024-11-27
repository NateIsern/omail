import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('username, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUser(user);
          setUsername(data.username);
          setEmail(data.email);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('users')
      .update({ username, email })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      alert('Profile updated successfully!');
    }

    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
