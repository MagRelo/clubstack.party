import React from 'react';

import 'css/videoCard.scss';

import { FaRegClock } from 'react-icons/fa';
// const [menuOpen, setMenuOpen] = useState(false);
function createMarkup(description) {
  return { __html: description };
}

export default function ContentCard({
  title,
  category,
  length,
  description,
  image,
  alt,
}) {
  return (
    <div
      className="panel content-card"
      style={{ display: 'grid', gridTemplateRows: 'auto 1fr' }}
    >
      <aside>
        <img
          src={image || 'https://picsum.photos/325/175'}
          alt={alt}
          height="175px"
        />
        <div className="mb-3"></div>
      </aside>

      <article style={{ maxHeight: '175px', overflow: 'hidden' }}>
        <div className="h3 title">{title}</div>

        {category ? (
          <div className="category">
            <span>{category}</span>

            {length ? (
              <span style={{ float: 'right' }}>
                <FaRegClock /> <span>{length}</span>
              </span>
            ) : null}
          </div>
        ) : null}

        <p dangerouslySetInnerHTML={createMarkup(description)} />
      </article>
    </div>
  );
}
