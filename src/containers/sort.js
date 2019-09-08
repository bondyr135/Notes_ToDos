
//OUTSOURCED SORTING FUNCTIONS
export async function sortNotes(notes, param) {
  let i = 1;
  while (i < notes.length) {
    let j = i;
    while (j > 0 && parseInt(notes[j - 1][param], 10) > parseInt(notes[j][param], 10)) {
      swapNotes(j, j - 1, notes);
      j -= 1;
    }
    while (j > 0 && notes[j - 1][param] === notes[j][param]) {
      if (notes[j - 1].deadLine > notes[j].deadLine) {
        swapNotes(j - 1, j, notes);
      }
      j -= 1;
    }
    i += 1;
  }
  return notes;
}

export function swapNotes (smaller, bigger, A) {
  const aux = A[smaller];
  A[smaller] = A[bigger];
  A[bigger] = aux;
  return A;
}

export async function sortDeadLine(notes) {
  let i = 1;
  while (i < notes.length) {
    let j = i;
    while (j > 0 && notes[j - 1].deadLine > notes[j].deadLine) {
      swapNotes(j, j - 1, notes);
      j -= 1;
    }
    while (j > 0 && notes[j - 1].deadLine === notes[j].deadLine) {
      if (notes[j - 1].urgency > notes[j].urgency) {
        swapNotes(j - 1, j, notes);
      }
      j -= 1;
    }
    i += 1;
  }
  return notes;
}