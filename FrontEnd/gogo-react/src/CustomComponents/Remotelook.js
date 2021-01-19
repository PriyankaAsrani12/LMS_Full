import React, { useState, useEffect } from 'react';
import { Colxx, Separator } from '../components/common/CustomBootstrap';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Row,
  Label,
  Input,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import './Customcss.css';
import Avatar from './avatarnew.png';
import { iconsmind } from '../data/icons';
import { Link } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { VscLibrary } from 'react-icons/vsc';
import axiosInstance from '../helpers/axiosInstance';
import { useHistory } from 'react-router-dom';
import NotificationManager from '../components/common/react-notifications/NotificationManager';
import Loader from './settings/Loader';

const isValidFileFormat = (ext) => {
  const arr = [
    'txt',
    'rtf',
    'pdf',
    'odt',
    'dotx',
    'dotm',
    'docx',
    'docm',
    'doc',
  ];
  return arr.indexOf(ext) >= 0;
};

const Remotelook = (props) => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [data, setData] = useState([]);
  const [file, setFile] = useState('');
  const [displayThumbnail, setDisplayThumbnail] = useState(null);
  const [trainer, setTrainer] = useState({});
  const [loaded, setLoaded] = useState(false);

  const createMarkup = (data) => {
    return { __html: data };
  };
  useEffect(() => {
    const getData = async () => {
      try {
        console.log(props.location.state);
        if (isNaN(props.location.state.uniquesessionid))
          props.history.push('/app/dashboard/default');
        let { uniquesessionid, trainer_id } = props.location.state;
        if (trainer_id == 'customer_id') trainer_id = 999;
        const response = await axiosInstance.get(
          `/tutor/sessions/FindSessionById/${uniquesessionid}/trainer_id/${trainer_id}`
        );

        console.log(response);
        if (response.data.success) {
          setData(response.data.session);
          setTrainer(response.data.trainerData);
        } else {
          console.log('err occured');
          history.push('/app/dashboard/default');
        }
      } catch (err) {
        console.log(err);
        history.push('/app/dashboard/default');
      } finally {
        setLoaded(true);
      }
    };
    getData();
    return () => {
      //do what you want you do when component unmounts
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(
        error,
        'Update Live Session Error',
        3000,
        null,
        null,
        ''
      );
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      NotificationManager.success(
        'File Uploaded Succeessfully',
        'Session Material',
        3000,
        null,
        null,
        ''
      );
    }
  }, [success]);

  useEffect(() => {
    if (fileUploadError) {
      NotificationManager.warning(
        fileUploadError || 'could not upload file',
        'Session Material Upload Error',
        3000,
        null,
        null,
        ''
      );
    }
  }, [fileUploadError]);

  const onFileChange = async (e) => {
    console.log(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    async function upload() {
      if (file) {
        const extension = file.name.slice(file.name.lastIndexOf('.') + 1);
        console.log(extension);
        if (!isValidFileFormat(extension)) setError('Not a valid file format');
        else {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('session_id', props.location.state.uniquesessionid);
          formData.append('session_type', 'Live Session');
          formData.append('item_type', 'Session Material');
          try {
            const res = await axiosInstance.post(
              '/tutor/libraryItems/upload',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            console.log(res);
            if (res.data.success) setSuccess(true);
            else setFileUploadError('please check file format');
          } catch (err) {
            console.log(err);
            try {
              setFileUploadError(err.response.data.error);
            } catch (error) {
              setFileUploadError('could not upload file..please try again');
            }
          }
        }
      }
    }
    upload();
  }, [file]);

  const handleSubmit = () => {
    setModal(!modal);
    const values = {
      session_description: document.getElementById('exampleText2').value,
      session_id: props.location.state.uniquesessionid,
    };
    if (!values.session_description) setError('provide session description');
    else {
      axiosInstance
        .post('/sessions/updateSession', { values })
        .then((response) => {
          console.log(response);
          if (response.data.success) setData(response.data.session);
          else {
            console.log(response.data.error);
            setError(response.data.error);
          }
        })
        .catch((err) => {
          console.log(err);
          try {
            setError(err.message);
          } catch (err) {
            setError('Could not update...try again');
          }
        });
    }
  };

  const { className } = props;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const uploadThumbnail = async (currentImage) => {
    try {
      const formData = new FormData();
      formData.append('thumbnail', currentImage);
      formData.append('session_id', props.location.state.uniquesessionid);
      const result = await axiosInstance.post(
        '/tutor/sessions/upload/thumbnail',
        formData
      );
      console.log(result);
      if (result.data.success) setSuccess('thumbnail uploaded successfully');
      else {
        try {
          setError(result.data.error);
        } catch (err) {
          setError('unable to upload thumbnail');
        }
      }
    } catch (err) {
      try {
        setError(err.response.data.error);
      } catch (err) {
        setError('Could not update...try again');
      }
    }
  };
  if (!loaded) return <Loader />;
  return (
    <section style={{ marginLeft: '7%', marginRight: '7%' }}>
      <Link to="/app/dashboard/default">
        <div
          className={`glyph-icon ${iconsmind[2].icons[42]} sessionlookicon`}
          style={{ fontSize: '3rem' }}
        />
      </Link>
      <Card className="p-4 mb-3 ">
        <CardBody>
          <Row>
            <Colxx md="9" xs="12">
              <Row>
                <nav>
                  <ul className="d-flex">
                    <li className="d-flex align-items-center">
                      <h1
                        style={{ marginBottom: '0' }}
                        className="font-weight-bold"
                      >
                        {data.session_name}
                      </h1>
                    </li>
                    <li className="d-flex align-items-center ">
                      <badge
                        style={{
                          padding: '2px 2px',
                          backgroundColor: '#CFEBFD',
                          borderRadius: '12px',
                          fontSize: '10px',
                        }}
                      >
                        {data.session_type}
                      </badge>
                    </li>
                  </ul>
                </nav>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <nav>
                  <ul className="d-flex">
                    <li className="d-flex align-items-center">
                      <span style={{ fontSize: '12px' }}>
                        {data.session_start_date},
                      </span>
                    </li>
                    <li className="d-flex">
                      <span style={{ fontSize: '12px' }}>
                        {data.session_end_time
                          ? data.session_end_time.toString().slice(-8)
                          : ''}
                      </span>
                    </li>
                  </ul>
                </nav>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                {/* <Col md="3" xs="12"> */}
                {/* <li className="d-flex "> */}
                <h6 className="mb-0">
                  <a
                    href={data.session_link}
                    target="_blank"
                    style={{ cursor: 'pointer' }}
                  >
                    {data.session_link ? data.session_link : 'www.zoomapp.com,'}
                  </a>
                </h6>
                {/* </li> */}
                {/* </Col> */}
              </Row>
              <Row>
                <Col md="4" xs="12">
                  <li className=" d-flex">
                    <p className="mb-0" style={{ marginLeft: '10px' }}>
                      <span className="font-weight-bold">Code: </span>{' '}
                      {data.session_zoom_code}
                    </p>
                  </li>
                </Col>
                <Col md="4" xs="12">
                  <li className=" d-flex ">
                    <p style={{ marginLeft: '10px' }} className="mb-0">
                      {' '}
                      <span className="font-weight-bold">Password:</span>{' '}
                      {data.session_zoom_password}
                    </p>
                  </li>
                </Col>
                <Col md="4" xs="12">
                  <li className=" d-flex ">
                    <p style={{ marginLeft: '10px' }} className="mb-0">
                      {' '}
                      <span className="font-weight-bold">Duration:</span>{' '}
                      {data.session_duration} Days
                    </p>
                  </li>
                </Col>
              </Row>
            </Colxx>
            <Colxx md="3" xs="12">
              <Button
                outline
                color="secondary"
                style={{ fontSize: '1.0rem', borderRadius: '0px' }}
                onClick={() => window.open(data.session_link)}
              >
                Launch
              </Button>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      <Card className="px-4 mb-3">
        <CardBody>
          <Row className="justify-content-end">
            <Button
              className="float-right"
              style={{ borderRadius: '0px', fontSize: '15px' }}
              onClick={toggle}
            >
              Edit
            </Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
              <ModalHeader toggle={toggle}>Edit Details</ModalHeader>
              <ModalBody>
                {/* <Label for="exampleText">Tagline</Label> */}
                {/*  <Input type="textarea" */}{' '}
                {/*  value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." */
                /* id="exampleText" /> */}
                <Label for="exampleText2" className="">
                  Description
                </Label>
                <Input
                  type="textarea"
                  name="session_description"
                  /* value={desc} onChange={(e) => change(e)} */ id="exampleText2"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  style={{ borderRadius: '0px', fontSize: '15px' }}
                >
                  Submit
                </Button>{' '}
                <Button
                  color="secondary"
                  onClick={toggle}
                  style={{ borderRadius: '0px', fontSize: '15px' }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Row>
          <Row className="pr-4">
            {/*   <Colxx xs='12' md="12">
            <h3 className="font-weight-bold">Tagline</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
          </Colxx> */}

            <Colxx xs="12" md="12" style={{ marginTop: -30 }}>
              <h3 className="font-weight-bold">Description</h3>
              <p>{data.session_description}</p>
            </Colxx>
            <Colxx xs="12" md="12">
              <h3 className="font-weight-bold">Fees</h3>
              <p> {data.session_fee}</p>
            </Colxx>
            <Colxx xs="12" md="12">
              <h3 className="font-weight-bold">Registration</h3>
              <p>{data.session_registration}</p>
            </Colxx>
            <Colxx xs="12" md="12">
              <h3 className="font-weight-bold">Associated Courses</h3>
              <p>{data.session_tags}</p>
            </Colxx>
            <Colxx xs="12" md="12">
              <h3 className="font-weight-bold">Occurance</h3>
              <p>{data.session_occurance}</p>
            </Colxx>
            <Colxx xs="12" md="12">
              <h3 className="font-weight-bold">Fees Type</h3>
              <p>{data.session_fee_type}</p>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      <Card className="mb-3">
        <CardTitle
          className="font-weight-bold pl-4 pt-4"
          style={{ fontSize: '1.3rem' }}
        >
          Add Thumbnail
        </CardTitle>
        <CardBody>
          <Row className="text-center">
            <img
              src={displayThumbnail}
              style={{ width: '20%', marginLeft: '10px' }}
            />
            <label className="input-label-1">
              <input
                type="file"
                name="thumbnail"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  const file = URL.createObjectURL(e.target.files[0]);
                  const currentImage = e.target.files[0];
                  if (
                    currentImage.type != 'image/jpg' &&
                    currentImage.type != 'image/jpeg' &&
                    currentImage.type != 'image/png' &&
                    currentImage.type != 'image/webp'
                  )
                    setError('only jpg,jpeg,png,webp formats are allowed');
                  else {
                    setDisplayThumbnail(file);
                    uploadThumbnail(currentImage);
                  }
                }}
              />
              <FiUpload />
              <p id="ufd">Upload from device</p>
            </label>
            <label className="input-label-2">
              <input type="file" />
              <VscLibrary />
              <p id="ufl">Upload from Library</p>
            </label>
          </Row>
        </CardBody>
      </Card>
      <Card className=" mb-3">
        <CardTitle
          className="font-weight-bold pl-4 pt-4"
          style={{ fontSize: '1.3rem' }}
        >
          Trainer Profile
        </CardTitle>
        <CardBody>
          <nav>
            <Row>
              {/* <Colxx md="1"></Colxx> */}

              <Colxx
                md="4"
                xs="12"
                className="cardseparations text-center font-weight-bold"
              >
                <h3 className="font-weight-bold" style={{ fontSize: '1.1rem' }}>
                  {trainer.trainer_full_name}
                </h3>
                <img src={Avatar} alt="..." id="avatar" />
                <p>{trainer.trainer_occupation}</p>
                <Button outline color="secondary">
                  Edit Profile
                </Button>
              </Colxx>
              <Colxx md="4" xs="12" className="">
                <h5
                  className=" font-weight-bold text-center"
                  style={{ fontSize: '1.1rem' }}
                >
                  Career summary
                </h5>

                <p
                  className="text-center"
                  style={{ fontSize: '15px' }}
                  dangerouslySetInnerHTML={createMarkup(
                    trainer.trainer_career_summary
                  )}
                ></p>
              </Colxx>
              <Colxx md="4" xs="12">
                <h5
                  className=" font-weight-bold text-center"
                  style={{ fontSize: '1.1rem' }}
                >
                  Experience
                </h5>

                <div className="">
                  <p
                    className="text-center"
                    style={{ fontSize: '15px' }}
                    dangerouslySetInnerHTML={createMarkup(
                      trainer.trainer_experience
                    )}
                  ></p>
                </div>
              </Colxx>
            </Row>
          </nav>
        </CardBody>
      </Card>
      <Card className="p-4 mb-3">
        <CardBody>
          <Row>
            <Colxx md="6" xs="12">
              <h3 className="font-weight-bold text-center">
                List Of Occurance
              </h3>
              <p className="text-center">Occurance is here</p>
            </Colxx>
            <Colxx md="6" xs="12">
              <h3 className="font-weight-bold text-center">Session Material</h3>
              <Row className="text-center">
                <label className="input-label-1">
                  <input
                    type="file"
                    accept=".pdf,.word,.docx"
                    onChange={onFileChange}
                  />
                  <FiUpload />
                  <p id="ufd">Upload from device</p>
                </label>
                <label className="input-label-2">
                  <input type="file" />
                  <VscLibrary />
                  <p id="ufl">Upload from Library</p>
                </label>
              </Row>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      <br />
    </section>
  );
};

export default Remotelook;
