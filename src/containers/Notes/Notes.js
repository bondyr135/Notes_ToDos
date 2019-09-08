import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Modal from '../../components/Modal/Modal';

import './Notes.css';

import axios from '../../axios-notes.js';
import Note from '../../components/Note/Note';
import { sortNotes, sortDeadLine } from '../sort';



const uuid = require('uuid/v4');

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      notesForModal: [],
      colorChart: [],
      open: false,
      noteForDisplay: null
    }
    this.sortNotes = this.sortNotes.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.sortByDeadLine = this.sortByDeadLine.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  // REACHING FOR EXISTING NOTES
  // ORIGINALLY- THESES WERE FETCHED FROM A SERVER,
  // DUE TO PRIVACY ISSUES- THESE ARE IMPORTED FROM A NEAR FILE
  componentDidMount() {
    this.setState({ notes: [], colorChart: this.props.colorChart });
    axios.get('https://PROJECT_NAME.firebaseio.com/notes.json')
      .then(res => {
        this.parseNotes(res.data);
      })
      .catch(rej => {
        console.log('This is only so the REJECT will be handled');
        let outDatedNotes = [];
        const now = new Date();
        const create = new Date('September 1, 2019 10:00:00');
        let toBeNotes = this.props.fakeEvents.map((item, index) => {
          let serverKey = uuid();
          const urg = Math.floor(Math.random() * 10);
          const parsedNote = {
            title: item.title,
            body: item.body,
            creation: create,
            deadLine: this.props.dates[index],
            urgency: urg,
            serverKey: serverKey
          }
          if (new Date(this.props.dates[index]) - now <= 0) {
            outDatedNotes.push(parsedNote);
          }
          return parsedNote;
        })
        this.setState({ colorChart: this.props.colorChart, notes: toBeNotes, notesForModal: outDatedNotes });
      })
  };


  //PARSING EXISTING NOTES
  // NORMALLY IS USED, AND IT WORKS!!!
  parseNotes = (data) => {
    let toBeNotes = [];
    let outDatedNotes = [];
    const now = new Date()
    for (let id in data) {
      //let serverKey = id;
      toBeNotes.push({ ...data[id], id });
      if (new Date(data[id].deadLine) - now <= 0) {
        outDatedNotes.push(id);
      }
    }
    this.setState({ colorChart: this.props.colorChart, notes: toBeNotes, notesForModal: outDatedNotes });
  }

  //SORTING NOTES BY DIFFERENT PARAMETERS
  sortNotes(notes, param) {
    sortNotes(notes, param)
      .then(res => {
        this.setState({ notes: res });
      })
  }

  sortByDeadLine(notes) {
    sortDeadLine(notes)
      .then(res => {
        this.setState({ note: res });
      })
  }

  onChangeHandler(e, v) {
    switch (v) {
      case 'posting':
        this.sortNotes(this.state.notes, 'creation');
        break;
      case 'urgency':
        this.sortNotes(this.state.notes, 'urgency');
        break;
      case 'deadline':
        this.sortByDeadLine(this.state.notes, 'deadLine');
        break;
      default:
        return this.state;
    }
  }

  //EXPAND CHOSEN NOTE
  handleClick(event) {
    this.setState({ noteForModal: event, open: true });
  }

  //CLOSES EXPANDED NOTE
  handleClose() {
    this.setState({ open: false })
  }

  //DELETION- AS IT WAS ORIGINALLY WRITTEN, 
  //WHEN COMUNICATION WITH SERVER WAS ABLED
  deleteRequest(serverKey) {
    const res = window.confirm('Are you sure you want to delete this note?');
    if (res) {
      axios.delete(`/notes/${serverKey}.json`)
        .then(res => window.location.reload())
        .catch(err => alert('Something went wrong'));
    } else {
      return;
    }
  }

  deleteRequestOfline(sk) {
    const res = window.confirm('Are you sure you want to delete this note?');
    if (res) {
      let toBeDeleted;
      toBeDeleted = this.state.notes.findIndex(note => {
        return note.serverKey === sk
      });
      this.setState(prevState => {
        prevState.notes.splice(toBeDeleted, 1)
        return { notes: prevState.notes }
      })
    }
  }

  render() {
    return (
      <Box display="flex" justifyContent="space-around" flexDirection="row" flexWrap="wrap" className="box_container">
        {this.state.open
          ? <Modal
            isOpen={this.state.open}
            handleClose={this.handleClose}
            click={this.handleClick}
            note={this.state.noteForModal}
            deleteNote={(id) => this.deleteRequestOfline(id)}
          />
          : null}
        <RadioGroup style={{ position: 'fix', marginTop: '5%', marginLeft: '5%' }} onChange={this.onChangeHandler}>
          <FormControlLabel
            value="posting"
            label="Sort by posting date"
            labelPlacement="end"
            control={<Radio color="primary" />}
          />
          <FormControlLabel
            value="urgency"
            label="Sort by priority"
            labelPlacement="end"
            control={<Radio color="primary" />}
          />
          <FormControlLabel
            value="deadline"
            label="Sort by dead-line"
            labelPlacement="end"
            control={<Radio color="primary" />}
          />
        </RadioGroup>
        {this.state.notes.map(note => {
          let classToBe = "box_element";
          if (this.state.notesForModal.includes(note.serverKey)) {
            classToBe += " expired"
          }
          return (
            <Box className={classToBe} key={note.serverKey}>
              <Note
                key={note.serverKey}
                color={this.props.colorChart[note.urgency]}
                click={(e) => this.handleClick(e)}
                onDelete={(id) => this.deleteRequestOfline(id)}
                {...note}
              />
            </Box>
          )
        })}
      </Box>
    )
  };
}

export default Notes;

