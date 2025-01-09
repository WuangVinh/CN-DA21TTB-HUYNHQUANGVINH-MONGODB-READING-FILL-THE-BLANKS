import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, ListItemText, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const AdminPanel = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newBlanks, setNewBlanks] = useState([{ position: 1, correctAnswer: '' }]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/questions');
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAddQuestion = async () => {
        try {
            const question = {
                text: newQuestion,
                blanks: newBlanks,
                difficulty: 'easy',
                category: 'grammar'
            };
            await axios.post('http://localhost:5000/api/questions', question);
            fetchQuestions();
            setNewQuestion('');
            setNewBlanks([{ position: 1, correctAnswer: '' }]);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/questions/${id}`);
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <TextField
                label="New Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                Add Question
            </Button>
            <List>
                {questions.map((question) => (
                    <ListItem key={question._id}>
                        <ListItemText primary={question.text} />
                        <IconButton edge="end" onClick={() => handleDeleteQuestion(question._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default AdminPanel;
