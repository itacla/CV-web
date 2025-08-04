import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Alert, Image } from 'react-bootstrap';

export default function ProfileManagement() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const fetchProfileData = useCallback(async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      setError(error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchProfileData(user.id);
      }
    };
    init();
  }, [fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (event) => {
    setError(null);
    setSuccess(false);
    const file = event.target.files[0];
    if (!file || !user) return;

    setUploading(true);

    const fileName = `profile.jpg`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profile')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      setSuccess(true);
    }
    setUploading(false);
  };

  const handleCvUpload = async (event) => {
    setError(null);
    setSuccess(false);
    const file = event.target.files[0];
    if (!file || !user) return;

    setUploadingCv(true);

    const fileName = `cv.pdf`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cv-documents')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingCv(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('cv-documents').getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profile')
      .update({ cv_url: publicUrl })
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setProfile(prev => ({ ...prev, cv_url: publicUrl }));
      setSuccess(true);
    }
    setUploadingCv(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) {
      setError('Utente non autenticato.');
      return;
    }

    // Make sure date is null if empty, otherwise Supabase might throw an error
    const profileData = {
      ...profile,
      date_of_birth: profile.date_of_birth || null,
    };

    const { error: updateError } = await supabase
      .from('profile')
      .update(profileData)
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      fetchProfileData(user.id);
    }
  };

  if (loading) return <p>Caricamento profilo...</p>;

  return (
    <div className="card interactive-lift">
      <div className="card-body">
        <h3 className="card-title">Gestione Profilo</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Profilo aggiornato con successo!</Alert>}
        {profile && (
          <Form onSubmit={handleSubmit}>
            {/* File Uploads */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Immagine del Profilo</Form.Label>
                  <div>
                    {profile.avatar_url ? (
                      <Image src={profile.avatar_url} roundedCircle width="150" height="150" className="mb-3" />
                    ) : (
                      <div className="mb-3">Nessuna immagine caricata.</div>
                    )}
                    <Form.Control type="file" onChange={handleUpload} disabled={uploading} accept="image/*" />
                    {uploading && <p>Caricamento in corso...</p>}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Curriculum Vitae (PDF)</Form.Label>
                  <div>
                    {profile.cv_url && (
                      <div className="mb-2">
                        <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">Vedi CV attuale</a>
                      </div>
                    )}
                    <Form.Control type="file" onChange={handleCvUpload} disabled={uploadingCv} accept=".pdf" />
                    {uploadingCv && <p>Caricamento in corso...</p>}
                  </div>
                </Form.Group>
              </div>
            </div>

            <hr />

            {/* Personal Details */}
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control type="text" name="full_name" value={profile.full_name || ''} onChange={handleChange} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Data di Nascita</Form.Label>
                  <Form.Control type="date" name="date_of_birth" value={profile.date_of_birth || ''} onChange={handleChange} />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Titolo Professionale</Form.Label>
              <Form.Control type="text" name="professional_title" value={profile.professional_title || ''} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nazionalità</Form.Label>
              <Form.Control type="text" name="nationality" value={profile.nationality || ''} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" rows={5} name="bio" value={profile.bio || ''} onChange={handleChange} />
            </Form.Group>

            <hr />

            {/* Contact & Links */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email di Contatto</Form.Label>
                  <Form.Control type="email" name="contact_email" value={profile.contact_email || ''} onChange={handleChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Telefono di Contatto</Form.Label>
                  <Form.Control type="tel" name="contact_phone" value={profile.contact_phone || ''} onChange={handleChange} />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>URL Sito Web</Form.Label>
                  <Form.Control type="url" name="website_url" value={profile.website_url || ''} onChange={handleChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>URL LinkedIn</Form.Label>
                  <Form.Control type="url" name="linkedin_url" value={profile.linkedin_url || ''} onChange={handleChange} />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>URL GitHub</Form.Label>
              <Form.Control type="url" name="github_url" value={profile.github_url || ''} onChange={handleChange} />
            </Form.Group>

            <Button type="submit" variant="primary">Salva Modifiche</Button>
          </Form>
        )}
      </div>
    </div>
  );
}
