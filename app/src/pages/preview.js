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

  const [hero, setHero] = useState(null);
  const [content, setContent] = useState(null);
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
          setHero({
            title: body.title,
            description: body.description,
            img: body.headerImage,
            copyright: body.copyright,
          });

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
      {!subdomain ? <Hero /> : null}

      {loading ? (
        <div style={{ marginTop: '20vh' }}>
          <Loading />
        </div>
      ) : null}

      {error ? (
        <p style={{ textAlign: 'center', fontFamily: 'monospace' }}>{error}</p>
      ) : null}

      {content ? (
        <React.Fragment>
          {/* Hero */}
          <ContentHero {...hero} />

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

              <div className="grid  tool-grid">
                <div className="tool-grid-item">
                  <div className="icon-large">
                    <BsFillChatDotsFill />
                  </div>
                  Live Chat
                </div>

                <div className="tool-grid-item">
                  <div className="icon-large">
                    <CgFeed />
                  </div>
                  Activity Feed
                </div>

                <div className="tool-grid-item">
                  <div className="icon-large">
                    <MdEmail />
                  </div>
                  Weekly Newsletter
                </div>

                <div className="tool-grid-item">
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
                  <p>
                    <i>~ Jim Collins</i>
                  </p>
                </div>

                <div>
                  <div className="panel">
                    <SubscribePage
                      caption="Join Free for 7 Days"
                      title={hero.title}
                      priceId={productCode}
                      subdomain={subdomain}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section>
            <div className="container">
              <div className="section-title">
                <h2>Latest Content</h2>
              </div>

              <div className="skill-section">
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

function Hero() {
  return (
    <div className="container">
      <h1 className="hero">
        <span className="">Club</span>Stack <br />{' '}
        <span className="sub">( dot )</span> <span className="sub">PARTY</span>
      </h1>
      <p class="" style={{ textAlign: 'center' }}>
        User-Generated Communities
      </p>
    </div>
  );
}

function ContentHero({ img, title, desc, copyright }) {
  return (
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
  );
}
