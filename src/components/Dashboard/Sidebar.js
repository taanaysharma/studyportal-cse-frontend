import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import {
  FaHome, FaBook, FaBullhorn, FaCommentDots, FaSignOutAlt,
  FaSun, FaMoon, FaUserShield, FaGraduationCap, FaLightbulb,
  FaUpload, FaHeadset   // NEW icons
} from 'react-icons/fa';
import './Sidebar.scss';

// NEW: Accept handleShowContribute and handleShowSupport as props
const Sidebar = ({
  isOpen,
  toggleSidebar,
  handleShowStudyMaterials,
  handleShowAnnouncements,
  handleShowFeedback,
  handleShowContribute,   // NEW
  handleShowSupport       // NEW
}) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const go = (handler) => {
    handler();
    toggleSidebar();
    navigate('/dashboard');
  };

  const onAdminPanelClick = () => { toggleSidebar(); navigate('/admin'); };
  const onSyllabusViewClick = () => { toggleSidebar(); navigate('/syllabus-view', { state: { previousView: 'announcements' } }); };
  const onGuidelinesViewClick = () => { toggleSidebar(); navigate('/guidelines-view', { state: { previousView: 'announcements' } }); };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <center><h3>SPARK ECE</h3></center>
        <button className="close-btn" onClick={toggleSidebar}>&times;</button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard" onClick={() => go(handleShowStudyMaterials)}>
              <FaHome className="nav-icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={() => go(handleShowStudyMaterials)}>
              <FaBook className="nav-icon" /> Study Materials
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={() => go(handleShowAnnouncements)}>
              <FaBullhorn className="nav-icon" /> Announcements
            </Link>
          </li>

          {/* NEW: Contribute link */}
          <li>
            <Link to="/dashboard" onClick={() => go(handleShowContribute)}>
              <FaUpload className="nav-icon" /> Contribute
            </Link>
          </li>

          {/* NEW: Support Chat link */}
          <li>
            <Link to="/dashboard" onClick={() => go(handleShowSupport)}>
              <FaHeadset className="nav-icon" /> Support
            </Link>
          </li>

          {user && user.isAdmin && (
            <li>
              <Link to="/admin" onClick={onAdminPanelClick}>
                <FaUserShield className="nav-icon" /> Admin Panel
              </Link>
            </li>
          )}
          <li>
            <Link to="/syllabus-view" onClick={onSyllabusViewClick}>
              <FaGraduationCap className="nav-icon" /> Syllabus
            </Link>
          </li>
          <li>
            <Link to="/guidelines-view" onClick={onGuidelinesViewClick}>
              <FaLightbulb className="nav-icon" /> Academic Guidelines
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="nav-icon" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
