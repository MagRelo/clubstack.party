import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { BiBookAdd, BiChevronRight } from 'react-icons/bi';

import { AuthContext } from 'App';

import { Loading } from 'components/random';
// import { BiBookAdd, BiChevronRight } from 'react-icons/bi';

function Content({ contentId }) {
  const { callApi, user } = useContext(AuthContext);

  const editingContent = !!contentId;
  // console.log('editing', editingContent);

  const [loading, setLoading] = useState(editingContent);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const method = 'GET';
    const endPoint = '/api/content/' + contentId;

    if (editingContent) {
      setLoading(true);
      callApi(method, endPoint)
        .then((body) => {
          setContent(body);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.toString());
          setLoading(false);
        });
    }
  }, [callApi, contentId, editingContent]);

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h2>{editingContent ? 'Update' : 'Add'} Content</h2>
          <p>
            <Link to="/account">Account</Link> <BiChevronRight />{' '}
            <Link to="/account/content">Content</Link> <BiChevronRight />{' '}
            <u>{editingContent ? 'Update' : 'Add'}</u>
          </p>
          <UpdateContent editingContent={editingContent} content={content} />
        </div>
      )}
    </div>
  );
}

export default Content;

function UpdateContent({ editingContent, content }) {
  const { callApi, user } = useContext(AuthContext);

  const [title, setTitle] = useState(content?.title || '');
  const [description, setDescription] = useState(content?.description || '');
  const [image, setImage] = useState(content?.image || '');
  const [alt, setAlt] = useState(content?.alt || '');
  const [category, setCategory] = useState(content?.category || '');

  async function submit(event) {
    event.preventDefault();

    // get form data
    const formObject = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    // console.log(formObject);

    // send to server
    let method = '';
    let endpoint = '/api/content';
    if (editingContent) {
      // update
      method = 'PUT';
      formObject._id = content._id;
    } else {
      // add
      method = 'POST';
    }

    await callApi(method, endpoint, formObject)
      .then(async (user) => {
        // createSession(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="form-wrapper">
        <form name="updateContent" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="displayName" className="">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="caption" className="">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar" className="">
              Image
            </label>
            <input
              type="text"
              name="image"
              id="image"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="">
              Image Alt Text
            </label>
            <input
              type="text"
              name="alt"
              id="alt"
              className="form-control"
              value={alt}
              onChange={(e) => {
                setAlt(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="publicAddress" className="">
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              className="form-control"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            />
          </div>

          <hr />
          <button className="btn btn-theme">Save</button>
        </form>
      </div>
    </div>
  );
}
