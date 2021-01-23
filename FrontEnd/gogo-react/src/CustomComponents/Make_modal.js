import React, { useState } from 'react';
import {
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  Row,
  Label,
  Input,
} from 'reactstrap';

function Make_modal(props) {
  const [modal, setModal] = useState(false);
  const [tagline, setTagline] = useState(props.tagline);
  const [tags, setTags] = useState(props.seotags);
  const [description, setDescription] = useState(props.description);

  const toggle = () => setModal(!modal);

  const handleSubmit = () => {
    setModal(!modal);
    console.log(tagline, tags, description);
    const values = {
      session_tagline: tagline,
      session_tags: tags,
      session_description: description,
      session_id: props.session_id,
    };
    props.handleUpdateSession(values);
  };

  return (
    <div>
      <Row className="justify-content-end">
        <Button
          className="float-right"
          style={{ borderRadius: '0px', fontSize: '15px' }}
          onClick={toggle}
        >
          Edit
        </Button>
        <Modal isOpen={modal} toggle={toggle} className="">
          <ModalHeader toggle={toggle}>Edit Details</ModalHeader>
          <ModalBody>
            <Label for="tagline">Tagline</Label>

            <Input
              type="text"
              name="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              //   id="exampleText"
            />
            <Label for="tags" className="mt-4">
              SEO Tags
            </Label>
            <Input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Label for="description" className="mt-4">
              Description
            </Label>
            <Input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              //   id="exampleText2"
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
    </div>
  );
}

export default Make_modal;
