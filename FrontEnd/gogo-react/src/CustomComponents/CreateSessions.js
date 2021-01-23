import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import SessionInput from './SessionInput';
import logo from './session.svg';

const CreateSession = () => {
  const [modalLarge, setModalLarge] = useState(false);

  const toggleModal = () => setModalLarge(!modalLarge);

  return (
    <>
      <img
        src={logo}
        alt="you don't have any sessions yet logo"
        style={{
          marginTop: '20px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '15%',
          height: '15%',
        }}
      />{' '}
      <h3
        style={{ marginBottom: '20px', textAlign: 'center', color: 'purple' }}
      >
        {' '}
        You Don 't Have Any Sessions Yet
      </h3>
      <br />
      <br />
      <br />
      <Modal isOpen={modalLarge} size="lg" toggle={toggleModal}>
        <SessionInput closeModal={toggleModal} value="true" />
      </Modal>
    </>
  );
};

export default CreateSession;
