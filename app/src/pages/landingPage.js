import React from 'react';
import { Link } from '@reach/router';

import Content from 'images/undraw_sharing_articles_t5aa.svg';
import childReading from 'images/child_reading.jpg';

import { HiCheck } from 'react-icons/hi';
import { GiWhiteBook, GiPerspectiveDiceSix } from 'react-icons/gi';
import { RiVideoChatFill, RiVideoDownloadFill } from 'react-icons/ri';
import { IoMdChatbubbles } from 'react-icons/io';
import { MdViewList } from 'react-icons/md';

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
            <img className="hero-pic" src={childReading} alt="doctors" />
          </div>

          <div className="title-container">
            <div>
              {/* <span className="highlight">
                  Welcome to Position&#8201;Paper!
                </span> */}
            </div>

            <h1>
              The Fundamental <br /> Skills of Reading
            </h1>

            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Asperiores ratione autem, quisquam similique modi perspiciatis
              quidem voluptatibus ea accusantium?
            </p>

            <div style={{ margin: '0 auto', maxWidth: '16em' }}>
              <UserProfile
                displayUser={{
                  _id: 0,
                  displayName: 'Margo Healy',
                  avatar:
                    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEBANEBAVDRIbEBUVDQ8QEA4SIB0iIiAdHx8kKDQsJCYxJx8fLTItMSstMDEwIys1OD8uNzQuLi4BCgoKDQ0OFRAPFTAZFyUtKysrKzctNy4wKys3LCsrLS0rLTcrNzc3NSs3Kys3Nys3KzcrLSs3NystLSs3NysrLv/AABEIAMgAyAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgABB//EAEAQAAEEAQIEAwYDBQcCBwAAAAEAAgMRBBIhBTFBURNhcQYiMoGhsUJSkQcUI2LBMzRy0eHw8UNjFRckgoOSo//EABoBAAMBAQEBAAAAAAAAAAAAAAECAwQABQb/xAAoEQACAgICAgECBwEAAAAAAAAAAQIRITEDQRLwUQTREzJCkaHh8QX/2gAMAwEAAhEDEQA/AMRG1MMcIOEo7HCmzRELYxS0KyMbKQakGKSxd4aIbGrmQI2cCNiUnRI0RUq3s3XWEDDCFJyKdGqvDXWGih/JVAK6Ri6PHcURZFWlXRMUvAPOifkArGUOYI+aVyQEiYYoliIYy+W/dellJbKrIKxm6YYsChFF1TCECkk5FIRF2TEqBGmWQEK5qRMpQK5ipkajSFRI1MIwNzUO9GSoRyZCtlelcpLkRRVAUxgSxhTHFKszPFjKEq1UQlFAbJCh6AiYgqI0YxANFblS5XOCiWWuOoo1KdK5kHlaJjgrcj0XWEHhxepAA7lTe+MAtY3W7bldqHEs+NjfeNnsOiQx8TeSatjCe+ku8kL+BaH8zJDQDKFczSqtjdnUT5ghBYee4nm0N7C7TB8pePdI9Df3QyjqB9Iu2OI+aMhkDxpk2PRw/qhDDvvYKIx2dNz3HMqbZ1F7cdzOdEHkRyKmHK+FpbsBqjPMdPkpS41U4btPIrm7Kwl0DSjZD0ipQhilKsgWKmViMDVVJGmFeRdKEM5qYTRoR4TJiNAzl6ukC5EURsR+K6kAxGQrSzOhtG5FxHZK4nkIyOVTaKphjFe0oNjlbrpLQxeVIBUsdask5Adylk6QUERmh7rdR79Ep4vnz8m6T6ClqW4REe3Mjf8AyS//AMOFm+fVTYUrMXjYkkzveBB512XTwlrqBsXvdrWnBOokCqH6BKpcYuedqBdRR88B8AbCxL6UfLZFMZIzcjU3ryDgiuFM8N+l/wAN1f5T2TTKAYeQqtx0ISqVMDiKsfJvZxscvMJiMctAc07dD+X59kvlgY6yNttj+VW8E4vok/d5qBPwE/C/590ZZyhNGlwHB7SapwNSN6sd3RMUA3BFtPMflS12pj2uZ8bR7o2qePq31RrcoDRIw3GQN+lefodilFF/EsTwz3B5FLtlrc3GE8RA2I5eTuyxxaQ4tOxB3RotCdrJeFB6k00oF1rilgswQjmJhKxDOaihWATtXKzKC5OhDNxlFwoKJGwLSZUGxtREbVGAIgpCiLGL0lUB6kHIDF7HI3GZqcwfzBL2FNsIe809NYUuTQ8TTRyDy2FnyVOJBqBJ5k3/AJIKGao33zJKZ8ONgX3UvKx1Ggd2ILqrs2UMOGhtkjmCR+qdtAvz5BUZ/wCEDqCloonbSEBwASduYH3QnEY3aQOrdh6LTCEA/IIDicIc0+lg9kGcY1z3MtwvSPi66f8ARQ4li+MzUw05hB25sPQ+nmmk0VtMgqwKkbXNv5vkl0xdA5rh70R+Ai682+iMZEpRG3AOKHIhAdbZYzTu7ZB19CE6wJQ/WO+oub2dyO3n91jTkDHyGZDCBG+myj8J7GvJPo5/DyGytdcbxuOre4/TceiaROh/wbMAd4Tje3uX1Z/mh/aLEAcJByPP1VfFYtH8RnIe82ux3IRjJW5MFXvWyaL6F07M1KVGEqM1gkHYg7qtr0yRWwqUoZwVt2qpUBhfmuXKjLPNcnSJtiNjUdjMVUbEZE1XbIJBcIV7gqogrwkKJFTmqcbVY1ivbGg2MkVxRWmsNBt9nBCxMq1bM+mE+ijySHishZNtrqXH7hO8QUG/NZ/Hfr01yJBHkVrsXF2orNFNl3QOHbX2H1VUgtzP8KsliLbFg2T1Ci0bg+aN9BS7J5gLdPm37JZkO6dC1wT3iMWpgrmNwsvPmNFAn8W39UZ4Z0VYvxmW4t68vUICdj4tTHN1xk3RGyKlz2MeCOYP6p1LkQzsBFDbcEbpYo6VMwvES10bg00OgNjT/ojeHZWuKMmwTFR7gtP3B+hVnGMFhB0jbmKtR4Hj/wAA6r9yZ2/8pHJV6IuNGwwHifGAHPTXXZIuG5roZXRO2p1geXZF8KeWCVgu2nU307fcIH2lisxZLO9Oqvku6J1kN4xELD28iN/VLQ1MsCUTREda+qDDKNHoqxlg5EmMVc4RICoyAgUE2U1crshq5OmK0JonIqNyCjKKiCsyCGMRRDEJEUVGkY6LWIhjlSwK0NSMYvYOfoqOIfCR5IqEbH6pfxGT4vQKMykBn7JRFwJ5hr9h5glOuOcYdBGC626jTWt+IlL/AGKkaGlt+9qcT6XstJnYMc1CRoIuwd7afJco4GumYHOysljwJg2NzpGtY1zyXkncbffstpwhrjG3WCNtwehV0nBo3G3Oe81QJq/1RccIY2hzrmSSaTyjDoVSl2yHEZfDjsdAsgcQThzyPe1gNs0Af99VqOLgmE+iUcFlABBrd24ICVrJRaMz7Q+zZY+MRObKNYMri8fBW4A6bq/gWI6KYNp7oXNOoG9j3FrdfuvYN8vdCpdhEWSB5bBPJ2tCQik9irL4ewtNADvdWUj4bCB+8M7tB+60ObLTSL5BZnh8/wDHkb0MZ+6kPJYLsCb+JHZ5tc119x/ypubbZIjuCLA7JY2QW7c2HtcP0oo9kwM+nqRqHndpbINAHs9kFri0k7Gj5ppktp3klDW+HlUb0vGx7EcinuXCaBrlzTxeQFDVROVaCh5inHsCnC5RncuRoFmfiR8AQERR2MVpZnQYxERlUNVzApMqgmMogBDw0iQ5IxguEe44+iTZrtvv+ifQN/gvP8wSDLHun1/ooz2UgE+x+Xpyywn4o+Xn/sL6TBuvjEGUYciCXsWav1AP3X2DFkrZGOkN20MGxCkLkDdXtlQ2TIbBDSRe/LZO2hadnTw6oyCsfLccukCx9lr58xgYQSLpYfLy3PmtrHVXPZCTQ8EzcYMtsabBFbFe5L9ki4DM5jQ159PJMsiXZBywHxyZ/i796Cz2KdOR5FhB/UJ9xIW6+yQ1/Gvl0UxpaA3mnH/fIlXSS6ZIH9m0fSyqs1tTEf8Adr5H/lRnJIYOoNf7/wB9VxBh/F2Cw42KILXDfYrQcOInhqxqDav8wWfnAkx7v3mtI6+qM9l59OnfY9ex6Ip1TEaOlsEg8whZSnPHoKdrrY8+wKTPFq4FkBmXK2Ri5dYaMzEUZC9ARouFpWlmZDKOVExG0JDGjYWqTLRLgron7j1VZUoeaQojR48VY7z5/wBFncplA+v9FpQf4BHmEo4hF7n/ALgs8vzDQ0ZWXJbBkRyPAIZE57RpsF4BLdu2ql9L4FlGbHgluy+FhJ7mt/ra+Xe1EdOB/wCyFpP2X8ZBYcRx95lujv8AEwncfI/dOlcQp1I+geIWizsAOalBktdvYr1CtaA4b0Uk49wnU4SMBv8AEATv8uq5IpFKTpsdviifzLD8wkvEpMWP/qRg+oKhiYTXCtMQN/iMor5KHEMV3KJsTRVHQytXzO6dxVWOuNXVmfzvaSJrw2IPlf0a1p+vZa3hTHSQ65Ghrq3AN0kGFwYRuLnUT6LUYUlNI/lU2kLOloScTjAafRZd7x4lef1Wj4rkgNJPmsXi5HiSOI5eJQ86CmFvBZxf+0vf+0j+yhnO0O1bbPZY9QVdxIapAAeb2qnP55HUAMA5dBa6OyMtDOFp8OTTvcWoA9fL9F77MOBZt0NgdkVgNFQDo9jx9Em9l5dD3N83c/su6FrJts5njQkD4gOWyzDAnkeTVG/VKJRufVVg8ASBpAuXPXJwMyMAR8CXxFGROWlmeI2hRDCl8EyKEqm0WQSXKWI4a2/4kI6RdBJTgfNLQ1mvEgMbm/yg/VUZouK/IX+qGxprLRde7RRYFsLTzsX89lleykdGL9r6bJHfwmJoPodr+qA4I4YzXzH+9a4243Zjbt7/ANAGj/EU29tMexE6ubK+YKC4NhRyUH10uuY7FUi8CtZPpns9x1mSyxTZG7SM6sP+SeNNr5dDjmDJhe1zq8QBx5a2HaivoUE5bz3CFpMpTGkcQPRRyIgFGLIHMEKvKyRV2ntUCpWL8gAWUrl4mG3R5IfjfFgLDTZWcDnOvmoSl8FYx+SHtDxEvHhtPfUfJCcLZoDQPM/X/hQmgJdQ6ndMIIevStvMrk8AkgjEgDpC93wt3v5JJmTGRp5W5zyfnsPsUw4nmiOIxtNEjc9fNLsOPUNTuV/RBfIjRoDkaf3Yfkgc53/1KU+z4uV5HIar57KniWaN6NkgACx+i9wX+HFTQdb/AEtGrBQyy+JBrudAdbWQn4u9znFsj6JNDUaQvHp5Gu0En4d9qSpgK0RhRo4sdD0cTl2PiOv/ABL1KWBcmov4r4GsbkXG9AxouJaDwkHRuVrXlDMKua5KyiCA5eayFUHKSARxw2XU5u+/9U7xnlzSRzB3CyWHJpeLJAvc9vNanFymgkuIDjs7s7zWTljTsvB2injnD/3iB7B8bTrj8+4Wb4LF/HAqveF/4bC3MJ5VzHwny7IPJ4QPEE0YIs++3YVuLSweaKxSvIZl4TXROLWj+HjSObXUh5pN8X3mA92gobFI8Fw74hsf/KT/AFXYc+iefGebcx9t2oOjduK9OSpyJVZRrZZkQH8JISnKikNjU79VontS/IZv2KgzoszkmB1KCkbp5XY5LSyxbbi/JL5sDq1zSOncKeh20Kn5DS2i0X3rn/qluRmFl87rqE0zWgCq36nZKG4Zmcd7HW6aEYk2LG5gcSZGFwvbl915lZrzTWNDR27Jhk4Mce2oON7gb7qiPGkJHhNBcTQOx+SqlYviwaDGNgvBPlzc8pr4OkDWBZPvah7jT0B7eRRPBOGyEggjXIHeG5wsOlbzjN8tuSf4eA0mKQ7s/eI26XXriDwdUbu4vkrRh2xlx4M3mcIbNG8Sh1t8IgmtbGONHfqB0WOzuFvx5Hse00JHAOrZ1L6xFhjSyMjnHlQH1adTVnPa3MiGOQ8XJNFjyQjf+0FtefoqtFoKmYOlyk/quSmh4Co0UwoNhV7HLQfOILjcr2uQjCr2FKyiCAVYEK6YN5lDT5pOw2H1SSlRr4fpp8uUsBmTmBmw3P0Crg4pIK1OJb22930S5SClJ2exxfR8cY1Vn0P2XzjkNcAHe4WC+5caATtriNwQ70ItIf2ce7DK6txkaj6MiJH1IWygxGh0YIHu5OO3/wDP/MlD8FSVow80IwlJCiTIrVzFxkHkPdu1fnMc4Sz0PEZFjva6ju07EelI/FwWfwfdBJjymHz32UyNUZH5+GfVpTR46WWL5KL9+f6BsXNBtp2cDTh1BV8jA7cFLuJY51SyMoO/d8eRp7/hcD9F0Ur2ga2lhI5FQnBxA12i2aIjklGZjON9PlSeeJY7ISSipMZGckxDyoHvdofLic0aQAB5bLTx41lD5+JZGy5I50ZeHh73uY1rbcXgADqfM9u60uBwuIRvi1ANa+25BcR/6roG+SJwMYgu3DGeGfEf1jZ1rzPJHYcAe6NxbobpcMOMi9IAJMjh1J6LXxLAdIWmPUzIfQY4Ra5WVTosljgNbfVHZ798p3TxMKQfOrXCQyhhO5fwqYOJO7nAqjimQxkEskjg1p4VE4k1zafuqhvOfcr7A3tHxCPDE0z+UXE2uDRWp+pnIeq+QZGY+eQyP8/DbZIjZd6R+qK9pONv4jkumcCyPbQyyQABVnzNIFxSyZXhh+pkXciP0XqrkK5cM3kKYVcwqhhVzCrnzyCWFXxlDMVwNBLJ0W4oOc1FdnkzrPkh3BWkqqUrNdn1cYKEUl0eBwXoO6rbuPML3oCgFM+j/s6jLsfJFbhkvK97Df6BbiZ273DkcjGc3s7YA16LG/s0c847mNtjxkOMDrOmR2kamFa0Pa4fkikd88TIH2BV4aPI+pzyS990WwOp7P5c+Vp9HAqrEb/dx5ZUZ+pCl4xGp7xuKblsHTtIFEFwIbs6WE649tsiI9R50mIL3+fv+xSHU2F2pjdWE9pLxqZbXdQl/EML+HqEOkjcPgk8SK/NnOvRNixp0BtaHajjOd7zQ8/ExwKBcIneGdHhOMhY5zD4T4ph+Ejlv0StWikWgLhWSJG8xY5ot8dFBy4jxJ4sb4nDXpl1AwvB/mHK/MKTuKRVtIx5/k1y/YLJKFMSUkmHwrp2jckgADckgAepQYynGxHHK4kbOeBDGPlu4/RW4vDySHzv8VwNtbWmJh8m9/Mrkibk3otw4g55LwfAtlAgjxpCaArsOaukldrgLiSRxGRhPkW0F7LKQ191Q8N477SAFdnjSZT+TiMTvQELVBVEqrx77sXYT2xtxXPc1jWtzWPcSAGgWd18k9qfaN+e6KMDTBDGGs53JufeP9Amn7QePeK+TCiIMTM2VznDk++nosrGygubNEYebvr/AH7kmtobLxxB6KRPLsq3EJEaJYIOXKLyuTmdvIXGr2LlyueCgiNSc5cuUOV4PX/5cU5yZHUoPFrlyie50UssE9R1UgeYXi5EQ0nsr7U/ukckL43Ssc7Uwh4a+KUbAhaL/wAx8d1Okxsj321kBpiLXdnDf4guXJlJkuT6eEm2EY/7RMMhr3+OyRnuu1wkjIi7Ei9wj8f2s4e46I8yJpZ72M9+pmnvG6wuXJ02YZ8cVoYQ8TxZ21HNEYpT7wbI1zsWb8wHZRe6/EMwq6jzAPwOHwTD6LlyYRRp17tIhmt2f4m7msAya/6sX4Zm+bdkphkMEmkloaTW3w3V2PIiiPVeLknIsHNJx9+B/AQQCN1fa8XKCMz2VT7h4F/3eXn39xyyX7TPaTwhLix/FPDA5zr+AADb1K5ctK0XXXvuj5c1u5J3J5lTcVy5TPQSSVI5/L57Kpy5ciiUyp5Xq5cmM0tn/9k=',
                  caption: 'Healy Consulting',
                }}
                disableLink={true}
              />
            </div>
          </div>
        </section>
      </div>

      {/* <blockquote>
        Outside of a dog, a book is a girl's best friend.
        <cite>
          <a
            href="https://marginalrevolution.com/marginalrevolution/2012/11/a-bet-is-a-tax-on-bullshit.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alex Tabarrok
          </a>
        </cite>
      </blockquote> */}

      {/* Frontpage */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Essential Reading Skills</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Similique perspiciatis ab perferendis nam aliquid architecto.
            </p>
          </div>

          {contentData.map((section, index) => {
            return (
              <div className="skill-section" key={index}>
                <h3 className="background">
                  <span>{section.sectionTitle}</span>
                </h3>
                <p className="sectionDescription">
                  {section.sectionDescription}
                </p>
                <div className="grid grid-3">
                  {section.sectionData.map((item, index) => {
                    return (
                      <VideoCard
                        key={index}
                        title={item.title}
                        category={item.category}
                        length={item.length}
                        image={item.image}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-title">
            <h2>Join The Community</h2>
            <p>
              Join <b>242</b> other people connecting around <br />
              <b>The Fundamental Skills of Reading</b>
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
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                  <b>motivated and optimistic!</b> We've built a community of
                  parents & teachers to share our successes and our challenges,
                  ask questions, and support each other during this difficult
                  time."
                </i>
              </p>
              <div className="mb-2"></div>
              <div style={{ maxWidth: '16em', marginLeft: 'auto' }}>
                <UserProfile
                  displayUser={{
                    _id: 0,
                    displayName: 'Margo Healy',
                    avatar:
                      'data:image/jpeg;base64,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',
                    caption: 'Healy Consulting',
                  }}
                  disableLink={true}
                />
              </div>
            </div>

            <div>
              <div>
                <b>Coming Up This Week</b>
                <ul>
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                </ul>

                <a href="/subscribe" className="btn btn-theme">
                  Join Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default LandingPage;

const contentData = [
  {
    sectionTitle: 'Introduction',
    sectionDescription: "In this section we'll introduce concepts for things.",
    sectionData: [
      {
        title: 'Phonetic Awareness',
        category: 'Introduction',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=33',
        alt: 'video1',
      },
      {
        title: 'Decoding',
        category: 'Introduction',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=32',
        alt: 'video1',
      },
      {
        title: 'No Guessing',
        category: 'Letter Sounds',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=31',
        alt: 'video1',
      },
    ],
  },
  {
    sectionTitle: 'M, A, S, D',
    sectionDescription:
      'The first letters should be easy to see and easy to say.',
    sectionData: [
      {
        title: 'First Letters',
        category: 'M, A, S, D',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=33',
        alt: 'video1',
      },
      {
        title: 'Blending Sounds',
        category: 'M, A, S, D',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=32',
        alt: 'video1',
      },
      {
        title: 'Vowel-First Blending',
        category: 'M, A, S, D',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=31',
        alt: 'video1',
      },
    ],
  },
  {
    sectionTitle: 'P, B, F, R, T',
    sectionDescription:
      "In this section we'll add more letters, and do sound blending with compound words.",
    sectionData: [
      {
        title: 'Video 1',
        category: 'P, B, F, R, T',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=1',
        alt: 'video1',
      },
      {
        title: 'Video 2',
        category: 'P, B, F, R, T',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=2',
        alt: 'video1',
      },
      {
        title: 'Video 3',
        category: 'P, B, F, R, T',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=3',
        alt: 'video1',
      },
    ],
  },
];
