import React from 'react';
import { Link } from '@reach/router';

import 'css/videoCard.scss';

import { BiBookAdd, BiChevronRight } from 'react-icons/bi';
import { FaRegClock, FaPlay, FaLock } from 'react-icons/fa';

function VideoCard({
  _id,
  title,
  category,
  length,
  description,
  image,
  alt,
  locked,
  active,
  editing,
}) {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="recipe-card panel"
      style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto' }}
    >
      <aside>
        <img src={image} alt={alt} height="175px" />

        {active ? (
          <button href="#" className="btn btn-unstyled button">
            {locked ? <FaLock /> : <FaPlay />}
          </button>
        ) : null}
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

      {editing ? (
        <div>
          <Link
            to={'/admin/content/' + _id}
            className="btn btn-sm btn-unstyled"
            style={{ float: 'right' }}
          >
            Edit{' '}
            <span>
              <BiChevronRight />
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default VideoCard;
