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
import logo from './user.png';

const TutorProfile = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const filePath = process.env.REACT_APP_FILE_UPLOAD_PATH_CLIENT;

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
    customer_experience: '',
    customer_role: '',
    customer_linkedin_url: '',
    customer_occupation: '',
    customer_facebook_url: '',
    customer_website_url: '',
    customer_twitter_url: '',
  });

  const [displayProfileImage, setDisplayProfileImage] = useState(logo);

  const handleReset = () =>
    setUserProfile({
      customer_profile_picture: '',
      customer_institute_name: '',
      customer_about_me: '',
      customer_career_summary: '',
      customer_experience: '',
      customer_role: '',
      customer_linkedin_url: '',
      customer_occupation: '',
      customer_facebook_url: '',
      customer_website_url: '',
      customer_twitter_url: '',
    });

  const handleUserProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());

  const handleUserProfileSubmit = async (e) => {
    e.preventDefault();
    console.log(editorState);
    const values = userProfile;
    values.customer_career_summary = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    values.customer_experience = draftToHtml(
      convertToRaw(editorState2.getCurrentContent())
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
  const onEditorStateChange2 = (editorState) => setEditorState2(editorState);

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

          try {
            const blocksFromHTML = convertFromHTML(
              result.data.user.customer_experience
            );
            const state = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );

            setEditorState2(EditorState.createWithContent(state));
          } catch (e) {
            setEditorState2(EditorState.createEmpty());
          }

          if (result.data.user.customer_profile_picture)
            setDisplayProfileImage(result.data.user.customer_profile_picture);
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
                <label className="mt-3">SubDomain Name</label>
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
                <label style={{ marginTop: '32px' }}>About me</label>
                <Input
                  type="text"
                  name="customer_about_me"
                  onChange={handleUserProfileChange}
                  value={userProfile.customer_about_me}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={4} xs="12" style={{ marginTop: '24px' }}>
                <label>Role</label>
                <Input
                  type="text"
                  value="Instructor"
                  className="ml10"
                  disabled
                  // style={{ width: '170%' }}
                />
              </Col>

              <Col md={4} xs="12">
                <label className="mt-4">Occupation</label>
                <Input
                  type="text"
                  placeholder="Occupation"
                  className="ml10"
                  name="customer_occupation"
                  value={userProfile.customer_occupation}
                  onChange={handleUserProfileChange}
                  // style={{ width: '170%' }}
                />
              </Col>

              <Col md={4} xs="12">
                <label className="mt-4">Website</label>
                <Input
                  type="text"
                  placeholder="example: www.xyz.com"
                  className="ml10"
                  name="customer_website_url"
                  value={userProfile.customer_website_url}
                  onChange={handleUserProfileChange}
                  // style={{ width: '170%' }}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={4} xs="12" style={{ marginTop: '24px' }}>
                <label className="">LinkedIn</label>
                <Input
                  type="text"
                  placeholder="Your LinkedIn Account URL"
                  className="ml10"
                  name="customer_linkedin_url"
                  value={userProfile.customer_linkedin_url}
                  onChange={handleUserProfileChange}
                  // style={{ width: '170%' }}
                />
              </Col>

              <Col md={4} xs="12">
                <label className="mt-4">Facebook</label>
                <Input
                  type="text"
                  placeholder="Your Facebook Account URL"
                  className="ml10"
                  name="customer_facebook_url"
                  value={userProfile.customer_facebook_url}
                  onChange={handleUserProfileChange}
                  // style={{ width: '170%' }}
                />
              </Col>

              <Col md={4} xs="12">
                <label className="mt-4">Twitter</label>
                <Input
                  type="text"
                  placeholder="Your Twitter Account URL"
                  className="ml10"
                  name="customer_twitter_url"
                  value={userProfile.customer_twitter_url}
                  onChange={handleUserProfileChange}
                  // style={{ width: '170%' }}
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
              </Col>
              <Col
                md={6}
                className="mt-3"
                // style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <label style={{ fontSize: '15px' }}>Experience</label>
                <Editor
                  editorState={editorState2}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange2}
                  editorStyle={{ height: '150px' }}
                />
              </Col>
            </Row>

            <Row className="">
              <Button
                type="reset"
                className="ml-auto mt-4 mr-2"
                style={{ width: '100px', borderRadius: '0px' }}
                onClick={handleReset}
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
