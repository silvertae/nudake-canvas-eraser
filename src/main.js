import "./style.css";
import image from "./assets/tub.jpeg";

document.querySelector("#app").innerHTML = `
  <header class="absolute p-6 z-10">
    <h1 class="text-5xl font-medium">tub</h1>
  </header>
  <main>
  <div id="content">
    <div id="eraser" class="relative">
      <div class="absolute bg-[url('./assets/flower.jpeg')] bg-no-repeat bg-cover bg-center w-screen h-screen" style="touch-action: none;">
        <div id="percentage" class="absolute bottom-5 right-5 text-3xl text-white"></div>  
        <canvas id="imgCanvas" class="w-full h-full"></canvas>
      </div>
    </div>
  </div>
  </main>
`;

const canvas = document.getElementById("imgCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const img = new Image();

canvas.setAttribute("width", document.body.clientWidth);
canvas.setAttribute("height", document.body.clientHeight);

img.addEventListener("load", () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
});
img.src = image;

const calcTransparency = () => {
  const pixelCount = canvas.width * canvas.height;
  const arrayElemsCount = pixelCount * 4;
  const imgDataArray = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparentPixelCount = 0;

  for (let i = 3; i < arrayElemsCount; i += 4) {
    const alphaValue = imgDataArray[i];
    if (alphaValue <= 0) {
      transparentPixelCount++;
    }
  }

  const transparencyPercentage = (transparentPixelCount / pixelCount) * 100;
  document.querySelector("#percentage").innerText =
    transparencyPercentage.toFixed(0) + "%";
  return transparencyPercentage;
};

const resizeCanvas = () => {
  canvas.setAttribute("width", document.body.clientWidth);
  canvas.setAttribute("height", document.body.clientHeight);
  scaleToFill(img);
};

const scaleToFill = (img) => {
  // get the scale
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  // get the top left position of the image
  const x = canvas.width / 2 - (img.width / 2) * scale;
  const y = canvas.height / 2 - (img.height / 2) * scale;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
};

window.addEventListener("resize", resizeCanvas);

window.onload = function () {
  let x, y, isDrawing;
  const canvas = document.getElementById("imgCanvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.addEventListener("load", () => {
    scaleToFill(img);
  });
  img.src = image;

  const handleMouseDown = (e) => {
    isDrawing = true;
    x = e.offsetX;
    y = e.offsetY;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "destination-out";
    ctx.stroke();
    x = e.offsetX;
    y = e.offsetY;
    calcTransparency();
  };

  const handleMouseUp = (e) => {
    isDrawing = false;
  };

  canvas.addEventListener("pointerdown", handleMouseDown);
  window.addEventListener("pointermove", handleMouseMove);
  canvas.addEventListener("pointerup", handleMouseUp);
  canvas.addEventListener;
};
