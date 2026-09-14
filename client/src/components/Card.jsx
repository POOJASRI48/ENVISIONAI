import React from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';

const Card = ({ _id, name = 'Creator', prompt = '', photo }) => {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || 'C';

  return (
    <article className="im-card">
      <img src={photo} alt={prompt} loading="lazy" />

      <div className="im-card-overlay">
        <p className="im-card-prompt">{prompt}</p>

        <div className="im-card-bottom">
          <div className="im-author">
            <div className="im-avatar">{initial}</div>
            <span className="im-author-name">{name}</span>
          </div>

          <button
            type="button"
            className="im-download"
            onClick={() => downloadImage(_id, photo)}
            aria-label={`Download image by ${name}`}
          >
            <img src={download} alt="" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default Card;
