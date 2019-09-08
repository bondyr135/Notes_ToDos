import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { Link } from 'react-router-dom';

import axios from '../../axios-notes.js';

import './NewNote.css'

// •
//const bullet = <span>•</span>

class NewNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteTitle: '',
      noteBody: '',
      deadLine: null,
      urgency: 0,
      creation: null,

      deadLineTime: '',
      deadLineDate: '',
      min: '',
      max: '',
      edit: false
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.editNoteMounting = this.editNoteMounting.bind(this);
    this.newNoteMounting = this.newNoteMounting.bind(this);
    this.post = this.post.bind(this);
  };

  //CHECKS WETHER THIS IS A NEW NOTE, OR COMPONENT IS USED TO EDIT AN EXISTING NOTE
  componentDidMount() {
    this.props.edittedNote
      ? this.editNoteMounting(this.props.edittedNote)
      : this.newNoteMounting();
  }

  //IF THE NOTE IS ONLY EDITTED: INJECTING EXISTING DATA TO THE NOTE 
  editNoteMounting(edittedNote) {
    this.setState({
      noteTitle: edittedNote.title,//
      noteBody: edittedNote.body,//
      deadLine: edittedNote.deadLine,//
      urgency: edittedNote.priority,
      creation: edittedNote.creation,//
      deadLineTime: edittedNote.time,
      deadLineDate: edittedNote.date,
      edit: true
    })

    this.newNoteMounting();
  }

  //IF IT IS A NEW NOTE: SETTING SOME VALUES BASED ON CURRENT DATE
  newNoteMounting() {
    const now = new Date();
    const nowNextYear = new Date();
    nowNextYear.setFullYear(now.getFullYear() + 1);

    now.setHours(now.getHours() + 1);
    now.setSeconds(0);
    nowNextYear.setSeconds(0);

    this.setState({ min: now, max: nowNextYear });
  }

  //RECEIVING DATA FROM USER
  onChangeHandler(event) {
    let toBeDeadLine;
    switch (event.target.name) {
      case 'title':
        this.setState({ noteTitle: event.target.value });
        break;
      case 'body':
        this.setState({ noteBody: event.target.value });
        break;
      case 'deadDate':
        toBeDeadLine = new Date(`${event.target.value}, ${this.state.deadLineTime}`);
        this.setState({ deadLineDate: event.target.value, deadLine: toBeDeadLine });
        break;
      case 'deadTime':
        toBeDeadLine = new Date(`${this.state.deadLineDate}, ${event.target.value}`);
        toBeDeadLine.setSeconds(0);
        this.setState({ deadLine: toBeDeadLine, deadLineTime: event.target.value });
        break;
      case 'urgency':
        this.setState({ urgency: event.target.value });
        break;
      default:
        return this.state;
    }
  };

  //SUBMITION HANDLER- WHEN APP IS FULLY FUNCTIONING
  onSubmit() {
    const note = {
      title: this.state.noteTitle,
      deadLine: this.state.deadLine,
      body: this.state.noteBody,
      urgency: this.state.urgency,
      creation: (new Date()).setSeconds(0)
    }
    
    this.state.edit
      ? axios.delete(`/notes/${this.props.edittedNote.serverKey}.json`)
        .then(res => {
          this.post(note);
        })
        .catch(err => console.log(err))
      : this.post(note);
    alert('Trying to post on the server');
  }

  //AGAIN- DUE TO PRIVACY ISSUES, THIS IS THE FUNCTION TO BE USED 
  onSubmitOfline() {
    alert('This will not wort since there is no AXIOS details, due to privacy matters. Sorry');
    window.location.reload();
  }

  //POSTING -\_/-
  post(note) {
    axios.post('/notes.json', note)
      .then(res => window.location.reload())
      .catch(err => console.log(err));
  }

  render() {
    const dateError = (!this.state.deadLine
      || this.state.deadLine - this.state.min < 0
      || this.state.deadLine - this.state.max > 0
      || this.state.deadLineTime.trim() === '');

    const textError = this.state.noteBody.trim() === ''
      || this.state.noteTitle.trim() === '';

    return (
      <Paper className="paper" elevation={10} component='form'>
        <Typography variant="h4" component="h1">{this.state.edit ? 'Edit your Note' : 'Have a Note?'}</Typography>
        <br />
        <Tooltip 
        open={this.state.noteTitle.length >= 10} 
        title="The title can only be up to 13 letters long"
        placement="right"
        >
        <TextField
          label='Title'
          name="title"
          className="title"
          value={this.state.noteTitle}
          onChange={this.onChangeHandler}
          inputProps={{ maxLength: 13 }}
        />
        </Tooltip>
        <br /><br />
        <Tooltip
        title="The date can only be upto one year from now"
        position="right"
        open={this.state.deadLineDate === ''}>
        <TextField
          label="Deadline date"
          name="deadDate"
          className="date"
          value={this.state.deadLineDate}
          InputLabelProps={{ shrink: true, required: true }}
          type="date"
          inputProps={{
            min: this.state.deadLineDate.minDate,
            max: this.state.deadLineDate.maxDate
          }}
          defaultValue={this.state.minDate}
          onChange={this.onChangeHandler}
        />
        </Tooltip>

        <Tooltip
        title="Dead-line must be at least two hours from now"
        open={this.state.deadLineTime === ''}
        position="left">
        <TextField
          label="Deadline time"
          name="deadTime"
          className="time"
          value={this.state.deadLineTime}
          InputLabelProps={{ shrink: true, required: true }}
          type="time"
          onChange={this.onChangeHandler}
        />
        </Tooltip>
        <br /><br /><br /><br />
        <TextField
          multiline
          label="Body"
          name="body"
          className="body"
          value={this.state.noteBody}
          rows="5"
          variant="outlined"
          onChange={this.onChangeHandler}
        />
        <br /><br />
        <TextField
          label="urgency"
          name="urgency"
          value={this.state.urgency}
          type="number"
          inputProps={{ min: "0", max: "10" }}
          onChange={this.onChangeHandler}
        />
        <br />
        <Button
          type="submit"
          disabled={dateError || textError}
          variant="contained"
          color="primary"
          onClick={this.onSubmitOfline}
          className="submit_button"
        >
          <Link className="submit_link" to="/">
            Submit
          </Link>
        </Button>
      </Paper>
    )
  }
}

export default NewNote;