import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Input,
  CardBody,
  Nav,
  NavItem,
  TabContent,
  Button,
  TabPane,
  Col,
  CardImg,
} from 'reactstrap';

import Switch from 'rc-switch';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import logo from '../bebinca-thumb.jpg';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';
import Form from 'reactstrap/lib/Form';

const General = () => {
  const [theme, setTheme] = useState('1');
  let [select, setSelect] = useState('Select');
  let [select2, setSelect2] = useState('Select');
  const [timeline, settimeline] = useState(false);
  const [timeline1, settimeline1] = useState(false);
  const [timeline2, settimeline2] = useState(false);
  const [activeFirstTab1, setActiveFirstTab1] = useState('4');

  const [
    customer_affiliate_did_changes,
    setCustomer_affiliate_did_changes,
  ] = useState(false);

  const [inputList, setInputList] = useState([
    { firstName: '', lastName: '', rate: '' },
  ]);

  // Removing item from inputlist not working properly ...check once

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [customer_currency_name, setCustomer_currency_name] = useState(null);
  const [customer_currency_rate, setCustomer_currency_rate] = useState(null);
  const [
    customer_affiliate_fixed_rate,
    setCustomer_affiliate_fixed_rate,
  ] = useState(null);

  useEffect(() => {
    if (error) {
      console.log(error);
      NotificationManager.warning(error, 'User Profile', 3000, null, null, '');
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
    }
  }, [success]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/settings/toggle');
        console.log(result);
        if (result.data.success) {
          settimeline2(result.data.result.customer_blogs);
          settimeline1(result.data.result.customer_affiliate);
          settimeline(result.data.result.customer_affiliate_monitary_benifits);
          setCustomer_currency_name(result.data.result.customer_currency_name);
          setCustomer_affiliate_did_changes(
            result.data.result.customer_affiliate_did_changes
          );
          setCustomer_currency_rate(
            result.data.result.customer_currency_rate
              ? result.data.result.customer_currency_rate
              : ''
          );
          setCustomer_affiliate_fixed_rate(
            result.data.result.customer_affiliate_fixed_rate
          );
          if (result.data.result.customer_affiliate_range_cost_min) {
            const minRange = result.data.result.customer_affiliate_range_cost_min.split(
              ','
            );
            const maxRange = result.data.result.customer_affiliate_range_cost_max.split(
              ','
            );
            const rateRange = result.data.result.customer_affiliate_range_rate.split(
              ','
            );

            const list = [];
            for (let i = 0; i < minRange.length; i++)
              list.push({
                firstName: minRange[i],
                lastName: maxRange[i],
                rate: rateRange[i],
              });
            setInputList(list);
          }
        } else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to fetch data');
          }
        }
      } catch (error) {
        try {
          setError(error.response.data.error);
        } catch (error) {
          setError('Unable to fetch data');
        }
      }
    };
    getData();
  }, []);

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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleToggle = async (field, value) => {
    try {
      const values = { field, value };
      const result = await axiosInstance.post('/tutor/settings/toggle', {
        values,
      });
      if (result.data.success) {
        setSuccess('Data Updated');
        if (field == 'customer_blogs') settimeline2(!timeline2);
        else if (field == 'customer_affiliate') settimeline1(!timeline1);
        else if (field == 'customer_affiliate_monitary_benifits')
          settimeline(!timeline);
      } else {
        try {
          setError(result.data.error);
        } catch (error) {
          setError('Unable to Update Changes');
        }
      }
    } catch (error) {
      try {
        setError(error.response.data.error);
      } catch (error) {
        setError('Unable to Update Changes');
      }
    }
  };

  const handleCurrencyDataSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(customer_affiliate_did_changes);
      if (!customer_affiliate_did_changes) {
        const values = { customer_currency_name, customer_currency_rate };
        const result = await axiosInstance.post('/tutor/settings/currency', {
          values,
        });
        if (!result.data.success) {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to upload currency details');
          }
        } else setSuccess('Currency Data Updated');
      }
    } catch (error) {
      try {
        setError(error.response.data.error);
      } catch (error) {
        setError('Unable to upload currency details');
      }
    }
  };

  const validateSetRanges = () => {
    if (!inputList[0].firstName || !inputList[0].lastName || !inputList[0].rate)
      return false;
    for (let i = 1; i < inputList.length; i++)
      if (
        inputList[i].firstName < inputList[i - 1].lastName ||
        !inputList[i].rate ||
        !inputList[i].firstName ||
        !inputList[i].lastName
      )
        return false;
    return true;
  };

  const handleSetRanges = async () => {
    try {
      if (!validateSetRanges()) setError('Provide valid ranges and rate ');
      else if (!customer_affiliate_did_changes) {
        let minRange = '',
          maxRange = '',
          rateRange = '';
        inputList.forEach((doc) => {
          minRange += `${doc.firstName},`;
          maxRange += `${doc.lastName},`;
          rateRange += `${doc.rate},`;
        });
        minRange = minRange.substr(0, minRange.length - 1);
        maxRange = maxRange.substr(0, maxRange.length - 1);
        rateRange = rateRange.substr(0, rateRange.length - 1);
        const values = { minRange, maxRange, rateRange };
        const result = await axiosInstance.post('/tutor/settings/setranges', {
          values,
        });
        if (result.data.success) setSuccess('Range Data Uploaded');
        else {
          try {
            setError(result.data.error);
          } catch (error) {
            setError('Unable to upload range data');
          }
        }
      }
    } catch (error) {
      try {
        setError(error.response.data.error);
      } catch (error) {
        setError('Unable to update data');
      }
    }
  };

  return (
    <>
      <h3 id="default" className="font-weight-bold">
        1. Website Theme
      </h3>
      <Row className="mt-1" style={{ marginLeft: '15px' }}>
        <label>
          <input
            type="radio"
            checked={theme === '1'}
            value="1"
            onChange={(e) => setTheme(e.target.value)}
          />
          <div className="">
            <Row className="mt-4">
              <Card
                className="p-4 ml-4"
                style={{ minWidth: '270px', minHeight: '200px' }}
              >
                <CardImg
                  top
                  width="100%"
                  src={logo}
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
                  <Button className="float-right butn">Edit</Button>
                </CardBody>
              </Card>{' '}
              <Card
                className="p-4 ml-4"
                style={{ minWidth: '270px', minHeight: '200px' }}
              >
                <CardImg
                  top
                  width="100%"
                  src={logo}
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
              </Card>
            </Row>
          </div>
        </label>
      </Row>
      <h3 className="d-flex mt-4 font-weight-bold" id="default">
        2. Enable blogs on website
      </h3>{' '}
      <Switch
        className="custom-switch custom-switch-secondary custom-switch-small ml-auto mb-auto d-flex"
        id="custom-switch"
        checked={timeline2}
        onChange={() => handleToggle('customer_blogs', !timeline2)}
      />{' '}
      <br />
      <h3 className="d-flex mt-4 font-weight-bold" id="default">
        3. Enable affiliate pages
      </h3>{' '}
      <Switch
        className="custom-switch custom-switch-secondary custom-switch-small ml-auto mb-auto d-flex"
        id="custom-switch"
        checked={timeline1}
        onChange={() => handleToggle('customer_affiliate', !timeline1)}
      />{' '}
      <br />
      {timeline1 ? (
        <Card body className="card1">
          <Row>
            <Col md="6" xs="12">
              <p className="mr-auto" id="para1">
                Do you want to give monitary benifit your affiliate?
              </p>
            </Col>

            <Col md="6" xs="12">
              <Switch
                disabled={customer_affiliate_did_changes}
                className="custom-switch custom-switch-secondary custom-switch-small ml-auto mb-auto"
                id="custom-switch"
                checked={timeline}
                onChange={() =>
                  handleToggle(
                    'customer_affiliate_monitary_benifits',
                    !timeline
                  )
                }
              />{' '}
              <br />
            </Col>
          </Row>
          {timeline ? (
            <div className="d-flex mt-4 mb-4 float-left thediv">
              <Form inline onSubmit={handleCurrencyDataSubmit}>
                <Input
                  placeholder="Your Currency Name"
                  className="mr-auto"
                  onChange={(e) => setCustomer_currency_name(e.target.value)}
                  value={customer_currency_name}
                  readOnly={customer_affiliate_did_changes}
                />
                <Input
                  style={{ marginLeft: '10px', marginRight: '30px' }}
                  placeholder="Your Currency Rate"
                  className="mr-auto"
                  onChange={(e) => setCustomer_currency_rate(e.target.value)}
                  value={customer_currency_rate}
                  readOnly={customer_affiliate_did_changes}
                />
                <Button
                  style={{ marginLeft: '10px' }}
                  disabled={customer_affiliate_did_changes}
                >
                  Submit
                </Button>
              </Form>
            </div>
          ) : null}
          <Card body className="mt-2">
            <Row>
              <Nav tabs className="card-header-tabs mb-3">
                <NavItem>
                  <NavLink
                    to="#"
                    location={{}}
                    className={classnames({
                      active: activeFirstTab1 === '4',
                      'nav-link': true,
                    })}
                    onClick={() => {
                      setActiveFirstTab1('4');
                    }}
                  >
                    <h6>Fixed</h6>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="#"
                    location={{}}
                    className={classnames({
                      active: activeFirstTab1 === '5',
                      'nav-link': true,
                    })}
                    onClick={() => {
                      setActiveFirstTab1('5');
                    }}
                  >
                    <h6>Set Ranges</h6>
                  </NavLink>
                </NavItem>
              </Nav>
            </Row>
            <TabContent activeTab={activeFirstTab1}>
              <TabPane tabId="4">
                <div className="d-flex">
                  <p className="font-weight-bold" style={{ fontSize: '20px' }}>
                    Rate per conversion
                  </p>{' '}
                  <Input
                    style={{ width: '70%', marginLeft: '10px' }}
                    name="customer_affiliate_fixed_rate"
                    value={customer_affiliate_fixed_rate}
                    onChange={(e) =>
                      setCustomer_affiliate_fixed_rate(e.target.value)
                    }
                    readOnly={customer_affiliate_did_changes}
                  />
                </div>
                <Button
                  disabled={customer_affiliate_did_changes}
                  onClick={() =>
                    customer_affiliate_did_changes
                      ? ''
                      : handleToggle(
                          'customer_affiliate_fixed_rate',
                          customer_affiliate_fixed_rate
                        )
                  }
                  className="mx-auto mt-4 d-flex"
                  style={{ borderRadius: '0px' }}
                >
                  Submit
                </Button>
              </TabPane>
              <TabPane tabId="5">
                {inputList.map((x, i) => {
                  return (
                    <div className="box">
                      <div className="d-flex">
                        <Input
                          name="firstName"
                          value={x.firstName}
                          onChange={(e) => handleInputChange(e, i)}
                          placeholder="Cost(Min)"
                          readOnly={customer_affiliate_did_changes}
                        />
                        <p className="mt-2 ml-4"> to</p>
                        <Input
                          className="ml-4"
                          name="lastName"
                          value={x.lastName}
                          onChange={(e) => handleInputChange(e, i)}
                          placeholder="Cost(Max)"
                          readOnly={customer_affiliate_did_changes}
                        />
                        <p className="mt-2 ml-4">=</p>
                        <Input
                          className="ml-4"
                          name="rate"
                          value={x.rate}
                          onChange={(e) => handleInputChange(e, i)}
                          placeholder="Rate"
                          readOnly={customer_affiliate_did_changes}
                        />
                      </div>
                      <div className="btn-box">
                        {inputList.length !== 1 && (
                          <Button
                            className="mr10"
                            className="mx-auto mt-4 d-flex mb-4"
                            style={{ borderRadius: '0px' }}
                            onClick={() =>
                              setInputList(
                                inputList.filter((doc, index) => index != i)
                              )
                            }
                            disabled={customer_affiliate_did_changes}
                          >
                            Remove
                          </Button>
                        )}
                        {inputList.length - 1 === i && (
                          <div className="d-flex">
                            <Button
                              disabled={customer_affiliate_did_changes}
                              onClick={() =>
                                setInputList([
                                  ...inputList,
                                  { firstName: '', lastName: '', rate: '' },
                                ])
                              }
                              className="ml-auto mt-4 d-flex mr-2"
                              style={{ borderRadius: '0px' }}
                            >
                              Add
                            </Button>{' '}
                            <Button
                              disabled={customer_affiliate_did_changes}
                              className=" mt-4 d-flex mr-auto ml-2"
                              style={{ borderRadius: '0px' }}
                              onClick={handleSetRanges}
                            >
                              Submit
                            </Button>{' '}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* <Input className="mx-4" placeholder="Cost(Min)"/>  <Input className="mx-4" placeholder="Cost(Max)"/><Input className="mx-4" placeholder="Rate"/>
                     <Button >Add</Button> */}
              </TabPane>
            </TabContent>
          </Card>
        </Card>
      ) : null}
    </>
  );
};

export default General;
