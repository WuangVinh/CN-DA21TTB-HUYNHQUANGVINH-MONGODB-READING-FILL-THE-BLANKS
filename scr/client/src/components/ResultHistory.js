import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@material-ui/core';

const ResultHistory = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/results');
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    return (
        <div>
            <h2>Result History</h2>
            <List>
                {results.map((result) => (
                    <ListItem key={result._id}>
                        <ListItemText
                            primary={`Score: ${result.score}/${result.totalQuestions}`}
                            secondary={`Completed at: ${new Date(result.completedAt).toLocaleString()}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ResultHistory;
