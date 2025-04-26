const canvas = document.getElementById("floorCanvas");
const ctx = canvas.getContext("2d");

let scale = 1;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastX, lastY;
let roomsData = [];

function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 120;
  adjustScaleToFit();
  if (roomsData.length > 0) {
    drawRooms(roomsData);
  }
}

function adjustScaleToFit() {
  if (roomsData.length === 0) return;
  const maxWidth = Math.max(...roomsData.flatMap(room => room.points.map(p => p.x)));
  const maxHeight = Math.max(...roomsData.flatMap(room => room.points.map(p => p.y)));
  const scaleX = canvas.width / maxWidth;
  const scaleY = canvas.height / maxHeight;
  scale = Math.min(scaleX, scaleY) * 0.85;
  offsetX = 0;
  offsetY = 0;
}

function clearCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRooms(rooms) {
  clearCanvas();
  ctx.save();
  ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  ctx.scale(scale, scale);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  rooms.forEach(drawRoom);
  ctx.restore();
}

function drawRoom(room) {
  if (room.name.toLowerCase().includes("boundary")) {
    ctx.beginPath();
    const firstPoint = room.points[0];
    ctx.moveTo(firstPoint.x, firstPoint.y);
    room.points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.beginPath();
    const firstPoint = room.points[0];
    ctx.moveTo(firstPoint.x, firstPoint.y);
    room.points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    // Use highlightColor if set; otherwise, use room.color (or a random color)
    ctx.fillStyle = room.highlightColor ? room.highlightColor : (room.color || getRandomColor());
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label the room within its area
    drawRoomLabel(room);
  }
}

function drawRoomLabel(room) {
  // Calculate bounding box
  const minX = Math.min(...room.points.map(p => p.x));
  const maxX = Math.max(...room.points.map(p => p.x));
  const minY = Math.min(...room.points.map(p => p.y));
  const maxY = Math.max(...room.points.map(p => p.y));
  
  // Center of the room
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const roomWidth = maxX - minX;
  const roomHeight = maxY - minY;
  
  // Choose font size relative to room dimensions
  const fontSize = Math.max(6, Math.min(roomWidth, roomHeight) / 6);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  ctx.fillText(room.name, centerX, centerY);
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 70%)`;
}

async function loadJson() {
  console.log("about to load json");
  try {
    const response = await fetch('/static/PG_2.json');
    console.log("reading done");
    let jsonData = await response.json();
    // Initialize each room with a default color and set highlightColor to that same color initially
    roomsData = jsonData.map(room => ({
      ...room,
      color: room.color || `hsl(${Math.random() * 360}, 70%, 70%)`,
      highlightColor: room.color || `hsl(${Math.random() * 360}, 70%, 70%)`
    }));
    adjustScaleToFit();
    drawRooms(roomsData);
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    offsetX += dx;
    offsetY += dy;
    lastX = e.clientX;
    lastY = e.clientY;
    drawRooms(roomsData);
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
  scale *= scaleFactor;
  scale = Math.min(Math.max(0.5, scale), 5);
  drawRooms(roomsData);
});

window.addEventListener("resize", updateCanvasSize);
updateCanvasSize();
loadJson();

function resetPosition() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  adjustScaleToFit();
  drawRooms(roomsData);
}

/**
 * Updates room highlight colors based on the provided current location and destination.
 * - Current location (if found) is highlighted in green.
 * - Destination (if found) is highlighted in light crimson red (using "lightcoral").
 * - All other rooms are grey.
 * - If either input is provided but not found, every room is drawn grey.
 */
function applyRoomHighlights(currentLocation, destination) {
  // Normalize inputs for case-insensitive comparison
  const current = currentLocation ? currentLocation.toLowerCase() : null;
  const dest = destination ? destination.toLowerCase() : null;

  // Check for the existence of the provided room names in roomsData
  const sourceFound = current ? roomsData.some(room => room.name.toLowerCase() === current) : false;
  const destinationFound = dest ? roomsData.some(room => room.name.toLowerCase() === dest) : false;

  // If either provided room is not found, highlight every room grey
  if ((current && !sourceFound) || (dest && !destinationFound)) {
    roomsData.forEach(room => {
      room.highlightColor = "grey";
    });
  } else {
    roomsData.forEach(room => {
      const roomName = room.name.toLowerCase();
      if (current && roomName === current) {
        room.highlightColor = "green";
      } else if (dest && roomName === dest) {
        room.highlightColor = "lightcoral";
      } else {
        room.highlightColor = "grey";
      }
    });
  }
  drawRooms(roomsData);
}

/**
 * Reads the current location and final destination from the input fields
 * and applies the corresponding room highlights.
 * Called when the "Go" button is clicked.
 */
function findRoute() {
  const currentLocationInput = document.getElementById("currentLocation").value.trim();
  const finalDestinationInput = document.getElementById("finalDestination").value.trim();
  
  // If both fields are empty, reset room highlights to their default colors
  if (!currentLocationInput && !finalDestinationInput) {
    roomsData.forEach(room => {
      room.highlightColor = room.color;
    });
    drawRooms(roomsData);
    return;
  }
  
  applyRoomHighlights(currentLocationInput, finalDestinationInput);
}