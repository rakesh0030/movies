import React, { Component } from 'react';
import './App.css';
import Movies from './containers/Movies/Movies';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Movies/>
      </div>
    );
  }
}

export default App;
