/* eslint-disable consistent-return */
import React, { useState } from 'react';
import {
  Card,
  Button,
  Collapse,
  FormGroup,
  Label,
  Form,
  Input,
  Badge,
  CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import { ReactSortable } from 'react-sortablejs';

import CustomSelectInput from '../../components/common/CustomSelectInput';

const answerTypes = [
  { label: 'Text Area', value: '1', id: 1 },
  { label: 'Checkbox', value: '2', id: 2 },
  { label: 'Radiobutton', value: '3', id: 3 },
];

const QuestionBuilder = ({
  expanded,
  id,
  title,
  question,
  answerType,
  answers,
  order,
  deleteClick,
  handleChangeQuestion,
  handleChangeAnswerType,
  handleChangeAnswers,
}) => {
  const [collapse, setCollapse] = useState(expanded || false);
  const [mode, setMode] = useState('edit-quesiton');
  const [qId] = useState(id);
  const [qTitle, setQTitle] = useState(title);

  const editClick = () => {
    setMode('edit-quesiton');
    setCollapse(true);
  };

  const viewClick = () => {
    setMode('view-quesiton');
    setCollapse(true);
  };

  const typeChange = (aType) => {
    if (answerType) {
      if ((answerType.id === 2 || answerType.id === 3) && aType.id === 1) {
        handleChangeAnswers(id, []);
      }
    }
    handleChangeAnswerType(id, aType);
  };

  const removeAnswer = (answerId) => {
    handleChangeAnswers(
      id,
      answers.filter((item) => item.id !== answerId)
    );
  };

  const addAnswer = () => {
    let nextId = 0;
    if (answers.length > 0) {
      const orderedAnswers = answers.slice().sort((a, b) => {
        return a.id < b.id;
      });
      nextId = orderedAnswers[orderedAnswers.length - 1].id + 1;
    }
    handleChangeAnswers(id, [...answers, { id: nextId, label: '' }]);
  };

  const updateAnswer = (answerId, event) => {
    const answerIndex = answers.findIndex((item) => item.id === answerId);
    const tempAnswers = [...answers];
    tempAnswers[answerIndex].label = event.target.value;
    handleChangeAnswers(id, tempAnswers);
  };

  const renderViewModeAnswers = () => {
    if (!answerType) {
      return;
    }
    switch (answerType.id) {
      case 1:
        return <Input type="text" />;
      case 2:
        return (
          <FormGroup>
            {answers.map((answer) => {
              return (
                <CustomInput
                  key={answer.id}
                  type="checkbox"
                  id={`checkbox${qId}_${answer.id}`}
                  name={`checkbox${qId}`}
                  label={answer.label}
                />
              );
            })}
          </FormGroup>
        );
      case 3:
        return (
          <FormGroup>
            {answers.map((answer) => {
              return (
                <CustomInput
                  key={answer.id}
                  type="radio"
                  name={`radio${qId}`}
                  id={`radio${qId}_${answer.id}`}
                  label={answer.label}
                />
              );
            })}
          </FormGroup>
        );
      default:
        return (
          <Input type="text" placeholder="" value="" onChange={() => {}} />
        );
    }
  };

  return (
    <Card className={`question d-flex mb-4 ${mode}`}>
      <div className="d-flex flex-grow-1 min-width-zero">
        <div className="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
          <div className="list-item-heading mb-0 truncate w-80 mb-1 mt-1">
            <span className="heading-number d-inline-block">{order + 1}</span>
            {qTitle}
          </div>
        </div>
        <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
          <Button
            outline
            color="theme-3"
            className="icon-button ml-1 edit-button"
            onClick={() => editClick()}
          >
            <i className="simple-icon-pencil" />
          </Button>

          <Button
            outline
            color="theme-3"
            className="icon-button ml-1 view-button no-border"
            onClick={() => viewClick()}
          >
            <i className="simple-icon-eye" />
          </Button>

          <Button
            outline
            color="theme-3"
            className={`icon-button ml-1 rotate-icon-click ${
              collapse ? 'rotate' : ''
            }`}
            onClick={() => setCollapse(!collapse)}
          >
            <i className="simple-icon-arrow-down" />
          </Button>

          <Button
            outline
            color="theme-3"
            className="icon-button ml-1"
            onClick={() => deleteClick(qId)}
          >
            <i className="simple-icon-ban" />
          </Button>
        </div>
      </div>

      <Collapse isOpen={collapse}>
        <div className="card-body pt-0">
          <div className="edit-mode">
            <Form>
              {/* <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={qTitle}
                  onChange={(event) => setQTitle(event.target.value)}
                />
              </FormGroup> */}

              <FormGroup>
                <Label>Question</Label>
                <Input
                  type="text"
                  value={question}
                  onChange={(event) =>
                    handleChangeQuestion(id, event.target.value)
                  }
                />
              </FormGroup>
              <div className="separator mb-4 mt-4" />

              <FormGroup>
                <Label>Answer Type</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className="react-select"
                  classNamePrefix="react-select"
                  name="form-field-name"
                  value={answerType}
                  onChange={(t) => typeChange(t)}
                  options={answerTypes}
                />
              </FormGroup>
              {answers.length > 0 && <Label>Answers</Label>}

              <ReactSortable
                list={answers}
                setList={(newState) => handleChangeAnswers(id, newState)}
                className="answers"
                options={{
                  handle: '.handle',
                }}
              >
                {answers.map((item) => {
                  return (
                    <FormGroup data-id={item.id} key={item.id} className="mb-1">
                      <Input
                        type="text"
                        value={item.label}
                        autoFocus
                        onChange={(event) => {
                          updateAnswer(item.id, event);
                        }}
                      />
                      <div className="input-icons">
                        <Badge className="handle" color="empty" pill>
                          <i className="simple-icon-cursor-move" />
                        </Badge>
                        <Badge
                          color="empty"
                          pill
                          onClick={() => removeAnswer(item.id)}
                        >
                          <i className="simple-icon-close" />
                        </Badge>
                      </div>
                    </FormGroup>
                  );
                })}
              </ReactSortable>

              <div className="text-center">
                {answerType && answerType.id !== 1 && (
                  <Button
                    outline
                    color="primary"
                    className="mt-3"
                    onClick={() => addAnswer()}
                  >
                    <i className="simple-icon-plus btn-group-icon" /> Add Answer
                  </Button>
                )}
              </div>
            </Form>
          </div>
          <div className="view-mode">
            <FormGroup>
              <Label>{question}</Label>
              {renderViewModeAnswers()}
            </FormGroup>
          </div>
        </div>
      </Collapse>
    </Card>
  );
};
export default QuestionBuilder;
