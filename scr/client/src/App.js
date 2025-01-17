import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <Header isAuthenticated={isAuthenticated} />
                <Switch>
                    <Route path="/login">
                        <Login setIsAuthenticated={setIsAuthenticated} />
                    </Route>
                    <Route path="/register" component={Register} />
                    <Route path="/" exact component={QuizList} />
                    <PrivateRoute path="/quiz/:id" component={Quiz} />
                    <PrivateRoute path="/result" component={Result} />
                    <PrivateRoute path="/profile" component={Profile} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
