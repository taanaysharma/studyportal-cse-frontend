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
  // Controls the cross-fade: skeleton stays mounted but fades out
  // while FileViewer fades in on top of it.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const fetchMaterial = async () => {
      setLoading(true);
      setRevealed(false);
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

  // Once material is ready, trigger the cross-fade on next paint
  useEffect(() => {
    if (!loading && material) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setRevealed(true));
      });
    }
  }, [loading, material]);

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

  if (error) {
    return (
      <div className="material-detail-page">
        <div className="material-detail-page-error message-box error">{error}</div>
      </div>
    );
  }

  return (
    <div className="material-detail-page">
      {/* Skeleton sits underneath, fades out once content is ready */}
      <div
        className="mdp-layer"
        style={{
          opacity: revealed ? 0 : 1,
          transition: 'opacity 0.35s ease',
          pointerEvents: revealed ? 'none' : 'auto',
        }}
      >
        <MaterialDetailSkeleton type={material?.fileType === 'Image' ? 'image' : 'pdf'} />
      </div>

      {/* FileViewer fades in over the skeleton */}
      {material && (
        <div
          className="mdp-layer"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.35s ease',
            pointerEvents: revealed ? 'auto' : 'none',
          }}
        >
          <FileViewer
            file={material}
            onClose={handleCloseViewer}
            apiUrl={API_URL}
            token={token}
          />
        </div>
      )}
    </div>
  );
};

export default MaterialDetailPage;
