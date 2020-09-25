import React from 'react';
import { Link } from '@reach/router';

import Content from 'images/undraw_sharing_articles_t5aa.svg';
import childReading from 'images/child_reading.jpg';
import Logo from 'images/clubstack_logo.png';

import { HiCheck } from 'react-icons/hi';
import { GiLightningArc, GiBubbles } from 'react-icons/gi';
import { RiVideoChatFill, RiVideoDownloadFill } from 'react-icons/ri';
import { IoMdChatbubbles } from 'react-icons/io';
// import { Md } from 'react-icons/md';

import GoogleDriveLogo from 'images/google-drive.svg';
import ZoomLogo from 'images/zoom-communications-logo.svg';
import Slack from 'images/slack-2.svg';

import VideoCard from 'components/videoCard';

import { UserProfile } from 'pages/account/userProfile';

function LandingPage() {
  return (
    <React.Fragment>
      <div className="container">
        {/* Hero */}
        <section className="hero-grid">
          <div className="swap-order">
            <div className="panel">
              <form action="">
                <legend>Generate Preview</legend>
                <div className="form-group">
                  <label htmlFor="">Substack URL</label>
                  <input type="text" name="" id="" className="form-control" />
                </div>

                <button className="btn btn-theme">
                  <GiLightningArc /> Generate <GiLightningArc />
                </button>
              </form>
            </div>
          </div>

          <div className="title-container">
            <div>
              {/* <span className="highlight">
                  Welcome to Position&#8201;Paper!
                </span> */}
            </div>

            <img className="hero-pic" src={Logo} alt="doctors" height="300px" />
            {/* 
            <h1>
              ClubStack <br /> (dot) PARTY
            </h1> */}

            {/* <p>Turn your SubStack into a Club</p> */}
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}

export default LandingPage;

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
