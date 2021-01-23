import React from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import CustomDropdown from '../../../CustomComponents/Dropdown';
import { TabularData } from '../../../CustomComponents/Tabulardata';
import { DropDownContextProvider } from '../../../context/DropdownContext';

const DefaultDashboard = () => {
  return (
    <DropDownContextProvider>
      <Row>
        <Colxx xxs="12">
          <CustomDropdown />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <TabularData />
        </Colxx>
      </Row>
    </DropDownContextProvider>
  );
};
export default injectIntl(DefaultDashboard);
