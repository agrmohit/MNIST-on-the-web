let gridSize = 28;

// number to fill when we hover on the respective cell
// 1 - default
// 0 - eraser activated
let onhover = 1;

let displayVariable = 999;

function get2DArray(size) {
  let arr = new Array(size);
  for (let i = 0; i < size; i++) arr[i] = new Array(size);

  for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) arr[i][j] = 0;
  return arr;
}

const ar = get2DArray(gridSize);

function createGrid() {
  let curIndex = 0;
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, ${
    1 / gridSize
  }fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${
    1 / gridSize
  }fr)`;
  for (let i = 0; i < gridSize; ++i) {
    for (let j = 0; j < gridSize; ++j) {
      const div = document.createElement("div");
      div.className = `grid-item cell-${curIndex}`;
      curIndex++;
      gridContainer.appendChild(div);
    }
  }
}

function setGridColor(color, reset) {
  gridItemAll = document.querySelectorAll(".grid-item");
  gridItemAll.forEach((gridItem) => {
    if (reset) {
      gridItem.style.backgroundColor = "white";
    }
    gridItem.addEventListener("mouseover", (e) => {
      e.target.style.backgroundColor = color;
      let id = gridItem.classList[1].split("-")[1];
      let i = Math.floor(id / gridSize);
      let j = Math.floor(id % gridSize);
      if (e.target.style.backgroundColor === "black") ar[i][j] = onhover;

      console.log(JSON.stringify(ar));
      fetch("http://localhost:5000/predict", {
        method: "POST",
        body: JSON.stringify({ indices: ar }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((res) => res.json())
        .then((data) => {
          el = document.getElementById("output");
          el.innerHTML = `OUTPUT: ${data.output}`;
        })
        .catch((err) => console.error(`ERROR: ${err}`));
    });
  });
}

function resetGrid() {
  setGridColor("black", true);
  for (let i = 0; i < gridSize; i++)
    for (let j = 0; j < gridSize; j++) ar[i][j] = 0;
}

createGrid();

let gridItemAll = document.querySelectorAll(".grid-item");

resetGrid();

function eraserActivate() {
  setGridColor("white", false);
  onhover = 0;
}

function eraserDeactivate() {
  setGridColor("black", false);
  onhover = 1;
}

const eraserBtn = document.querySelector("#eraser");
eraserBtn.addEventListener("click", eraserActivate);

const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", resetGrid);

const blackBtn = document.querySelector("#black");
blackBtn.addEventListener("click", eraserDeactivate);
