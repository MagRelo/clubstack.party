import React from 'react';
// import { Link, globalHistory } from '@reach/router';

import 'css/videoCard.scss';

// import { GiHeartPlus } from 'react-icons/gi';
import { FaRegClock, FaPlay, FaLock } from 'react-icons/fa';

function VideoCard({
  title,
  category,
  length,
  description,
  image,
  alt,
  locked,
}) {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="recipe-card panel">
      <aside>
        <img src={image} alt={alt} />

        <button href="#" className="btn btn-unstyled button">
          {locked ? <FaLock /> : <FaPlay />}
        </button>
      </aside>

      <article>
        <div className="h3 title">{title}</div>

        <div className="category">
          <span>{category}</span>
          <span style={{ float: 'right' }}>
            <FaRegClock /> <span>{length}</span>
          </span>
        </div>

        <p>{description}</p>
      </article>
    </div>
  );
}

export default VideoCard;
