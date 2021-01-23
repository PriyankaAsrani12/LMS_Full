import React, { useState, useEffect } from 'react';

import { Row, Button, ButtonDropdown } from 'reactstrap';

import { Colxx } from '../../components/common/CustomBootstrap';
import QuestionBuilder from './QuestionBuilder';

const ShowQuiz = ({
  questions,
  updateQuiz,
  uploadQuiz,
  chapterNo,
  lessonNo,
}) => {
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  // const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    let nextId = 0;
    if (questions.length > 0) {
      const ordered = questions.slice().sort((a, b) => {
        return a.id < b.id;
      });
      console.log(ordered);
      nextId = ordered[ordered.length - 1].id + 1;
      console.log(nextId);
    }
    const newQuestions = [...questions];
    newQuestions.push({
      id: nextId,
      title: '',
      question: '',
      answerType: 1,
      answers: [],
    });
    // setQuestions(newQuestions);
    updateQuiz(chapterNo, lessonNo, newQuestions);
  };

  const handleChangeQuestion = (id, newQuestion) => {
    const newQuestions = [...questions];
    newQuestions.forEach((doc) => {
      if (doc.id == id) doc.question = newQuestion;
    });
    // setQuestions(newQuestions);
    updateQuiz(chapterNo, lessonNo, newQuestions);
  };

  const handleChangeAnswerType = (id, ansType) => {
    const newQuestions = [...questions];
    newQuestions.forEach((doc) => {
      if (doc.id == id) doc.answerType = ansType;
    });
    // setQuestions(newQuestions);
    updateQuiz(chapterNo, lessonNo, newQuestions);
  };

  const handleChangeAnswers = (id, newAnswers) => {
    const newQuestions = [...questions];
    newQuestions.forEach((doc) => {
      if (doc.id == id) doc.answers = newAnswers;
    });
    // setQuestions(newQuestions);
    updateQuiz(chapterNo, lessonNo, newQuestions);
  };

  const deleteQuestion = (id) => {
    let newQuestions = [...questions];
    newQuestions = newQuestions.filter((doc) => doc.id != id);
    // setQuestions(newQuestions);
    updateQuiz(chapterNo, lessonNo, newQuestions);
  };

  const handleSave = () => {
    console.log(questions);
    uploadQuiz(chapterNo, lessonNo, questions);
  };

  return (
    <>
      <Row className="app-row survey-app">
        <Colxx xxs="12">
          <h1>
            <span className="align-middle d-inline-block pt-1">Add Quiz</span>
          </h1>
          <div className="text-zero top-right-button-container">
            <ButtonDropdown
              className="top-right-button top-right-button-single"
              isOpen={dropdownSplitOpen}
              toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
            >
              <Button
                outline
                className="flex-grow-1"
                size="lg"
                color="primary"
                onClick={handleSave}
              >
                SAVE
              </Button>
              <Button
                outline
                className="flex-grow-1"
                size="lg"
                color="primary"
                onClick={() => updateQuiz(chapterNo, lessonNo, [])}
              >
                DELETE
              </Button>
            </ButtonDropdown>
          </div>

          <>
            <Row>
              <Colxx xxs="12" lg="8">
                <ul className="list-unstyled mb-4">
                  {questions.map((item, index) => {
                    return (
                      <li data-id={item.id} key={item.id}>
                        <QuestionBuilder
                          order={index}
                          {...item}
                          handleChangeQuestion={handleChangeQuestion}
                          handleChangeAnswerType={handleChangeAnswerType}
                          handleChangeAnswers={handleChangeAnswers}
                          expanded={!item.title && true}
                          deleteClick={(id) => deleteQuestion(id)}
                        />
                      </li>
                    );
                  })}
                </ul>

                <div className="text-center">
                  <Button
                    outline
                    color="primary"
                    className="mt-3"
                    onClick={() => addQuestion()}
                  >
                    <i className="simple-icon-plus btn-group-icon" /> Add
                    Question
                  </Button>
                </div>
              </Colxx>
            </Row>
          </>
        </Colxx>
      </Row>
    </>
  );
};

export default ShowQuiz;
