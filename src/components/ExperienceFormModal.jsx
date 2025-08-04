import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

export default function ExperienceFormModal({ experience, show, onHide, onSave, userId }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      // Reset form for new experience and set user_id
      setFormData({
        title: '',
        institution: '',
        location: '',
        description: '',
        detailed_description: '',
        role: '',
        activities: '',
        start_date: '',
        end_date: '',
        type: 'work', // Default type
        is_featured: false,
        user_id: userId, // Set user_id for new experiences
      });
    }
  }, [experience, userId]); // Add userId to dependency array

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Ensure user_id is always part of the data being sent
    const dataToSave = { ...formData, user_id: userId };

    const { data, error } = await supabase
      .from('experiences')
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
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{experience ? 'Modifica Esperienza' : 'Aggiungi Esperienza'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Istituzione</Form.Label>
            <Form.Control type="text" name="institution" value={formData.institution || ''} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Località</Form.Label>
            <Form.Control type="text" name="location" value={formData.location || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ruolo</Form.Label>
            <Form.Control type="text" name="role" value={formData.role || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrizione Breve</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrizione Dettagliata</Form.Label>
            <Form.Control as="textarea" rows={5} name="detailed_description" value={formData.detailed_description || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Attività Svolte</Form.Label>
            <Form.Control as="textarea" rows={5} name="activities" value={formData.activities || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data Inizio</Form.Label>
            <Form.Control type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data Fine</Form.Label>
            <Form.Control type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select name="type" value={formData.type || 'work'} onChange={handleChange}>
              <option value="work">Lavoro</option>
              <option value="education">Formazione</option>
              <option value="certification">Certificazione</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" name="is_featured" label="Progetto in Evidenza" checked={formData.is_featured || false} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit">Salva</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
