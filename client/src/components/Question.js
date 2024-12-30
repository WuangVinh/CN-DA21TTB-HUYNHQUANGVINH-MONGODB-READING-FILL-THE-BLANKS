import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box 
} from '@material-ui/core';

const Question = ({ question, onSubmit, questionNumber, totalQuestions }) => {
  if (!question || !question.blanks) {
    return <div>Loading question...</div>;
  }

  const [answers, setAnswers] = useState(Array(question.blanks.length).fill(''));

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
    setAnswers(Array(question.blanks.length).fill(''));
  };

  const renderQuestionText = () => {
    const parts = question.text.split('_');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <TextField
            size="small"
            variant="outlined"
            value={answers[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            style={{ margin: '0 8px', width: '120px' }}
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Question {questionNumber} of {totalQuestions}
      </Typography>
      
      <Box my={3}>
        <Typography variant="body1">
          {renderQuestionText()}
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        disabled={answers.some(answer => !answer)}
      >
        Submit Answer
      </Button>
    </div>
  );
};

export default Question;