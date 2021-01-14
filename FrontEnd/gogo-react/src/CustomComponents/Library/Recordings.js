import React, { useState, useEffect, useContext } from 'react';

import Table from './Table';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import axiosInstance from '../../helpers/axiosInstance';
import Loader from '../settings/Loader';
import NoDataFound from '../NoDataFound';
import { LibraryContext } from '../../context/LibraryContext';

const Recordings = ({ columns }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [handleReloadTable] = useContext(LibraryContext);

  useEffect(() => {
    if (error)
      NotificationManager.warning(
        error,
        'Library Recorded Item',
        3000,
        null,
        null,
        ''
      );
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get('/tutor/library/recordings');
        if (result.data.success) {
          const data = result.data.result.map((doc) => {
            if (doc.item_type == 'quiz') doc.item_size = '---';
            else if (doc.item_size / 1024 <= 1024)
              doc.item_size = `${(doc.item_size / 1024).toFixed(2)}Kb`;
            else if (doc.item_size / 1048576 <= 1024)
              doc.item_size = `${(doc.item_size / 1048576).toFixed(2)}Mb`;
            else doc.item_size = `${(doc.item_size / 1073741824).toFixed(2)}Gb`;
            return {
              id: doc.item_id,
              name: doc.item_name,
              size: doc.item_size,
              type: doc.item_type,
              uploaded: doc.updatedAt.substr(0, 10),
            };
          });
          setData(data);
        } else {
          try {
            setError(result.data.error);
          } catch (e) {
            setError('Unable to fetch data');
          }
        }
      } catch (err) {
        try {
          setError(err.response.data.error);
        } catch (e) {
          setError('Unable to fetch data');
        }
      } finally {
        setIsLoaded(true);
      }
    };
    getData();
  }, [handleReloadTable]);

  //backend team find a way to sort or filter data via this feature and show in tabs
  if (!isLoaded) return <Loader />;

  if (!data.length) return <NoDataFound />;
  return <Table columns={columns} data={data} divided />;
};
export default Recordings;
