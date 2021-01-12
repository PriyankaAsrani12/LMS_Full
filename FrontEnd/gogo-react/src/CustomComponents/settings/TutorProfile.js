import React, { useState, useEffect } from 'react';
import { Card, Row, Input, Button, Form, Col } from 'reactstrap';
import { FiUpload } from 'react-icons/fi';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';
import Loader from './Loader';

const TutorProfile = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(
        error,
        'User Profile Details',
        3000,
        null,
        null,
        ''
      );
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        success,
        'User Profile Details',
        3000,
        null,
        null,
        ''
      );
      setSuccess(null);
    }
  }, [success]);

  const [userProfile, setUserProfile] = useState({
    customer_profile_picture: '',
    customer_subdomain_name: '',
    customer_institute_name: '',
    customer_about_me: '',
    customer_career_summary: '',
    customer_role: '',
    customer_linkedin_url: '',
    customer_occupation: '',
    customer_facebook_url: '',
    customer_website_url: '',
    customer_twitter_url: '',
  });

  const [displayProfileImage, setDisplayProfileImage] = useState(null);

  const handleUserProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleUserProfileSubmit = async (e) => {
    e.preventDefault();
    console.log(editorState);
    const values = userProfile;
    values.customer_career_summary = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    console.log(values);
    try {
      const formData = new FormData();
      formData.append('profile_picture', userProfile.customer_profile_picture);
      formData.append('values', JSON.stringify(values));
      const result = await axiosInstance.put('/tutor/users', formData);
      console.log(result);
      if (result.data.success) {
        setSuccess('Profile Updated Scuuessfully');
        setUserProfile(result.data.user);
      } else {
        if (result.data.error) setError(result.data.error);
        else setError('could not update details');
      }
    } catch (err) {
      console.log(err);
      try {
        setError(err.response.data.error);
      } catch (error) {
        setError('could not update details');
      }
    }
  };

  const onEditorStateChange = (editorState) => setEditorState(editorState);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoaded(false);
        const result = await axiosInstance.get('/tutor/user');
        console.log(result);
        if (result.data.success) {
          try {
            const blocksFromHTML = convertFromHTML(
              result.data.user.customer_career_summary
            );
            const state = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );

            setEditorState(EditorState.createWithContent(state));
          } catch (e) {
            setEditorState(EditorState.createEmpty());
          }

          setUserProfile(result.data.user);
        } else {
          if (result.data.error) setError(result.data.error);
          else setError('could not fetch details');
        }
      } catch (err) {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('could not fetch details');
        }
      } finally {
        setIsLoaded(true);
      }
    };
    getUser();
  }, []);

  if (!isLoaded) return <Loader />;
  return (
    <Row className="p-4">
      <Form onSubmit={handleUserProfileSubmit}>
        <div className="mx-4">
          <Card body>
            <Row>
              <Col md={6} className="pl-4">
                <Row className="ml-1">
                  {' '}
                  <img
                    src={displayProfileImage}
                    style={{ width: '20%', marginLeft: '10px' }}
                  />
                  <label className="mr-auto ml-4">
                    <input
                      type="file"
                      name="customer_profile_picture"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        console.log(e.target.files[0]);
                        const file = URL.createObjectURL(e.target.files[0]);
                        const currentImage = e.target.files[0];
                        console.log(
                          currentImage.name.substr(
                            currentImage.name.lastIndexOf('.') + 1
                          )
                        );
                        if (
                          currentImage.type != 'image/jpg' &&
                          currentImage.type != 'image/jpeg' &&
                          currentImage.type != 'image/png' &&
                          currentImage.type != 'image/webp'
                        )
                          setError(
                            'only jpg,jpeg,png,webp formats are allowed'
                          );
                        else {
                          setUserProfile((prevState) => ({
                            ...prevState,
                            ['customer_profile_picture']: currentImage,
                          }));
                          setDisplayProfileImage(file);
                        }
                      }}
                    />
                    <FiUpload
                      className="text-center "
                      style={{ marginLeft: '50px' }}
                    />
                    <p id="ufd">Upload from device</p>
                  </label>
                </Row>
                <label className="mt-5">SubDomain Name</label>
                <Input
                  type="text"
                  name="customer_subdomain_name"
                  value={userProfile.customer_subdomain_name}
                  onChange={handleUserProfileChange}
                  placeholder="Subdomain Name"
                />
              </Col>
              <Col md={6} className="pr-4">
                <label className="mt-4">Organization Name</label>
                <Input
                  type="text"
                  placeholder="Organization Name"
                  name="customer_institute_name"
                  value={userProfile.customer_institute_name}
                  onChange={handleUserProfileChange}
                />
                <label className="mt-4">About me</label>
                <Input
                  type="text"
                  name="customer_about_me"
                  onChange={handleUserProfileChange}
                  value={userProfile.customer_about_me}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label className="mt-4 mx-1">Career Summary</label> <br />
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                  editorStyle={{ height: '150px' }}
                />
                {/* <textarea
                  type="text"
                  name="customer_career_summary"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    height: '300px',
                    width: '100%',
                    maxWidth: '100% !important',
                  }}
                  value={userProfile.customer_career_summary}
                  onChange={handleUserProfileChange}
                  onKeyPress={(e) => (e.key === 'Enter' ? false : true)}
                />
                <p className="mt-2">
                  <b>Note:</b>&nbsp;Please add ',' to separte skills.
                </p> */}
              </Col>
              <Col
                md={6}
                className="mt-3"
                // style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <Row
                  className="mt-5"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Col md={3}>
                    <label>Role</label>
                    <Input
                      type="text"
                      value="Instructor"
                      disabled
                      style={{ width: '170%' }}
                    />

                    <label className="mt-4">Occupation</label>
                    <Input
                      type="text"
                      placeholder="Occupation"
                      name="customer_occupation"
                      value={userProfile.customer_occupation}
                      onChange={handleUserProfileChange}
                      style={{ width: '170%' }}
                    />

                    <label className="mt-4">Website</label>
                    <Input
                      type="text"
                      placeholder="example: www.xyz.com"
                      name="customer_website_url"
                      value={userProfile.customer_website_url}
                      onChange={handleUserProfileChange}
                      style={{ width: '170%' }}
                    />
                  </Col>
                  <Col md={3}>
                    <label className="">LinkedIn</label>
                    <Input
                      type="text"
                      placeholder="Your LinkedIn Account URL"
                      name="customer_linkedin_url"
                      value={userProfile.customer_linkedin_url}
                      onChange={handleUserProfileChange}
                      style={{ width: '170%' }}
                    />
                    <label className="mt-4">Facebook</label>
                    <Input
                      type="text"
                      placeholder="Your Facebook Account URL"
                      name="customer_facebook_url"
                      value={userProfile.customer_facebook_url}
                      onChange={handleUserProfileChange}
                      style={{ width: '170%' }}
                    />
                    <label className="mt-4">Twitter</label>
                    <Input
                      type="text"
                      placeholder="Your Twitter Account URL"
                      name="customer_twitter_url"
                      value={userProfile.customer_twitter_url}
                      onChange={handleUserProfileChange}
                      style={{ width: '170%' }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="">
              <Button
                type="reset"
                className="ml-auto mt-4 mr-2"
                style={{ width: '100px', borderRadius: '0px' }}
              >
                Reset
              </Button>{' '}
              <Button
                type="submit"
                className="mr-auto mt-4 ml-2"
                style={{ width: '100px', borderRadius: '0px' }}
              >
                Submit
              </Button>
            </Row>
          </Card>
        </div>
      </Form>
    </Row>
  );
};
// font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'

export default TutorProfile;
