import React from 'react';
import {
  Card,
  CardBody,
  Label,
  FormGroup,
  CustomInput,
  Input,
} from 'reactstrap';

// import CustomInput from '../../'

const RenderViewModeAnswers = ({ answerType, answers, qId }) => {
  if (!answerType) {
    return null;
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
      return <Input type="text" placeholder="" value="" onChange={() => {}} />;
  }
};

const Preview = ({ quiz }) => {
  // const [qId] = useState(id);

  return (
    <>
      {quiz.map((doc) => {
        return (
          <Card id={doc.id}>
            <CardBody>
              <Label>{doc.question}</Label>
              <RenderViewModeAnswers
                answerType={doc.answerType}
                answers={doc.answers}
                qId={doc.id}
              />
            </CardBody>
          </Card>
        );
      })}
    </>
  );
};

export default Preview;
