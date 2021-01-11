import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ percentage }) => {
  return (
    <div
      style={{
        height: '30px',
        paddingLeft: '20%',
      }}
    >
      {percentage ? (
        <div
          className="progress-bar progress-bar-striped bg-success"
          role="progressbar"
          style={{ width: '500px' }}
        >
          {percentage}%
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};
export default ProgressBar;
