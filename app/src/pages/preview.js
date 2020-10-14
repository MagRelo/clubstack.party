import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from '@reach/router';

// headerimage
import cassette from 'images/cassette_black.jpg';

// resources
import { BsFillChatDotsFill } from 'react-icons/bs';
import { GoFileSubmodule } from 'react-icons/go';
import { CgFeed } from 'react-icons/cg';
import { MdEmail } from 'react-icons/md';

import { getParams, Loading } from 'components/random';
import VideoCard from 'components/videoCard';

import { UserProfile } from 'pages/account/userProfile';
import SubscribePage from 'pages/subscribe';

import { AuthContext } from 'App';

function Preview() {
  // getParams

  const { callApi } = useContext(AuthContext);
  const params = getParams(useLocation());
  const urlSubdomain = window.location.host.split('.')[2]
    ? window.location.host.split('.')[0]
    : false;
  const subdomain = urlSubdomain || params.substack;

  // console.log('site:', site);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [img, setImg] = useState({});
  const [copyright, setCopyright] = useState({});
  const [productCode, setProductCode] = useState(null);

  useEffect(() => {
    const method = 'POST';
    const endPoint = '/api/preview/';

    if (subdomain) {
      setLoading(true);

      // reset state
      setError(null);
      setContent(null);

      callApi(method, endPoint, { url: subdomain })
        .then((body) => {
          setTitle(body.title);
          setDesc(body.description);
          setImg(body.headerImage[0]);
          setCopyright(body.copyright);
          setContent(body.items);
          setProductCode(body.productCode);

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.toString());
          setLoading(false);
        });
    }
  }, [callApi, subdomain]);

  return (
    <React.Fragment>
      {(!loading && !content && !subdomain) ||
      (!loading && !content && error) ? (
        <div className="container">
          <h1 className="hero">
            <span className="highlight">Club</span>Stack <br />{' '}
            <span className="sub">( dot )</span>{' '}
            <span className="sub">PARTY</span>
          </h1>
          {error ? (
            <p style={{ textAlign: 'center', fontFamily: 'monospace' }}>
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div style={{ marginTop: '20vh' }}>
          <Loading />
        </div>
      ) : null}

      {content ? (
        <React.Fragment>
          {/* Hero */}
          <div className="container">
            <section className="hero-grid">
              <div className="swap-order">
                <img className="hero-pic" src={img.url} alt={img.title} />
              </div>

              <div className="title-container">
                <div>
                  {/* <span className="highlight">
                    Welcome to Position&#8201;Paper!
                  </span> */}
                </div>

                <h1>{title}</h1>

                <p>{desc}</p>

                <div style={{ margin: '0 auto', maxWidth: '26em' }}>
                  <UserProfile
                    displayUser={{
                      _id: 0,
                      displayName: copyright,
                      avatar: img.url,
                      caption: title,
                    }}
                    disableLink={true}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Join Now */}
          <section>
            <div className="container">
              <div className="section-title">
                <h2>Join The Community</h2>
              </div>

              <div className="mb-4"></div>

              <h3 className="background">
                <span>Community Tools</span>
              </h3>
              <div
                className="grid grid-4"
                style={{ padding: '20px 0', textAlign: 'center' }}
              >
                <div>
                  <div className="icon-large">
                    <BsFillChatDotsFill />
                  </div>
                  Private Chat
                </div>
                <div>
                  <div className="icon-large">
                    <MdEmail />
                  </div>
                  Weekly Newsletter
                </div>

                <div>
                  <div className="icon-large">
                    <CgFeed />
                  </div>
                  News Feed
                </div>
                <div>
                  <div className="icon-large">
                    <GoFileSubmodule />
                  </div>
                  File Sharing
                </div>
              </div>

              <div className="mb-4"></div>

              <h3 className="background">
                <span>Join Now</span>
              </h3>

              <div className="mb-4"></div>

              <div className="grid grid-2">
                <div className="quote">
                  <p>
                    <i>
                      “I don't know where we should take this community, but I
                      do know that if I start with the right people, ask them
                      the right questions, and engage them in vigorous debate,
                      we will find a way to make this community great.”
                    </i>
                  </p>

                  <div className="mb-2"></div>
                  <div style={{ maxWidth: '26em', marginLeft: 'auto' }}>
                    <UserProfile
                      displayUser={{
                        _id: 0,
                        displayName: copyright,
                        avatar: img.url,
                        caption: title,
                      }}
                      disableLink={true}
                    />
                  </div>
                </div>

                <div>
                  {/* <p>
                    Join <b>242</b> other people connecting around <br />
                    <b>{title}</b>
                  </p> */}
                  <div className="panel">
                    <SubscribePage
                      caption="Join Free for 7 Days"
                      title={title}
                      priceId={productCode}
                      subdomain={subdomain}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Frontpage */}
          <section>
            <div className="container">
              <div className="section-title">
                <h2>Latest Content</h2>
                <p>{desc}</p>
              </div>

              <div className="skill-section">
                {/* <h3 className="background">
                  <span>{'section title'}</span>
                </h3>
                <p className="sectionDescription">{'section desc'}</p> */}

                <div className="grid grid-3">
                  {content &&
                    content.map((item, index) => {
                      return (
                        <VideoCard
                          key={index}
                          title={item.title}
                          link={item.link}
                          category={item.category}
                          length={item.length}
                          image={
                            item.category === 'Blog Post'
                              ? item.image
                              : cassette
                          }
                          description={item.description}
                          active={item.category === 'Blog Post' ? false : true}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </section>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}

export default Preview;

// const contentData = [
//   {
//     sectionTitle: 'Introduction',
//     sectionDescription: "In this section we'll introduce concepts for things.",
//     sectionData: [
//       {
//         title: 'Phonetic Awareness',
//         category: 'Introduction',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=33',
//         alt: 'video1',
//       },
//       {
//         title: 'Decoding',
//         category: 'Introduction',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=32',
//         alt: 'video1',
//       },
//       {
//         title: 'No Guessing',
//         category: 'Letter Sounds',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=31',
//         alt: 'video1',
//       },
//     ],
//   },
//   {
//     sectionTitle: 'M, A, S, D',
//     sectionDescription:
//       'The first letters should be easy to see and easy to say.',
//     sectionData: [
//       {
//         title: 'First Letters',
//         category: 'M, A, S, D',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=33',
//         alt: 'video1',
//       },
//       {
//         title: 'Blending Sounds',
//         category: 'M, A, S, D',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=32',
//         alt: 'video1',
//       },
//       {
//         title: 'Vowel-First Blending',
//         category: 'M, A, S, D',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=31',
//         alt: 'video1',
//       },
//     ],
//   },
//   {
//     sectionTitle: 'P, B, F, R, T',
//     sectionDescription:
//       "In this section we'll add more letters, and do sound blending with compound words.",
//     sectionData: [
//       {
//         title: 'Video 1',
//         category: 'P, B, F, R, T',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=1',
//         alt: 'video1',
//       },
//       {
//         title: 'Video 2',
//         category: 'P, B, F, R, T',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=2',
//         alt: 'video1',
//       },
//       {
//         title: 'Video 3',
//         category: 'P, B, F, R, T',
//         length: '15 min',
//         description:
//           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
//         image: 'https://picsum.photos/533/300?blur=1&random=3',
//         alt: 'video1',
//       },
//     ],
//   },
// ];
