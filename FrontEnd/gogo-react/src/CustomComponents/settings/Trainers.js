import React, { useState, useEffect } from 'react';
import { Card, Row, Input, CardBody, Button, Col } from 'reactstrap';
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

import axiosInstance from '../../helpers/axiosInstance';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import Loader from './Loader';

const Trainer = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // const [editorState1, setEditorState1] = useState(EditorState.createEmpty());
  // const [editorState2, setEditorState2] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'User Profile', 3000, null, null, '');
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        success,
        'User Profile',
        3000,
        null,
        null,
        ''
      );
      setSuccess(null);
    }
  }, [success]);

  const [inputList1, setInputList1] = useState([
    {
      trainer_id: null,
      displayProfileImage: '',
      profile_picture: '',
      occupation: '',
      fullname: '',
      phone: '',
      email: '',
      address: '',
      website: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      career_summary: '',
      experience: '',
      editorState1: EditorState.createEmpty(),
      editorstate2: EditorState.createEmpty(),
    },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getDraft = (data) => {
    const blocksFromHTML = convertFromHTML(data);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(state);
  };

  useEffect(() => {
    const getTrainers = async () => {
      try {
        setIsLoaded(false);
        const result = await axiosInstance.get('/tutor/trainer');
        console.log(result);
        if (result.data.success) {
          const list = result.data.trainers.map((doc) => ({
            trainer_id: doc.trainer_id,
            profile_picture: doc.trainer_image_url,
            occupation: doc.trainer_occupation,
            fullname: doc.trainer_full_name,
            phone: doc.trainer_phone_number,
            email: doc.trainer_email,
            address: doc.trainer_address,
            website: doc.trainer_website_url,
            linkedin: doc.trainer_linkedin_id,
            twitter: doc.trainer_twitter_id,
            facebook: doc.trainer_facebook_id,
            instagram: doc.trainer_instagram_id,
            career_summary: doc.trainer_career_summary,
            experience: doc.trainer_experience,
            editorState1: getDraft(doc.trainer_career_summary),
            editorState2: getDraft(doc.trainer_experience),
          }));

          setInputList1(list);
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('could not fetch trainers data');
          }
        }
      } catch (err) {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('could not fetch trainers data');
        }
      } finally {
        setIsLoaded(true);
      }
    };
    // setTimeout(() => {
    getTrainers();
    // }, 1500);
  }, []);

  const handleInputChange1 = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList1];
    list[index][name] = value;
    setInputList1(list);
  };

  const handleTrainerSubmit = async () => {
    console.log(inputList1);
    let flg = 0;
    inputList1.forEach((doc) => {
      if (!doc.fullname) {
        flg = 1;
        setError('provide full name of trainer');
      } else if (!doc.occupation) {
        flg = 1;
        setError('provide occupation of trainer');
      } else if (!doc.phone) {
        flg = 1;
        setError('provide phone no of trainer');
      } else if (isNaN(doc.phone)) {
        flg = 1;
        setError('only digits are allowed');
      } else if (!doc.email) {
        flg = 1;
        setError('provide email of trainer');
      } else if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          doc.email
        )
      ) {
        flg = 1;
        setError('invalid email');
      } else if (!doc.address) {
        flg = 1;
        setError('provide address of trainer');
      } else if (!doc.career_summary) {
        flg = 1;
        setError('provide career summary of trainer');
      } else if (!doc.experience) {
        flg = 1;
        setError('provide experience of trainer');
      }
    });

    const formData = new FormData();
    inputList1.forEach((doc, index) => {
      if (!doc.profile_picture) {
        flg = 1;
        setError('please provide profile picture');
        return;
      } else {
        formData.append(`Trainer ${index}`, doc.profile_picture);
      }
    });

    if (!flg) {
      try {
        formData.append('values', JSON.stringify(inputList1));
        console.log(formData);
        const result = await axiosInstance.post('/tutor/trainer', formData);
        console.log(result);
        if (result.data.success)
          setSuccess('Trainer information uploaded successfully');
        else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to save trainer information');
          }
        }
      } catch (err) {
        console.log(err);
        try {
          setError(err.response.data.error);
        } catch (error) {
          setError('could not upload trainers data');
        }
      }
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick1 = (index) => {
    const list = [...inputList1];
    list.splice(index, 1);
    setInputList1(list);
  };

  // handle click event of the Add button
  const handleAddClick1 = () => {
    setInputList1([
      ...inputList1,
      {
        trainer_id: null,
        fullname: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: '',
        career_summary: '',
        editorState1: EditorState.createEmpty(),
        editorstate2: EditorState.createEmpty(),
      },
    ]);
  };

  if (!isLoaded) return <Loader />;

  return (
    <>
      {inputList1.map((x, i) => {
        console.log(i);
        return (
          <>
            <Card className="box mb-4">
              <CardBody>
                <Row>
                  <Col md={6} xs={12}>
                    <img
                      src={x.displayProfileImage}
                      className=" ml-auto"
                      style={{ width: '15%' }}
                    />
                    <label className="mr-auto ml-4">
                      <input
                        type="file"
                        name="customer_profile_picture"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          const file = URL.createObjectURL(e.target.files[0]);
                          const currentImage = e.target.files[0];
                          if (
                            currentImage.type != 'image/jpg' &&
                            currentImage.type != 'image/jpeg' &&
                            currentImage.type != 'image/png'
                          )
                            setError('only jpg,jpeg,png formats are allowed');
                          else {
                            const list = [...inputList1];
                            list[i]['profile_picture'] = currentImage;
                            list[i]['displayProfileImage'] = file;
                            setInputList1(list);
                          }
                        }}
                      />
                      <FiUpload
                        className="text-center "
                        style={{ marginLeft: '50px' }}
                      />
                      <p id="ufd">Upload from device</p>
                    </label>
                  </Col>
                  <Col md={6} xs={12}>
                    <label>Occupation</label>
                    <Input
                      type="text"
                      name="occupation"
                      placeholder="Where are you working right now?"
                      value={x.occupation}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Full Name</label>
                    <Input
                      name="fullname"
                      placeholder="Enter Fullname"
                      value={x.fullname}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Phone</label>
                    <Input
                      className="ml10"
                      name="phone"
                      placeholder="Phone Number"
                      value={x.phone}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                  <Col md={4} xs="12">
                    {/* fullname: "", phone: "",email: "",address: "",website: "",linkedin: "",twitter: "",facebook: "",instagram: "",career_summary: "" */}
                    <label style={{ fontSize: '15px' }}>Email</label>
                    <Input
                      className="ml10"
                      name="email"
                      placeholder="Email"
                      value={x.email}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Address</label>
                    <Input
                      className="ml10"
                      name="address"
                      placeholder="Address"
                      value={x.address}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Website</label>
                    <Input
                      className="ml10"
                      name="website"
                      placeholder="Website"
                      value={x.website}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>LinkedIn</label>
                    <Input
                      className="ml10"
                      name="linkedin"
                      placeholder="Copy & paste linkedin profile URL"
                      value={x.linkedin}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Twitter</label>
                    <Input
                      className="ml10"
                      name="twitter"
                      placeholder="Copy & paste Twitter profile URL"
                      value={x.twitter}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Facebook</label>
                    <Input
                      className="ml10"
                      name="facebook"
                      placeholder="Copy & paste Facebook profile URL"
                      value={x.facebook}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                  <Col md={4} xs="12">
                    <label style={{ fontSize: '15px' }}>Instagram</label>
                    <Input
                      className="ml10"
                      name="instagram"
                      placeholder="Copy & paste Instagram profile URL"
                      value={x.instagram}
                      onChange={(e) => handleInputChange1(e, i)}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={6} xs={12}>
                    <label style={{ fontSize: '15px' }}>Career Summary</label>
                    <Editor
                      editorState={x.editorState1}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={(editorState1) => {
                        const list = [...inputList1];
                        list[i].editorState1 = editorState1;
                        list[i].career_summary = draftToHtml(
                          convertToRaw(list[i].editorState1.getCurrentContent())
                        );
                        setInputList1(list);
                      }}
                      editorStyle={{ height: '150px' }}
                    />
                    {/* <textarea
                      type="text"
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        height: '230px',
                        width: '100%',
                        maxWidth: '100% !important',
                      }}
                      name="career_summary"
                      placeholder="Please use ',' to separte your skills"
                      value={x.career_summary}
                      onChange={(e) => handleInputChange1(e, i)}
                    /> */}
                    {/* <Input
                      type="textarea"
                      className="ml10"
                      name="career_summary"
                      placeholder="Please use ',' to separte your skills"
                      value={x.career_summary}
                      onChange={(e) => handleInputChange1(e, i)}
                    /> */}
                  </Col>
                  <Col md={6} xs={12}>
                    <label style={{ fontSize: '15px' }}>Experience</label>
                    <Editor
                      editorState={x.editorState2}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={(currentState) => {
                        const list = [...inputList1];
                        list[i].editorState2 = currentState;
                        list[i].experience = draftToHtml(
                          convertToRaw(list[i].editorState2.getCurrentContent())
                        );
                        setInputList1(list);
                      }}
                      editorStyle={{ height: '150px' }}
                    />
                    {/* <textarea
                      type="text"
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        height: '230px',
                        width: '100%',
                        maxWidth: '100% !important',
                      }}
                      name="experience"
                      value={x.experience}
                      onChange={(e) => handleInputChange1(e, i)}
                    /> */}
                    {/* <Input
                      type="textarea"
                      className="ml10"
                      name="experience"
                      value={x.experience}
                      onChange={(e) => handleInputChange1(e, i)}
                    /> */}
                  </Col>
                </Row>
                <div className="btn-box">
                  {inputList1.length !== 1 && (
                    <Button
                      className="mr-auto ml-auto d-flex mt-4"
                      color="danger"
                      style={{ borderRadius: '0px' }}
                      onClick={() => handleRemoveClick1(i)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </>
        );
      })}
      {/* {inputList1.length - 1 === i && ( */}
      <Button
        style={{ borderRadius: '0px' }}
        className="mr-auto ml-auto d-flex"
        onClick={handleAddClick1}
      >
        Add
      </Button>
      {/* )} */}
      <Button onClick={handleTrainerSubmit}>Submit</Button>
    </>
  );
};

export default Trainer;
