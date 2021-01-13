import React, { useState, useEffect } from 'react';
import { Card, Row, Col, CardBody, Button, CardImg } from 'reactstrap';

import axiosInstance from '../../helpers/axiosInstance';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

const Index = () => {
  let [select, setSelect] = useState('Select');
  let [select2, setSelect2] = useState('Select');
  const [theme, setTheme] = useState('1');
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);

  let selectme = (e) => {
    if (e == 'select') {
      setSelect((select = 'Selected'));
      setSelect2((select = 'Select'));
    } else if (e == 'select2') {
      setSelect2((select2 = 'Selected'));
      setSelect((select = 'Select'));
    } else {
      setSelect((select = 'Select'));
    }
  };
  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Certicates Error',
        3000,
        3000,
        null,
        ''
      );
  }, [error, setError]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/certificates/findAll');

        console.log(result);
        if (result.data.success) setCertificates(result.data.certificates);
        else {
          try {
            setError(result.data.error);
          } catch (e) {
            setError('Unable to fetch certificates');
          }
        }
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (e) {
          setError('Unable to fetch certificates');
        }
      }
    };
    getData();
  }, []);

  return (
    <>
      <Button
        id="default"
        className="font-weight-bold"
        onClick={() => window.open('http://localhost:5000/tutor/certificates')}
      >
        Create A Certificate Template
      </Button>
      <Row className="mt-1" style={{ marginLeft: '15px' }}>
        <label>
          <input
            type="radio"
            checked={theme === '1'}
            value="1"
            onChange={(e) => setTheme(e.target.value)}
          />
          <div className="">
            <Row className="mt-4" style={{ marginBottom: '2rem' }}>
              {certificates.map((doc) => {
                return (
                  <Card
                    className="p-4 ml-4"
                    style={{ minWidth: '270px', minHeight: '200px' }}
                  >
                    <CardImg
                      top
                      width="100%"
                      src={require('../bebinca-thumb.jpg')}
                      alt="Theme1 img"
                      className="mb-3"
                    />
                    {doc.name}
                    <CardBody>
                      <Button
                        className="float-left butn"
                        onClick={() => selectme('select')}
                      >
                        {select}
                      </Button>
                      <Button
                        className="float-right butn"
                        onClick={() => {
                          console.log('edit ');
                          window.open(
                            `http://localhost:5000/tutor/certificates/api/database/2/${doc.certificate_id}`
                          );
                        }}
                      >
                        Edit
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
              {/* <Card
                className="p-4 ml-4"
                style={{ minWidth: '270px', minHeight: '200px' }}
              >
                <CardImg
                  top
                  width="100%"
                  src={require('../bebinca-thumb.jpg')}
                  alt="Theme1 img"
                  className="mb-3"
                />
                Default Theme
                <CardBody>
                  <Button
                    className="float-left butn"
                    onClick={() => selectme('select')}
                  >
                    {select}
                  </Button>
                  <Button
                    className="float-right butn"
                    onClick={() =>
                      window.open('http://localhost:5000/tutor/certificates')
                    }
                  >
                    Edit
                  </Button>
                </CardBody>
              </Card>
              <Card
                className="p-4 ml-4"
                style={{ minWidth: '270px', minHeight: '200px' }}
              >
                <CardImg
                  top
                  width="100%"
                  src={require('../bebinca-thumb.jpg')}
                  alt="Theme1 img"
                  className="mb-3"
                />
                Blank Theme
                <CardBody>
                  <Button
                    className="float-left butn"
                    onClick={() => selectme('select2')}
                  >
                    {select2}
                  </Button>
                  <Button className="float-right butn">Edit</Button>
                </CardBody>
              </Card> */}
            </Row>
          </div>
        </label>
      </Row>
    </>
  );
};

export default Index;
