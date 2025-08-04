import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('authorized_users')
      .select('id, email');

    if (error) {
      setError(error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newEmail) return;

    const { data, error } = await supabase
      .from('authorized_users')
      .insert([{ email: newEmail }])
      .select();

    if (error) {
      setError(error.message);
    } else if (data) {
      setUsers([...users, ...data]);
      setNewEmail('');
      setError(null);
    }
  };

  const handleDeleteUser = async (id) => {
    const { error } = await supabase
      .from('authorized_users')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setUsers(users.filter(user => user.id !== id));
      setError(null);
    }
  };

  if (loading) return <p>Caricamento utenti...</p>;

  return (
    <div className="card interactive-lift">
      <div className="card-body">
        <h3 className="card-title">Gestione Utenti Autorizzati</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleAddUser} className="mb-3">
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              placeholder="Nuova email da autorizzare"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">Aggiungi</button>
          </div>
        </form>
        <ul className="list-group">
          {users.map(user => (
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              {user.email}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Rimuovi</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
