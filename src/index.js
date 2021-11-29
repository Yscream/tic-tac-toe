import { generateRows } from "./generateField";
window.addEventListener("load", reload);

let game = {
  player: "ch",
  saveID: [],
  saveClass: [],
  saveRedo: [],
  saveRedoClass: [],
};

const winMessage = document.querySelector(".won-title");
const childsOfField = document.querySelector(".field").childNodes;
const redo1 = document.querySelector(".redo-btn");
const undo1 = document.querySelector(".undo-btn");
const restart1 = document.querySelector(".restart-btn");
const field1 = document.querySelector(".field");
const cells = document.querySelectorAll(".cell");

function restart() {
  game.saveClass.forEach((elem) => {
    elem.classList.remove(
      "ch",
      "r",
      "win",
      "horizontal",
      "vertical",
      "diagonal-right",
      "diagonal-left"
    );
  });
  localStorage.clear();
  for (let i in game) delete game[i];
  setKeyValue(game);
  hideMessage();
  enableGame();
}

function hideMessage() {
  winMessage.classList.add("hidden");
}

function setKeyValue(obj) {
  obj.player = "ch";
  obj.saveID = [];
  obj.saveClass = [];
  obj.saveRedo = [];
  obj.saveRedoClass = [];
}

function enableGame() {
  field1.addEventListener("click", step);
}

function disabledGame() {
  field1.removeEventListener("click", step);
  undo1.disabled = true;
  redo1.disabled = true;
}

function checkUndoRedo() {
  undo1.addEventListener("click", undo);
  redo1.addEventListener("click", redo);
  //check undo
  if (game.saveClass.length > 0) {
    undo1.disabled = false;
  } else {
    undo1.disabled = true;
  }
  //check redo
  if (game.saveRedo.length > 0) {
    redo1.disabled = false;
  } else {
    redo1.disabled = true;
  }
}

function returnAddresses(elem) {
  game.saveClass.push(elem);
  game.saveID.push(elem.id);
}

function saveAddresses(elem) {
  game.saveRedo.push(elem);
  game.saveRedoClass.push(elem.className);
}

function deleteElems(key1, key2) {
  game[key1].pop(); //saveID
  game[key2].pop(); //saveClass
}

function saveAttributes(elem) {
  game.saveClass.push(elem);
  game.saveID.push(elem.id);
}

function saveLocalStorage(object, key1, key2) {
  localStorage.setItem("cell", JSON.stringify(object[key1]));
  localStorage.setItem("player", object[key2]);
}

function loadLocalStorage() {
  game.parseId = JSON.parse(localStorage.getItem("cell"));
  game.parsePlayer = localStorage.getItem("player");
}

function reload() {
  field1.addEventListener("click", step);
  loadLocalStorage();
  for (let i = 0; i < game.parseId.length; i++) {
    const generateCells = document.getElementById(game.parseId[i]);
    if (game.parsePlayer === "ch") {
      generateCells.classList.add("ch");
      game.parsePlayer = "r";
      saveAttributes(generateCells);
    } else {
      generateCells.classList.add("r");
      game.parsePlayer = "ch";
      saveAttributes(generateCells);
    }
  }
  saveLocalStorage(game, "saveID", "parsePlayer");
  checkWin();
  checkUndoRedo();
}

function undo() {
  loadLocalStorage();
  const lastElem = game.saveClass[game.saveClass.length - 1];
  if (lastElem.className === "cell ch") {
    saveAddresses(lastElem);
    lastElem.classList.remove("ch");
    game.player = "ch";
  } else {
    saveAddresses(lastElem);
    lastElem.classList.remove("r");
    game.player = "r";
  }
  deleteElems("saveID", "saveClass");
  saveLocalStorage(game, "saveID", "player");
  checkUndoRedo();
}

function redo() {
  loadLocalStorage();
  const lastElem = game.saveRedo[game.saveRedo.length - 1];
  const lastClass = game.saveRedoClass[game.saveRedoClass.length - 1];
  if (lastClass === "cell ch") {
    lastElem.classList.add("ch");
    game.player = "r";
    returnAddresses(lastElem);
  } else {
    lastElem.classList.add("r");
    game.player = "ch";
    returnAddresses(lastElem);
  }
  deleteElems("saveRedo", "saveRedoClass");
  saveLocalStorage(game, "saveID", "player");
  checkUndoRedo();
}

function alertMessage(inner) {
  winMessage.classList.remove("hidden");
  document.querySelector(".won-message").innerHTML = inner;
}

function checkHorizontal() {
  for (let i = 0; i < childsOfField.length; i++) {
    const cellsWithClassLength =
      childsOfField[i].getElementsByClassName("cell").length;
    if (
      childsOfField[i].getElementsByClassName("cell ch").length ===
      cellsWithClassLength
    ) {
      childsOfField[i].childNodes.forEach((elem) => {
        elem.classList.add("win", "horizontal");
      });
      disabledGame();
      alertMessage("Crosses won!");
    } else if (
      childsOfField[i].getElementsByClassName("cell r").length ===
      cellsWithClassLength
    ) {
      childsOfField[i].childNodes.forEach((elem) => {
        elem.classList.add("win", "horizontal");
      });
      disabledGame();
      alertMessage("Toes won!");
    }
  }
}

function checkVertical() {
  const rows = document.querySelectorAll(".row");
  let winningCombination = [];
  for (let i = 0; i < rows.length; i++) {
    let line = [];
    for (let j = 0; j < rows.length; j++) {
      let index = j * 3 + i;
      line.push(cells[index]);
    }
    winningCombination.push(line);
  }
  for (let i = 0; i < rows.length; i++) {
    const cellCh = winningCombination[i].filter((elem) => {
      return elem.className === "cell ch";
    });
    const cellR = winningCombination[i].filter((elem) => {
      return elem.className === "cell r";
    });
    if (cellCh.length === childsOfField.length) {
      cellCh.forEach((elem) => {
        elem.classList.add("win", "vertical");
      });
      disabledGame();
      alertMessage("Crosses won!");
    } else if (cellR.length === childsOfField.length) {
      cellR.forEach((elem) => {
        elem.classList.add("win", "vertical");
      });
      disabledGame();
      alertMessage("Toes won!");
    }
  }
}

function checkDiagonalRight() {
  let winningCombination = [];
  for (let j = 0; j < childsOfField.length; j++) {
    winningCombination.push(childsOfField[j].childNodes[j]);
  }
  const cellCh = winningCombination.filter((elem) => {
    return elem.className === "cell ch";
  });
  const cellR = winningCombination.filter((elem) => {
    return elem.className === "cell r";
  });
  if (cellCh.length === childsOfField.length) {
    winningCombination.forEach((elem) => {
      elem.classList.add("win", "diagonal-right");
    });
    disabledGame();
    alertMessage("Crosses won!");
  } else if (cellR.length === childsOfField.length) {
    winningCombination.forEach((elem) => {
      elem.classList.add("win", "diagonal-right");
    });
    disabledGame();
    alertMessage("Toes won!");
  }
}

function checkDiagonalLeft() {
  let winningCombination = [];
  let countCell = 1;
  for (let i = 0; i < childsOfField.length; i++) {
    winningCombination.push(
      childsOfField[i].childNodes[
        childsOfField[i].childNodes.length - countCell
      ]
    );
    countCell++;
  }
  const cellCh = winningCombination.filter((elem) => {
    return elem.className === "cell ch";
  });
  const cellR = winningCombination.filter((elem) => {
    return elem.className === "cell r";
  });
  if (cellCh.length === childsOfField.length) {
    winningCombination.forEach((elem) => {
      elem.classList.add("win", "diagonal-left");
    });
    disabledGame();
    alertMessage("Crosses won!");
  } else if (cellR.length === childsOfField.length) {
    winningCombination.forEach((elem) => {
      elem.classList.add("win", "diagonal-left");
    });
    disabledGame();
    alertMessage("Toes won!");
  }
}

function checkWin() {
  const H = checkHorizontal();
  const DR = checkDiagonalRight();
  const DL = checkDiagonalLeft();
  const V = checkVertical();
  if (!H && !DR && !DL && !V) {
    if (game.saveClass.length === cells.length) {
      alertMessage("It&#8217;s a draw!");
    }
  }
  restart1.addEventListener("click", restart);
}

function step(event) {
  if (!event.target.classList.contains("cell")) {
    return;
  }
  const element = event.target;
  if (game.player === "ch") {
    element.classList.add("ch");
    game.player = "r";
    saveAttributes(element);
  } else if (game.player === "r") {
    element.classList.add("r");
    game.player = "ch";
    saveAttributes(element);
  }
  saveLocalStorage(game, "saveID", "player");
  checkUndoRedo();
  checkWin();
}
