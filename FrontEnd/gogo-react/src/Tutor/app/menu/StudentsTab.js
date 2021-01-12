import React, { useEffect, useState } from 'react';
import { CardBody, Card, Badge } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';

import Table from './Table';
import axiosInstance from '../../../helpers/axiosInstance';
import NotificationManager from '../../../components/common/react-notifications/NotificationManager';

const cols = [
  {
    Header: 'Name',
    accessor: 'title',
    cellClass: 'text-muted w-10',
    Cell: (props) => <p>{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Contact No.',
    accessor: 'ph',
    cellClass: 'text-muted w-20',
    Cell: (props) => <p>{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Email',
    accessor: 'email',
    cellClass: 'text-muted w-10',
    Cell: (props) => <p>{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Total Courses',
    accessor: 'NOC',
    cellClass: 'text-muted w-15 ',
    Cell: (props) => <p className="text-center">{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Fee Paid',
    accessor: 'fee',
    cellClass: 'text-muted w-10',
    Cell: (props) => <p className="text-center">{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Referrals',
    accessor: 'sb',
    cellClass: 'text-muted w-10',
    Cell: (props) => <p className="text-center">{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Reward Earned',
    accessor: 're',
    cellClass: 'text-muted w-20',
    Cell: (props) => <p className="ml-4">{props.value}</p>,
    sortType: 'basic',
  },
  {
    Header: 'Status',
    accessor: 'status',
    cellClass: 'color w-10',
    Cell: (props) => {
      if (props.value == 'Registered') {
        return (
          <Badge
            color="danger"
            style={{
              fontSize: '10px',
              borderRadius: '10px',
              backgroundColor: 'red',
            }}
          >
            {props.value}
          </Badge>
        );
      } else {
        return (
          <Badge
            color="primary"
            style={{
              fontSize: '10px',
              borderRadius: '10px',
              backgroundColor: 'green',
            }}
          >
            {props.value}
          </Badge>
        );
      }
    },
    sortType: 'basic',
  },
];

const StudentsTab = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Course Details',
        3000,
        null,
        null,
        ''
      );
  }, [error, setError]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/stats/students');
        console.log(result);
        const data = result.data.result.map((doc) => {
          return {
            title: `${doc.student_first_name} ${doc.student_last_name}`,
            ph: doc.student_phone_number,
            email: doc.student_email,
            NOC: 'Total Courses',
            fee: 'YES(STATIC)',
            sb: '2(STATIC)',
            re: '200(STATIC)',
            status: 'Registered',
          };
        });
        console.log(data);
        setData(data);
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (e) {
          setError('Could not fetch data');
        }
      }
    };
    getData();
  }, []);
  if (!data.length)
    return (
      <div style={{ marginBottom: '25rem' }}>No Students enrolled yet</div>
    );
  return (
    <Card className="h-120 ">
      <Scrollbars style={{ width: '100%', height: 400 }}>
        <CardBody>
          <Table columns={cols} data={data} />
        </CardBody>
      </Scrollbars>
    </Card>
  );
};

export default StudentsTab;
