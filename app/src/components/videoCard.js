import React from 'react';
import { Link } from '@reach/router';

import 'css/videoCard.scss';

import { BiChevronRight } from 'react-icons/bi';
import { FaRegClock, FaPlay, FaLock } from 'react-icons/fa';

function VideoCard({
  _id,
  link,
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
  function createMarkup() {
    return { __html: description };
  }

  if (link) {
    return (
      <a
        href={link}
        className="content-card panel"
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

          <p dangerouslySetInnerHTML={createMarkup()} />
        </article>

        {editing ? (
          <div>
            <Link
              to={'/website/content/' + _id}
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
      </a>
    );
  } else {
    return (
      <div className="content-card panel">
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

          <p dangerouslySetInnerHTML={createMarkup()} />
        </article>

        {editing ? (
          <div>
            <Link
              to={'/website/content/' + _id}
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
}

export default VideoCard;
