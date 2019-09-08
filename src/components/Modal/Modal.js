import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';

import './Modal.css';


const MONTHS = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Modal = (props) => {
  const [open, setOpen] = useState(props.isOpen);

  const DL = new Date(props.note.deadLine);
  const dd = DL.getDate();
  const mm = MONTHS[DL.getMonth()];
  const yyyy = DL.getFullYear();

  const hh = DL.getHours();
  const mn = DL.getMinutes();

  const today = new Date();

  let buttonToRender, closedOnClick, isExpired, title;

  if (today - DL < 0) {
    // Which means the node is NOT expired yet
    buttonToRender =
      <Button onClick={props.handleClose} color="primary" autoFocus>
        I remember now!
          </Button>;
    closedOnClick = props.handleClose;
    isExpired = '';
    title = (
      <DialogTitle className="priority_avatar_modal">
        <Typography className="priority">This note has the priority of &nbsp;</Typography>
        <Avatar className="avatar_modal" style={{ backgroundColor: props.note.color, border: '1px solid black' }}>{props.note.urgency}
        </Avatar>
      </DialogTitle>
    )
    console.log(props.children);
  } else {
    // The note has expired
    buttonToRender = (
      <React.Fragment>
        <Link
          className="edit"
          style={{ color: 'black' }}
          to={{
            pathname: `/editNote/:${props.serverKey}`,
            state: {
              title: props.note.title,
              body: props.note.body,
              creation: props.note.creation,
              deadLine: props.note.deadLine,
              serverKey: props.note.serverKey,
              urgency: props.note.urgency
            }
          }}
        >
          <Button color="secondary">
            Edit
      </Button>
        </Link>
        <Button onClick={onDeleteRequest} color="secondary">
          DELETE
      </Button>
      </React.Fragment>
    );
    closedOnClick = null;
    isExpired = '-expired';
    title = (
      <DialogTitle className="expired_title">
        <Typography className="expired_title_first" >
          This note has expired! &nbsp;
        </Typography>
        <br />
        <Typography className="expired_title_second">
          Edit or delete it
        </Typography>
      </DialogTitle >
    )
  };

  function onDeleteRequest(e) {
    props.deleteNote(props.note.serverKey);
  }

  return (
    <Dialog
      open={open}
      onClose={closedOnClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" >

      {title}

      <DialogTitle id="alert-dialog-slide-title">
        {props.note.title}&nbsp;
      </DialogTitle>

      <DialogContent>
        <DialogContentText id={"alert-dialog-description" + isExpired}>
          {props.note.body}
        </DialogContentText>
        <DialogContentText>
          Due at: {<b>{`${mm}\\${dd}\\${yyyy}`} </b>} {'at '}{<b>{`${hh}:${mn.toString().padStart(2, '0')}`}</b>}
        </DialogContentText>
      </DialogContent>

      <DialogActions className={isExpired}>
        {buttonToRender}
      </DialogActions>

    </Dialog>
  )
}

export default Modal;

