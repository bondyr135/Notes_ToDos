import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from './axios-notes.js';


import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Notes from './containers/Notes/Notes';
import NewNote from './components/NewNote/NewNote';
import EditNote from './containers/editNote/editNote';

import colorChart from './color-chart';
import fakeEvents from './fakeEvents';
import { dates } from './dates';

import './style.css';


const theme = createMuiTheme();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      colors: []
    }
    this.onBrowsingHandler = this.onBrowsingHandler.bind(this);
  }

  //FETCHING THE COLOR MAP FROM SERVER
  componentDidMount() {
    axios.get('https://project-name.firebaseio.com/colorMap.json')
      .then(res => this.setState({ colors: res.data, page: 0 }))
      .catch(rej => {
        this.setState({ colors: colorChart, page: 0 })
        console.log('This is only so the REJECT will be handled')
      });
  }

  onBrowsingHandler = (e, v) => {
    this.setState({ page: v });
  };


  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <div className="App">
            <Router>
              <AppBar position="fixed" row="true" style={{ height: '50px' }}>
                <Tabs value={this.state.page} onChange={this.onBrowsingHandler}>
                  <Tab label="All Notes" component={Link} to="/" />
                  <Tab label="New Note" component={Link} to={{
                    pathname: "/newNote",
                    state: {
                      edit: false
                    }
                  }} />
                </Tabs>
              </AppBar>
              <Switch>
                {this.state.page === 0 &&
                  <Route exact path="/" render={() => <Notes fakeEvents={fakeEvents} dates={dates} colorChart={this.state.colors} />} />}
                {this.state.page === 1 &&
                  <Route path="/newNote" component={NewNote} />}
                <Route path="/editNote/:serverKey" component={EditNote} />
              </Switch>
            </Router>
          </div>
        </CssBaseline>
      </MuiThemeProvider>
    );
  }

}

render(<App />, document.getElementById('root'));
