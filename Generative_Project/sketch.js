// Define common parameters and variables of the project
const countdownDate = new Date(2024, 8, 15, 19, 47, 0, 0);
const string1 = "Black";
const string2 = "Ocean";
const string3 = "Environmental Awareness Exhibition";
const fontFile1 = "GillSansStd-Bold.otf";
const fontFile2 = "Gill Sans Medium.otf";
const showText = true;
const textAlpha = 9;
const backgroundColor = [158, 190, 193];
const strokeAlpha = 40;
const strokeColor = 0;
const fontSampleFactor = 1;
const noiseZoom = 0.02;
const noiseOctaves = 5;
const noiseFalloff = 0.5;
const zOffsetChange = 0;
const individualZOffset = 0;
const lineSpeed = 20;
const newPointsCount = 100;
let countdownInterval;
let seed;
let font1;
let font2;
let points = [];
let startingPoints1;
let startingPoints2;
let hoursText;
let secondsText;
let minutesText;
let img;
let stringStartRef;
let stringEndRef;
let titleSize;
let stringLengthRef;

//Load fonts
function preload() {
  font1 = loadFont(fontFile1);
  font2 = loadFont(fontFile2);
}

// Setup some basic variables that are used during the running of the code such as the image for the invitation, text font, color etc.
function setup() {
  createCanvas(windowWidth, windowHeight);
  titleSize = height * 0.15;
  textFont(font1);
  fill(color(0));
  stroke(strokeColor, strokeAlpha);
  colorMode(RGB);
  noiseDetail(noiseOctaves, noiseFalloff);
  seed = floor(random(1000000));
  img = loadImage("Black-Ocean.jpg");
  image(img, 0, 0);
  updateClock();
  countdownInterval = setInterval(updateCountdown, 1000);
  start();
}

// Another preperations for the main 'draw' function. Defines background layer and starting point for the main title.

function start() {
  // Prepare the invisible layer behind the main title with the font that will be used
  background(color(backgroundColor[0], backgroundColor[1], backgroundColor[2]));
  textSize(titleSize);
  randomSeed(seed);
  noiseSeed(seed);
  frameCount = 0;
  stringLengthRef = textWidth(string2);
  stringStartRef = (width - stringLengthRef) / 2;
  stringEndRef = stringStartRef + stringLengthRef;
  startingPoints1 = font1.textToPoints(
    string1,
    stringStartRef,
    height / 2 - titleSize / 2,
    titleSize,
    { sampleFactor: fontSampleFactor }
  );
  startingPoints2 = font1.textToPoints(
    string2,
    stringStartRef,
    height / 2 - titleSize / 2 + titleSize,
    titleSize,
    { sampleFactor: fontSampleFactor }
  );

  //Prepare, calculate and save the starting points of the lines that will come out of the main title during the 'draw' function.
  points = [];
  for (let p = 0; p < startingPoints1.length; p++) {
    points[p] = startingPoints1[p];
    points[p].zOffset = random();
  }
  for (let p = 0; p < startingPoints2.length; p++) {
    points.push(startingPoints2[p]);
    points[points.length - 1].zOffset = random();
  }
  updateCountdown();
}

function draw() {
  textSize(titleSize);
  // if showText is true than draw the main title
  if (showText) {
    noStroke();
    text(string1, stringStartRef, height / 2 - titleSize / 2);
    text(string2, stringStartRef, height / 2 - titleSize / 2 + titleSize);
    textAlign(CENTER);
    textFont(font2);
    textSize(titleSize / 7);
    let w2 = textWidth(string3) / 2;
    text(string3, width / 2, height * 0.97);
    stroke(strokeColor, strokeAlpha);
    textAlign(LEFT);
    textFont(font1);
    textSize(titleSize);
  }
  
  // draw the lines that are coming out of the main title
  for (let pt = 0; pt < points.length; pt++) {
    let p = points[pt];
    let noiseX = p.x * noiseZoom;
    let noiseY = p.y * noiseZoom;
    let noiseZ = frameCount * zOffsetChange + p.zOffset * individualZOffset;
    let newPX = p.x + map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
    let newPY = p.y + map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);
    line(p.x, p.y, newPX, newPY);
    p.x = newPX;
    p.y = newPY;
  }
}

// Some extra keyboard functionallity - press 's' to save the invitation and 'enter' to reset the invitation
function keyPressed() {
  if (key.toLowerCase() === "s") {
    save(img, "BlackOceanEvent.jpg");
  } else if (keyCode === RETURN) {
    seed = floor(random(1000000));
    start();
  }
}

// When the mouse is clicked and dragged, draw lines and animations
function mouseDragged() {
  for (let i = 0; i < newPointsCount; i++) {
    let angle = random(TAU);
    let magnitude = randomGaussian() * ((newPointsCount - 1) ** 0.5 * 3);
    let newPoint = {
      x: mouseX + magnitude * cos(angle),
      y: mouseY + magnitude * sin(angle),
      zOffset: random(),
    };
    points.push(newPoint);
    if (points.length <= startingPoints1.length) {
      startingPoints1.push(newPoint);
    } else {
      startingPoints2.push(newPoint);
    }
  }
}

// Update the clock by caculating the new time and drawing it
function updateCountdown() {
  stroke(backgroundColor);
  fill(backgroundColor);
  drawClock();
  updateClock();
  noStroke();
  fill(0);
  drawClock();
}

// Calculate the new countdown time and draw it again
function updateClock() {
  let now = new Date();
  let timeLeft = countdownDate - now;
  let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  hoursText = hours + " Hours";
  secondsText = seconds + " Seconds";
  minutesText = minutes + " Minutes";
}


// Erase the previous clock and draw updated clock
function drawClock() {
  let h = titleSize / 2.3;
  let hh = (width - stringStartRef) / 2 + (2.2 / 5) * stringStartRef;
  let hv = height / 2 - titleSize / 2 + 1.5 * titleSize;
  let m = titleSize / 4.6;
  let mh = stringStartRef;
  let mv = height / 2 - titleSize / 2 + 1.3 * titleSize;
  textAlign(RIGHT);
  textSize(h);
  text(hoursText, stringEndRef, hv);
  textAlign(LEFT);
  textSize(m);
  text(minutesText, mh, mv);
  let minutesWidth = textWidth(minutesText);
  textAlign(RIGHT);
  let s = titleSize / 6;
  let sh = stringStartRef + minutesWidth;
  let sv = height / 2 - titleSize / 2 + 1.5 * titleSize;
  textSize(s);
  text(secondsText, sh, sv);
  textAlign(LEFT);
}