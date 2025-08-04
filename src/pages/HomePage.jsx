import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Chrono } from "react-chrono";
import { TagCloud } from 'react-tagcloud';
import { Modal, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Import the star icon
import '../App.css';
import { AuthError } from '@supabase/supabase-js';

import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

// --- HELPER & CHILD COMPONENTS ---

const calculateAge = (dob) => {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatDate = (dateString, options = { year: 'numeric', month: 'short' }) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', options);
};

const ObfuscatedContact = ({ type, value }) => {
  const [renderedValue, setRenderedValue] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setRenderedValue(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  if (!renderedValue) return <span>...</span>;
  const link = type === 'email' ? `mailto:${renderedValue}` : `tel:${renderedValue}`;
  return <a href={link}>{renderedValue}</a>;
};

const getPeriodString = (startDate, endDate, type) => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : '';

  if (!endDate && (type === 'work' || type === 'education' || type === 'project')) {
    return `${start} - <span class="in-progress-text">IN CORSO</span>`;
  }
  return `${start} - ${end}`;
};

const CertificationsGrid = ({ items, onItemSelected }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-5">
      <h2 className="h4 mb-4 text-center"><strong>Corsi e Certificazioni</strong></h2>
      <div className="row g-3">
        {items.map((item, index) => (
          <div key={index} className="col-md-6" onClick={() => onItemSelected(item)} style={{ cursor: 'pointer' }}>
            <div className={`card h-100 shadow-sm interactive-lift ${item.is_featured ? 'featured-experience-card' : ''}`}> {/* Apply featured class here */}
              <div className="card-body">
                {item.is_featured && <FaStar className="featured-star-icon" />} {/* Add star icon here */}
                <h5 className="card-title h6">{item.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted small">{item.institution}</h6>
                <p className="card-text small">{item.description}</p>
              </div>
              <div className="card-footer text-muted small">
                <span dangerouslySetInnerHTML={{ __html: getPeriodString(item.start_date, item.end_date, item.type) }}></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExperienceDetailModal = ({ experience, show, onHide }) => {
    if (!experience) return null;
  
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{experience.title}</Modal.Title>
          {experience.is_featured && <FaStar className="featured-star-icon" style={{ position: 'static', marginLeft: '10px' }} />} {/* Star in modal title */}
        </Modal.Header>
        <Modal.Body>
          <p><strong>Società:</strong> {experience.institution}{experience.location ? ` | ${experience.location}` : ''}</p>
          <p><strong>Periodo:</strong> <span dangerouslySetInnerHTML={{ __html: getPeriodString(experience.start_date, experience.end_date, experience.type) }}></span></p>
          {experience.role && <p><strong>Ruolo:</strong> {experience.role}</p>}
          <hr />
          <p><strong>Descrizione:</strong></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{experience.description}</p>
          {experience.detailed_description && (
            <>
              <hr />
              <p><strong>Dettagli:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{experience.detailed_description}</p>
            </>
          )}
          {experience.activities && (
            <>
              <hr />
              <p><strong>Attività svolte:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{experience.activities}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

// --- MAIN LAYOUT COMPONENTS ---

const ProfileCard = ({ profile, loading }) => {
  if (loading) return <div className="p-4 text-center">Caricamento...</div>;
  if (!profile) return <div className="p-4 text-center text-danger">Dati non trovati.</div>;

  const age = calculateAge(profile.date_of_birth);

  return (
    <aside className="bg-white p-4 shadow-sm">
      <div className="text-center mb-4">
        <img src={profile.avatar_url || '/profile.jpg'} alt={`Foto di ${profile.full_name}`} className="profile-picture mb-3" />
        <h2 className="h4 mb-1"><strong>{profile.full_name}</strong></h2>
        <h3 className="h6 text-muted"><em>{profile.professional_title}</em></h3>
      </div>

      {/* Personal Details Section */}
      <div className="mb-4">
        <ul className="list-unstyled text-muted">
          {age && <li><strong>Età:</strong> {age} anni</li>}
          {profile.nationality && <li><strong>Nazionalità:</strong> {profile.nationality}</li>}
        </ul>
      </div>

      <p style={{ textAlign: 'justify' }}>{profile.bio}</p>
      <hr />

      {/* Contacts & Links Section */}
      <h5><strong>Contatti & Links</strong></h5>
      <ul className="list-unstyled">
        <li><strong>Email:</strong> <ObfuscatedContact type="email" value={profile.contact_email} /></li>
        <li><strong>Tel:</strong> <ObfuscatedContact type="phone" value={profile.contact_phone} /></li>
        {profile.website_url && (
          <li><FaGlobe className="me-2" /><a href={profile.website_url} target="_blank" rel="noopener noreferrer">Sito Web</a></li>
        )}
        {profile.linkedin_url && (
          <li><FaLinkedin className="me-2" /><a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        )}
        {profile.github_url && (
          <li><FaGithub className="me-2" /><a href={profile.github_url} target="_blank" rel="noopener noreferrer">GitHub</a></li>
        )}
      </ul>
    </aside>
  );
};

const TimelineSection = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-5">
      <h2 className="h4 mb-4 text-center"><strong>{title}</strong></h2>
      <Chrono
        items={items}
        mode="VERTICAL"
        theme={{
          primary: '#0d6efd',
          secondary: 'transparent',
          cardBgColor: '#ffffff',
          cardForeColor: '#333'
        }}
        hideControls={true}
        disableToolbar={true}
        allowDynamicUpdate
        cardHeight="auto"
      >
        {/* The custom render uses the 'data' property from each item */}
        {items.map(item => (
            <div 
              key={item.id} 
              onClick={() => item.onClick(item.data)} 
              className={`timeline-card-custom interactive-lift ${item.data.is_featured ? 'featured-experience-card' : ''}`}
            >
                {item.data.is_featured && <FaStar className="featured-star-icon" />}
                <h5>{item.data.title}</h5>
                <p className="text-muted fst-italic fw-light">
                    <strong>{item.data.institution}</strong>
                    <br />
                    <span dangerouslySetInnerHTML={{ __html: getPeriodString(item.data.start_date, item.data.end_date, item.data.type) }}></span>
                </p>
                <p>{item.data.description}</p>
            </div>
        ))}
      </Chrono>
    </div>
  );
};

const TimelineContainer = ({ experiences, loading, onExperienceSelected }) => {
  if (loading) return <div className="p-4 text-center">Caricamento timeline...</div>;

  const formatTimelineItems = (expArray) => expArray.map(exp => ({
    id: exp.id,
    title: formatDate(exp.start_date, { year: 'numeric' }),
    data: exp, // Pass the whole experience object
    onClick: onExperienceSelected, // Pass the handler
  }));

  const workExperiences = experiences.filter(exp => exp.type === 'work').sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  const personalProjects = experiences.filter(exp => exp.type === 'project').sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  const educationExperiences = experiences.filter(exp => exp.type === 'education').sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  const certificationExperiences = experiences.filter(exp => exp.type === 'certification').sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  return (
    <main className="p-4 bg-white shadow-sm">
      <TimelineSection title="Percorso Professionale" items={formatTimelineItems(workExperiences)} />
      <TimelineSection title="Progetti Personali & Startup" items={formatTimelineItems(personalProjects)} />
      <TimelineSection title="Percorso Accademico" items={formatTimelineItems(educationExperiences)} />
      <CertificationsGrid items={certificationExperiences} onItemSelected={onExperienceSelected} />
    </main>
  );
};

const SkillsCloud = ({ skills, loading }) => {
  if (loading) return <div className="p-4 text-center">Caricamento skills...</div>;

  const mapSkills = (skillArray) => skillArray.map(skill => ({ ...skill, value: skill.name, count: skill.weight }));

  // Function to determine style based on a 5-level weight scale with transparency
  const getStyleByWeight = (weight) => {
    // Using RGBA to add a layer of transparency for a softer, more refined look.
    switch (weight) {
      case 1: return { backgroundColor: 'rgba(233, 236, 239, 0.6)', color: '#6c757d' }; // #e9ecef with alpha
      case 2: return { backgroundColor: 'rgba(207, 226, 255, 0.7)', color: '#0d6efd' }; // #cfe2ff with alpha
      case 3: return { backgroundColor: 'rgba(169, 201, 255, 0.8)', color: '#0a58ca' }; // #a9c9ff with alpha
      case 4: return { backgroundColor: 'rgba(140, 182, 245, 0.9)', color: '#03285c' }; // #8cb6f5 with alpha
      case 5: return { backgroundColor: 'rgba(140, 182, 245, 1)',   color: '#03285c' }; // #8cb6f5 opaque for max emphasis
      default: return { backgroundColor: 'rgba(233, 236, 239, 0.6)', color: '#6c757d' }; // Fallback
    }
  };

  const customRenderer = (tag, size) => {
    const style = getStyleByWeight(tag.count);
    return (
      <span
        key={tag.value}
        className="skill-tag"
        style={{
          fontSize: `${size}px`,
          fontWeight: tag.count > 4 ? 600 : 400, // Bold only for the highest level
          ...style // Apply background and text color
        }}
      >
        {tag.value}
      </span>
    );
  };

  return (
    <aside className="bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h4 className="h5"><strong>Competenze Manageriali</strong></h4>
        <TagCloud minSize={12} maxSize={22} tags={mapSkills(skills.filter(s => s.category === 'managerial'))} renderer={customRenderer} />
      </div>
      <div className="mb-4">
        <h4 className="h5"><strong>Competenze Tecniche</strong></h4>
        <TagCloud minSize={12} maxSize={22} tags={mapSkills(skills.filter(s => s.category === 'technical'))} renderer={customRenderer} />
      </div>
      <div>
        <h4 className="h5"><strong>Competenze Personali</strong></h4>
        <TagCloud minSize={12} maxSize={22} tags={mapSkills(skills.filter(s => s.category === 'personal'))} renderer={customRenderer} />
      </div>
    </aside>
  );
};

const Header = ({ profile }) => (
  <header className="app-header bg-white shadow-sm py-3">
    <div className="container-fluid d-flex justify-content-between align-items-center">
      <h1 className="h4 mb-0"><strong>CV di {profile?.full_name || 'Claudio Rava'}</strong></h1>
      <div>
        <a href={profile?.cv_url || '/CV Claudio Rava.pdf'} download className="btn btn-primary me-2 interactive-lift">Download CV</a>
        <a href={`mailto:${profile?.contact_email || ''}`} className="btn btn-outline-secondary interactive-lift">Contattami</a>
      </div>
    </div>
  </header>
);

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState({ profile: true, experiences: true, skills: true });
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, experiencesRes, skillsRes] = await Promise.all([
          supabase.from('profile').select('*').single(),
          supabase.from('experiences').select('*').order('order', { ascending: true }),
          supabase.from('skills').select('*')
        ]);

        if (profileRes.error) throw profileRes.error;
        if (experiencesRes.error) throw experiencesRes.error;
        if (skillsRes.error) throw skillsRes.error;

        setProfile(profileRes.data);
        setExperiences(experiencesRes.data);
        setSkills(skillsRes.data);

      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading({ profile: false, experiences: false, skills: false });
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (experience) => {
    setSelectedExperience(experience);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExperience(null);
  };

  return (
    <div className="app-container bg-light">
      <Header contactEmail={profile?.contact_email || ''} />
      <div className="main-content-area container-fluid">
        <div className="row gx-4 flex-grow-1">
          <div className="col-lg-3 scrollable-column">
            <ProfileCard profile={profile} loading={loading.profile} />
          </div>
          <div className="col-lg-6 scrollable-column">
            <TimelineContainer experiences={experiences} loading={loading.experiences} onExperienceSelected={handleShowModal} />
          </div>
          <div className="col-lg-3 scrollable-column">
            <SkillsCloud skills={skills} loading={loading.skills} />
          </div>
        </div>
      </div>
      <ExperienceDetailModal
        experience={selectedExperience}
        show={showModal}
        onHide={handleCloseModal}
      />
    </div>
  );
}