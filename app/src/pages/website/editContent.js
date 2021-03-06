import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { createEditorState, Editor } from 'medium-draft';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import 'medium-draft/lib/index.css';
import { convertToRaw } from 'draft-js';

import { BiChevronRight } from 'react-icons/bi';

import { AuthContext } from 'App';
import { Loading } from 'components/random';
import { FormStatusButtons } from 'components/random';

function Content({ contentId }) {
  const { callApi } = useContext(AuthContext);

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
            <Link to="/website">Publishing</Link> <BiChevronRight />{' '}
            <Link to="/website/content">Content</Link> <BiChevronRight />{' '}
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
  const { callApi } = useContext(AuthContext);

  // form state
  const [formDirty, setFormDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // post content
  const [editorState, setEditorState] = useState(
    createEditorState(content?.rawState)
  );
  const refsEditor = React.createRef();

  const [{ title, description, image, alt }, setState] = useState(
    content || {
      title: '',
      description: '',
      image: '',
      alt: '',
    }
  );

  const [category, setCategory] = useState(content?.category);
  const categories = ['Blogpost', 'Content'];
  const Add = categories.map((Add) => Add);
  const handleAddrTypeChange = (e) => {
    // console.log(categories[e.target.value]);
    setFormDirty(true);
    setCategory(categories[e.target.value]);
  };

  const editorChange = (e) => {
    setFormDirty(true);
    setEditorState(e);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormDirty(true);
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    // get form data
    const formObject = {
      title,
      description,
      image,
      alt,
      category,
      rawState: convertToRaw(editorState.getCurrentContent()),
      renderedHtml: mediumDraftExporter(editorState.getCurrentContent()),
    };
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

    // TEST
    // console.log(formObject);
    // setLoading(false);
    // TEST

    await callApi(method, endpoint, formObject)
      .then(async (user) => {
        // navigate('/website');
        setLoading(false);
        setFormDirty(false);
        setSuccessMessage('Saved!');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setFormDirty(false);
        setErrorMessage(error.toString());
      });
  }

  // Reset/Cancel => set form data to user data, reset all indicators
  function reset(event) {
    event.preventDefault();

    // set form data
    setState({ ...content });

    // reset indicators
    setLoading(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFormDirty(false);
  }

  return (
    <form name="updateContent" onSubmit={submit}>
      <div className="grid grid-3-5">
        <div>
          <div className="panel">
            <div className="form-group">
              <label htmlFor="category" className="">
                Category
              </label>
              <select
                onChange={(e) => handleAddrTypeChange(e)}
                className="browser-default custom-select"
              >
                {Add.map((address, key) => (
                  <option value={key}>{address}</option>
                ))}
              </select>

              {/* 
            <input
              type="text"
              name="category"
              id="category"
              className="form-control"
              value={category}
              onChange={onChange}
            /> */}
            </div>

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
                onChange={onChange}
              />
            </div>
            {/* <div className="form-group">
              <label htmlFor="caption" className="">
                Description
              </label>
              <textarea
                type="text"
                name="description"
                id="description"
                className="form-control"
                value={description}
                onChange={onChange}
              />
            </div> */}
          </div>
        </div>
        <div>
          <label htmlFor="editor" className="sr-only">
            Post Content
          </label>
          <Editor
            name="editor"
            ref={refsEditor}
            editorState={editorState}
            onChange={editorChange}
            sideButtons={[]}
            placeholder="Add content here! (highlight text to format)"
          />
        </div>
      </div>

      <hr />

      <FormStatusButtons
        saveFunction={submit}
        resetFunction={reset}
        isDirty={formDirty}
        isLoading={loading}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </form>
  );
}
