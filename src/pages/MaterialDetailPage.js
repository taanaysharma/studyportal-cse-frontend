import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileViewer from '../components/Dashboard/FileViewer';
import { MaterialDetailSkeleton } from '../components/Common/Skeleton';
import { AuthContext } from '../context/AuthContext';
import './MaterialDetailPage.scss';

const MaterialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API_URL, token } = useContext(AuthContext);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/materials/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setMaterial(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch material.');
        }
      } catch (err) {
        console.error('Error fetching material:', err);
        setError('Failed to load material. It might not exist or you do not have access.');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchMaterial();
  }, [id, API_URL, token]);

  const handleCloseViewer = () => {
    if (material) {
      navigate('/dashboard', {
        state: {
          previousView: 'materials',
          subject: material.subject,
          category: material.category,
        }
      });
    } else {
      navigate('/dashboard');
    }
  };

  // Show skeleton that matches the file type we're about to display.
  // We don't know the type yet while loading, so default to 'pdf'
  // (which gives the most realistic preview for most materials).
  if (loading) {
    return <MaterialDetailSkeleton type="pdf" />;
  }

  if (error) {
    return (
      <div className="material-detail-page">
        <div className="material-detail-page-error message-box error">{error}</div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="material-detail-page">
        <div className="material-detail-page-info message-box info">Material not found.</div>
      </div>
    );
  }

  return (
    <div className="material-detail-page">
      <FileViewer file={material} onClose={handleCloseViewer} apiUrl={API_URL} token={token} />
    </div>
  );
};

export default MaterialDetailPage;
