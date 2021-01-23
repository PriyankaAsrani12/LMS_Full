import React from 'react';
import { Card, CardBody } from 'reactstrap';

import ShowQuiz from './ShowQuiz';

const Index = ({ questions, updateQuiz, uploadQuiz, chapterNo, lessonNo }) => {
  return (
    <>
      <Card>
        <CardBody>
          <ShowQuiz
            uploadQuiz={uploadQuiz}
            chapterNo={chapterNo}
            lessonNo={lessonNo}
            questions={questions}
            updateQuiz={updateQuiz}
          />
        </CardBody>
      </Card>
      <br />
    </>
  );
};
export default Index;
