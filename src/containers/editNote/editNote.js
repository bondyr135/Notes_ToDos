import React from 'react';

import NewNote from '../../components/NewNote/NewNote';

const editNote = (props) => {
  const noteToEdit = props.location.state;

  // Grabbing deadLine data from editted note
  const usedDeadLine = new Date(noteToEdit.deadLine)

  const usedHours = `${usedDeadLine.getHours().toString().padStart(2, '0')}`;
  const usedMinutes = `${usedDeadLine.getMinutes().toString().padStart(2, '0')}`;
  const usedTime = `${usedHours}:${usedMinutes}`;

  const usedYear = `${usedDeadLine.getFullYear().toString().padStart(2, '0')}`;
  const usedMonth = `${(usedDeadLine.getMonth() + 1).toString().padStart(2, '0')}`;
  const usedDay = `${usedDeadLine.getDate().toString().padStart(2, '0')}`;
  const usedDate = `${usedYear}-${usedMonth}-${usedDay}`;


  const note = {
    time: usedTime,
    date: usedDate,
    deadLine: usedDeadLine,
    priority: noteToEdit.urgency,
    title: noteToEdit.title,
    body: noteToEdit.body,
    serverKey: noteToEdit.serverKey,
    edit: true
  }

  return (
    <NewNote edittedNote={note} />
  )
}

export default editNote;