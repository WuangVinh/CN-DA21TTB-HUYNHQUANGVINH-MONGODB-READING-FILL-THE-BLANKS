import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Header from './components/Header';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
    const history = useHistory();

    useEffect(() => {
        // Kiểm tra xem có redirect sau đăng nhập không
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
            // Xóa redirect path từ localStorage
            localStorage.removeItem('redirectAfterLogin');
            // Chuyển hướng đến trang được chỉ định
            history.push(redirectPath);
        }
    }, [history]);

    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" exact component={QuizList} />
                    <Route path="/quiz/:id" component={Quiz} />
                    <Route path="/result" component={Result} />
                    <Route path="/register" component={Register} />
                    <Route path="/profile" component={Profile} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
