import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Table, Button, Alert } from 'react-bootstrap';
import SkillFormModal from './SkillFormModal';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

export default function SkillsManagement() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchSkills(user.id);
      } else {
        setError('Utente non autenticato.');
        setLoading(false);
      }
    };
    getUserId();
  }, []);

  const fetchSkills = async (currentUserId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', currentUserId) // Filter by user_id
      .order('name', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setSkills(data);
    }
    setLoading(false);
  };

  const handleSave = (savedSkill) => {
    if (selectedSkill) {
      setSkills(skills.map(s => s.id === savedSkill.id ? savedSkill : s));
    } else {
      setSkills([...skills, savedSkill]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa competenza?')) {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) {
        setError(error.message);
      } else {
        setSkills(skills.filter(s => s.id !== id));
      }
    }
  };

  if (loading) return <p>Caricamento competenze...</p>;

  return (
    <div className="card interactive-lift">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="card-title mb-0">Gestione Competenze</h3>
          <Button variant="primary" onClick={() => { setSelectedSkill(null); setShowModal(true); }}>Aggiungi Competenza</Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Peso (1-5)</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.category}</td>
                <td>{skill.weight}</td>
                <td>
                  <Button variant="link" className="text-info p-0 me-2" onClick={() => { setSelectedSkill(skill); setShowModal(true); }}><FaEdit /></Button>
                  <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(skill.id)}><FaTrash /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <SkillFormModal
        skill={selectedSkill}
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        userId={userId} // Pass userId to the modal
      />
    </div>
  );
}
