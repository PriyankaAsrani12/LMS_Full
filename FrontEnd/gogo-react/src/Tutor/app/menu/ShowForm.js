import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import axiosInstance from '../../../helpers/axiosInstance';
import { NotificationManager } from '../../../components/common/react-notifications';
import ShortUrlRedirector from './ShortUrlRedirector';

const ShowForm = () => {
  const [shortUrl, setShortUrl] = useState('');
  const [fullUrl, setFullUrl] = useState('');
  const [showComponent, setShowComponent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      NotificationManager.warning(
        error,
        'Get Url Track Error',
        3000,
        null,
        null,
        ''
      );
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      linkName: document.getElementById('linkname').value,
      full: document.getElementById('fullurl').value,
      custom: document.getElementById('custom').value,
    };
    axiosInstance
      .post('/shorturl/genShort', { values })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setShortUrl(response.data.shortUrl);
          setFullUrl(response.data.fullUrl);
        } else setError(response.data.error);
      })
      .catch((err) => {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('Could not get utl...tey again');
        }
      });
  };

  if (showComponent)
    return (
      <>
        <ShortUrlRedirector fullUrl={fullUrl} />
      </>
    );
  return (
    <>
      <h1 style={{ marginLeft: '40%', marginRight: 'auto' }}>Shortened Url </h1>

      <div
        style={{
          display: 'flex',
          // marginTop: '3%',
          marginLeft: '3%',
          marginBottom: '3%',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label>Link Name</Label>
            <Input
              type="text"
              name="linkname"
              id="linkname"
              placeholder="Enter Link Name"
              required
            />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label>Full Url</Label>
            <Input
              type="text"
              name="fullurl"
              id="fullurl"
              placeholder="Enter Url To Be Tracked"
              required
            />
          </FormGroup>

          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label>Custom Url you want</Label>
            <Input
              type="text"
              name="custom"
              id="custom"
              placeholder="Enter custom url "
            />
          </FormGroup>

          <Button>Submit</Button>
        </Form>

        {shortUrl ? `https://tracking.oyesters.in/new.html?${shortUrl}` : ''}

        {/* {shortUrl ? (
          <Button onClick={() => setShowComponent(!showComponent)}>
            https://tracking.oyesters.in/new.html?{shortUrl}
          </Button>
        ) : null} */}

        {/* <div>
                <Button onClick={() => setShowComponent(!showComponent)}>
                  {shortUrl}
                </Button>
                {showComponent ? (
                  <ShortUrlRedirector fullUrl={fullUrl} />
                ) : null}
              </div> */}
      </div>
    </>
  );
};

// export default ShowForm;

const ModalExample = ({ toggle, setShortUrl, setError, toggleReload }) => {
  const [fullUrl, setFullUrl] = useState('');
  const [showComponent, setShowComponent] = useState(false);
  //   const [error, setError] = useState('');

  //   useEffect(() => {
  //     if (error) {
  //       NotificationManager.warning(
  //         error,
  //         'Get Url Track Error',
  //         3000,
  //         null,
  //         null,
  //         ''
  //       );
  //     }
  //   }, [error]);

  const handleSubmit = () => {
    toggle();
    const values = {
      linkName: document.getElementById('linkname').value,
      full: document.getElementById('fullurl').value,
      custom: document.getElementById('custom').value,
    };
    axiosInstance
      .post('/tutor/shorturl/genShort', { values })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setShortUrl(response.data.shortUrl);
          setFullUrl(response.data.fullUrl);
          toggleReload();
        } else setError(response.data.error);
      })
      .catch((err) => {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('Could not get utl...tey again');
        }
      });
  };

  if (showComponent)
    return (
      <>
        <ShortUrlRedirector fullUrl={fullUrl} />
      </>
    );

  return (
    <>
      {/* <Button color="danger" onClick={toggle}>
        {buttonLabel}
      </Button> */}
      {/* <Modal isOpen={modal} toggle={toggle} className={className}> */}
      <ModalHeader toggle={toggle}>Url Tracker</ModalHeader>
      <ModalBody>
        {/* <Form onSubmit={handleSubmit}> */}
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label>Link Name</Label>
          <Input
            type="text"
            name="linkname"
            id="linkname"
            placeholder="Enter Link Name"
            required
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label>Full Url</Label>
          <Input
            type="text"
            name="fullurl"
            id="fullurl"
            placeholder="Enter Url To Be Tracked"
            required
          />
        </FormGroup>

        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label>Custom Url you want</Label>
          <Input
            type="text"
            name="custom"
            id="custom"
            placeholder="Enter custom url "
          />
        </FormGroup>

        {/* </Form> */}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
      {/* </Modal> */}
    </>
  );
};

export default ModalExample;
