var passengerCount = 0;
var BUS_CAPACITY   = parseInt(localStorage.getItem("busCapacity")) || 40;

var countDisplay = document.getElementById("count-display");
var seatsLeft    = document.getElementById("seats-left");
var statusBanner = document.getElementById("status-banner");
var log          = document.getElementById("log");
var btnBoard     = document.getElementById("btn-board");
var btnAlight    = document.getElementById("btn-alight");

function updateUI() {
  var remaining = BUS_CAPACITY - passengerCount;

  countDisplay.textContent = passengerCount;
  seatsLeft.textContent = "Seats remaining: " + remaining;

  if (passengerCount >= BUS_CAPACITY) {
    statusBanner.classList.remove("hidden");
    countDisplay.classList.add("full");
    btnBoard.disabled = true;
  } else {
    statusBanner.classList.add("hidden");
    countDisplay.classList.remove("full");
    btnBoard.disabled = false;
  }

  btnAlight.disabled = passengerCount === 0;
}

function board() {
  if (passengerCount < BUS_CAPACITY) {
    passengerCount = passengerCount + 1;
    updateUI();
  }
}

function alight() {
  if (passengerCount > 0) {
    passengerCount = passengerCount - 1;
    updateUI();
  }
}

function saveTrip() {
  var entry = "Trip saved — " + passengerCount + " passenger(s) on board";

  // Read existing history from localStorage
  var existing = localStorage.getItem("tripHistory");
  var updated  = existing ? existing + "\n" + entry : entry;

  // Save back to localStorage so it survives refresh
  localStorage.setItem("tripHistory", updated);

  log.textContent = updated;
}

function reset() {
  passengerCount = 0;
  log.textContent = "";
  localStorage.removeItem("tripHistory");
  updateUI();
}

function updateCapacity(value) {
  var newCap = parseInt(value);
  if (!newCap || newCap < 1) return;
  BUS_CAPACITY = newCap;
  localStorage.setItem("busCapacity", newCap);
  // if current count exceeds new capacity, clamp it
  if (passengerCount > BUS_CAPACITY) {
    passengerCount = BUS_CAPACITY;
  }
  updateUI();
}

// On page load — restore saved capacity and history
var savedCap = localStorage.getItem("busCapacity");
if (savedCap) {
  document.getElementById("capacity-input").value = savedCap;
}

var saved = localStorage.getItem("tripHistory");
if (saved) {
  log.textContent = saved;
}

updateUI();
