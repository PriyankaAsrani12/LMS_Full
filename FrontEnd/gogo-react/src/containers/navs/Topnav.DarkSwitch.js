import React, { useState, useEffect } from 'react';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import { Tooltip } from 'reactstrap';
import { getCurrentColor, setCurrentColor } from '../../helpers/Utils';

const TopnavDarkSwitch = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const color = getCurrentColor();
    setSwitchChecked(color.indexOf('dark') > -1);
  }, []);

  const changeMode = () => {
    let color = getCurrentColor();

    if (color.indexOf('dark') > -1) {
      color = color.replace('dark', 'light');
    } else if (color.indexOf('light') > -1) {
      color = color.replace('light', 'dark');
    }
    setCurrentColor(color);
    setSwitchChecked(color.indexOf('dark') > -1);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    
    <div className="">
      <Switch
        id="tooltip_switch"
        className="custom-switch custom-switch-primary custom-switch-small"
        checked={switchChecked}
        onChange={changeMode}
      />
       </div>
  );
};
export default TopnavDarkSwitch;
