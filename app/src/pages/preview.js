import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from '@reach/router';

// headerimage
import cassette from 'images/cassette_black.jpg';

// resources
import GoogleDriveLogo from 'images/google-drive.svg';
import ZoomLogo from 'images/zoom-communications-logo.svg';
import Slack from 'images/slack-2.svg';

import { getParams, Loading } from 'components/random';
import VideoCard from 'components/videoCard';

import { UserProfile } from 'pages/account/userProfile';

import { AuthContext } from 'App';

function Preview() {
  // getParams

  const { callApi } = useContext(AuthContext);
  const params = getParams(useLocation());
  // console.log(params.substack);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [img, setImg] = useState({});
  const [copyright, setCopyright] = useState({});
  const [podcasts, setPodcasts] = useState({});

  useEffect(() => {
    const method = 'POST';
    const endPoint = '/api/preview/';

    if (params.substack) {
      setError(null);
      setLoading(true);
      callApi(method, endPoint, { url: params.substack })
        .then((body) => {
          setTitle(body.title);
          setDesc(body.description);
          setImg(body.headerImage[0]);
          setCopyright(body.copyright);
          setContent(body.items);
          
          setPodcasts(body.items.filter(item => {item.category === 'Podcast'}));

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.toString());
          setLoading(false);
        });
    }
  }, [callApi, params.substack]);

  return (
    <React.Fragment>
      {error ? <p>{error}</p> : null}
      {loading ? <Loading /> : null}

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

          {/* Frontpage */}
          <section>
            <div className="container">
              <div className="section-title">
                <h2>Latest Content</h2>
                <p>{desc}</p>
              </div>

              <div className="skill-section">
                <h3 className="background">
                  <span>{'section title'}</span>
                </h3>
                <p className="sectionDescription">{'section desc'}</p>
                <div className="grid grid-3">
                  {content &&
                    content.map((item, index) => {
                      return (
                        <VideoCard
                          key={index}
                          title={item.title}
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

          {/* Join Now */}
          <section>
            <div className="container">
              <div className="section-title">
                <h2>Join The Community</h2>
                <p>
                  Join <b>242</b> other people connecting around <br />
                  <b>{title}</b>
                </p>
              </div>

              <div className="mb-4"></div>

              <h3 className="background">
                <span>Community Tools</span>
              </h3>

              <div className="mb-4"></div>

              <div className="grid grid-3" style={{ margin: '60px 0' }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <img src={ZoomLogo} alt="zoom" height="28px" />
                  </div>
                </div>

                <div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    <img src={Slack} alt="google" height="28px" />{' '}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <div>
                      <img src={GoogleDriveLogo} alt="google" height="28px" />{' '}
                      <b>Google Drive</b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4"></div>

              <h3 className="background">
                <span>Join Now</span>
              </h3>

              <div className="mb-4"></div>

              <div className="grid grid-2">
                <div
                  style={{
                    textAlign: 'right',
                    borderRight: 'solid 2px lightgray',
                    paddingRight: '1.5rem',
                  }}
                >
                  <p>
                    <i>
                      "The most important thing to remember is to stay{' '}
                      <b>motivated and optimistic!</b> We've built a community
                      of parents & teachers to share our successes and our
                      challenges, ask questions, and support each other during
                      this difficult time."
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
                  <a href="/subscribe" className="btn btn-theme">
                    Join Free for 7 Days
                  </a>
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
