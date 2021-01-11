import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ percentage }) => {
  return (
    <div
      style={{
        height: '50px',
        paddingLeft: '40%',
      }}
    >
      <div
        className="progress-bar progress-bar-striped bg-success"
        role="progressbar"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;
