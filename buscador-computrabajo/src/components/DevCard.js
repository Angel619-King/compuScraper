import React from 'react';
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';
import './DevCard.css';

const DevCard = ({ nombre, puesto, foto, github, linkedin, facebook }) => {
  return (
    <div className="dev-card">
      <img src={foto} alt={nombre} className="dev-foto" />
      <h3>{nombre}</h3>
      <p>{puesto}</p>
      <div className="dev-links">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="github">
            <FaGithub /> GitHub
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="linkedin">
            <FaLinkedin /> LinkedIn
          </a>
        )}
        {facebook && (
          <a href={facebook} target="_blank" rel="noopener noreferrer" className="facebook">
            <FaFacebook /> Facebook
          </a>
        )}
      </div>
    </div>
  );
};

export default DevCard;
