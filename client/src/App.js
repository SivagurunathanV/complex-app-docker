import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import SecondPage from './SecondPage'
import Fib from './Fib' 

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Link to="/"> Home </Link>
            <Link to="/secondPage"> SecondPage </Link>
          </header>
          <div>
            <Route exact path="/" component = {Fib} />
            <Route path="/secondPage" component = {SecondPage} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
