import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

export default function SkillFormModal({ skill, show, onHide, onSave, userId }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skill) {
      setFormData(skill);
    } else {
      setFormData({
        name: '',
        category: 'technical',
        weight: 50,
        user_id: userId, // Set user_id for new skills
      });
    }
  }, [skill, userId]); // Add userId to dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Ensure user_id is always part of the data being sent
    const dataToSave = { ...formData, user_id: userId };

    const { data, error } = await supabase
      .from('skills')
      .upsert([dataToSave])
      .select();

    if (error) {
      setError(error.message);
    } else {
      onSave(data[0]);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{skill ? 'Modifica Competenza' : 'Aggiungi Competenza'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Select name="category" value={formData.category || 'technical'} onChange={handleChange}>
              <option value="technical">Tecnica</option>
              <option value="managerial">Manageriale</option>
              <option value="soft">Soft Skill</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Peso (1-5)</Form.Label>
            <Form.Select name="weight" value={formData.weight || 3} onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">Salva</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
