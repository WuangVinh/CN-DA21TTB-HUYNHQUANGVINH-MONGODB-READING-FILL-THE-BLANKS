import React from 'react';
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Grid, 
    makeStyles 
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const QuestionFilter = ({ difficulty, category, onDifficultyChange, onCategoryChange }) => {
    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                        value={difficulty}
                        onChange={(e) => onDifficultyChange(e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="grammar">Grammar</MenuItem>
                        <MenuItem value="vocabulary">Vocabulary</MenuItem>
                        <MenuItem value="reading">Reading</MenuItem>
                        <MenuItem value="listening">Listening</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default QuestionFilter;
