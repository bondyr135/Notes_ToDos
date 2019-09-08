import React from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import CssBaseline from '@material-ui/core/CssBaseline';

import './Note.css';

//const MONTHS = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NOW = new Date();

const note = (props) => {

  const DL = new Date(props.deadLine);


  const deleteRequest = () => {
    props.onDelete(props.serverKey);
  }

  const isClicked = (e) => {
    props.click(props);
  }

  const titleClass = DL - NOW < 0 ? " expired" : "";

  return (
    <CssBaseline>
      <Card className="note">
        <CardHeader className="header"
          avatar={
            <Avatar className="avatar" style={{ gridTemplate: 'avatar', backgroundColor: props.color, border: '1px solid #444' }}>
              {props.urgency}
            </Avatar>
          }
        />

        <span className="actions">
          <IconButton
            className="more"
            onClick={isClicked}
            aria-label="Show more">
            <AddCircleOutline />
          </IconButton>

          <IconButton
            className="delete"
            onClick={deleteRequest}>
            <Delete />
          </IconButton>

          <Link
            style={{ color: 'black' }}
            to={{
              pathname: `editNote/:${props.serverKey}`,
              state: {
                title: props.title,
                body: props.body,
                creation: props.creation,
                deadLine: props.deadLine,
                serverKey: props.serverKey,
                urgency: props.urgency
              }
            }}
          >
            <IconButton className="edit">
              <Edit />
            </IconButton >
          </Link>
        </span>

        <CardContent className="content">
          <Typography className="todo">
            I need to:
          </Typography>
          <Typography className={"title" + titleClass}>
            {props.title}
          </Typography>
        </CardContent>

      </Card>
    </CssBaseline>
  )
}

export default note;
