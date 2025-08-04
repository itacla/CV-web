import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ExperienceFormModal from './ExperienceFormModal';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import { Button } from 'react-bootstrap'; // Import Button component

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchExperiences(user.id);
      } else {
        setError('Utente non autenticato.');
        setLoading(false);
      }
    };
    getUserId();
  }, []);

  const fetchExperiences = async (currentUserId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', currentUserId) // Filter by user_id
      .order('order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setExperiences(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa esperienza?')) {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) {
        setError(error.message);
      } else {
        setExperiences(experiences.filter(exp => exp.id !== id));
      }
    }
  };

  const handleEdit = (experience) => {
    setSelectedExperience(experience);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedExperience(null);
    setShowModal(true);
  };

  const handleSave = (savedExperience) => {
    if (selectedExperience) {
      // Update existing experience
      setExperiences(experiences.map(exp => exp.id === savedExperience.id ? savedExperience : exp));
    } else {
      // Add new experience
      setExperiences([...experiences, savedExperience]);
    }
  };

  if (loading) return <p>Caricamento esperienze...</p>;
  if (error) return <p className="text-danger">Errore: {error}</p>;

  return (
    <div className="card interactive-lift">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="card-title mb-0">Gestione Esperienze</h3>
          <button className="btn btn-primary" onClick={handleAddNew}>Aggiungi Esperienza</button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Istituzione</th>
                <th>Tipo</th>
                <th>Dal</th>
                <th>Al</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>{exp.institution}</td>
                  <td>{exp.type}</td>
                  <td>{new Date(exp.start_date).toLocaleDateString()}</td>
                  <td>{exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Presente'}</td>
                  <td>
                    <Button variant="link" className="text-info p-0 me-2" onClick={() => handleEdit(exp)}><FaEdit /></Button>
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(exp.id)}><FaTrash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ExperienceFormModal
        experience={selectedExperience}
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        userId={userId} // Pass userId to the modal
      />
    </div>
  );
}
