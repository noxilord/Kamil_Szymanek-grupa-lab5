// Ustawienia canvas
let cvs = document.querySelector('#cvs');
let ctx = cvs.getContext('2d');

// Wgrywanie zdjęcia
let imageData;
let newImageData;
function readImage() {
      if (this.files && this.files[0]) {
            let FR = new FileReader();
            FR.onload = (e) => {
                  let img = new Image();
                  img.addEventListener("load", function () {
                        // Zmiana rozmiaru ramki na taki sam jak w zdjęciu
                        cvs.width = img.width;
                        cvs.height = img.height;
                        ctx.drawImage(img, 0, 0, cvs.width, img.height);
                        // Zapis danych zdjęcia do późniejszych zmian
                        imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
                        newImageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
                        // Widok obrazu, slidera, oraz ukrycia przycisku "hide"
                        document.querySelector(".add__file__container").classList.add('hide');
                        cvs.classList.remove('hide');
                        document.querySelector("#input__container").classList.remove('hide');
                  });
                  img.src = e.target.result;
                  turnOnUI(); // Załączenie interfejsu
            };
            FR.readAsDataURL(this.files[0]);
      }
}

document.querySelector("#file").addEventListener("change", readImage, false);
function turnOnUI() {
      // Narzędzia do edycji zdjęcia
      function averagePxlBrightness(r, g, b) {
            return parseInt(((r * 299) + (g * 587) + (b * 114)) / 1000);
      }
      function changePixel(i, minBorder, maxBorder, value, sign = 1) {
            for (let j = 0; j < 3; j++) // zmiana RGB w danym pikselu {
                  newImageData.data[i + j] = Math.max(minBorder, Math.min(maxBorder, imageData.data[i + j] + sign * value));
            }
      } // Zmiana Jasności
      function changeBrightness() {
            let brightness = parseInt(brightnessSlider.value);
            for (let i = 0; i < imageData.data.length; i += 4) {

                  changePixel(i, 0, 255, brightness);
            }
            ctx.putImageData(newImageData, 0, 0);
      } // Zmiana Kontrasta
      function changeContrast() {
            let contrast = parseInt(contrastSlider.value);
            let averagePixelRgb;
            let sign = 1;

            for (let i = 0; i < imageData.data.length; i += 4) {
                    // rednia obliczjąca kolor
                  averagePixelRgb = averagePxlBrightness(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);

                  sign = (averagePixelRgb > 127) ? 1 : -1; // Ustawienia kontrastu; dodaje / usuwa kontrast zależnie od tego czy piksel jest jasnej czy ciemnej barwy

                  if (contrast >= 0) /*Sprawdzenie czy chcemy dodać kontrast*/ {
                        changePixel(i, 0, 255, contrast, sign); //Dodawanie kontrastu
                  } else /*Odejmowanie Kontrastu*/ {
                        if (averagePixelRgb > 127) {
                              changePixel(i, 128, 255, contrast, sign);
                        } else {
                              changePixel(i, 0, 127, contrast, sign);
                        }
                  }
            }
            ctx.putImageData(newImageData, 0, 0);
      }
      function changeHue(color) { //Zmiana natężenia barw
            let sliders = [hueRedSlider.value, hueGreenSlider.value, hueBlueSlider.value];

            for (let i = 0; i < newImageData.data.length; i += 4) {
                  newImageData.data[i + color] = Math.max(0, Math.min(255, imageData.data[i + color] + parseInt(sliders[color])));
            }
            ctx.putImageData(newImageData, 0, 0)
      }
      function changeSaturation() {
            let saturation = parseInt(saturationSlider.value);
            let averageRGB;

            for (let i = 0; i < imageData.data.length; i += 4) {
                  averageRGB = parseInt((imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3);

                  for (let j = 0; j < 3; j++) {
                        if (imageData.data[i + j] >= averageRGB) {
                              newImageData.data[i + j] = Math.max(averageRGB, Math.min(255, imageData.data[i + j] + saturation));
                        }
                        else {
                              newImageData.data[i + j] = Math.max(0, Math.min(averageRGB, imageData.data[i + j] - saturation));
                        }
                  }
            }
            ctx.putImageData(newImageData, 0, 0)
      }
      function addSepia() {
            for (let i = 0; i < imageData.data.length; i += 4) {
                  let r = imageData.data[i];
                  let g = imageData.data[i + 1];
                  let b = imageData.data[i + 2];
                  newImageData.data[i] = (r * .393) + (g * .769) + (b * .189);
                  newImageData.data[i + 1] = (r * .349) + (g * .686) + (b * .168);
                  newImageData.data[i + 2] = (r * .272) + (g * .534) + (b * .131);
            }
            ctx.putImageData(newImageData, 0, 0)
      }
      function changeBlur() {
            // Rozmycie = parseInt(blurSlider.value);
            let imgWidth = cvs.width * 4;

            for (let i = 0; i < newImageData.data.length; i++) {
                  newImageData.data[i] = parseInt((
                        /*środkowu px*/newImageData.data[i] +
                        /*lewy px*/newImageData.data[i - 4] +
                        /*prawy px*/newImageData.data[i + 4] +
                        /*lewy górny px*/newImageData.data[i - imgWidth - 4] +
                        /*górny*/newImageData.data[i - imgWidth] +
                        /*prawy górny px*/newImageData.data[i - imgWidth + 4] +
                        /*lewy dolny px*/newImageData.data[i + imgWidth - 4] +
                        /*dolny px*/newImageData.data[i + imgWidth] +
                        /*dolny prawy px*/newImageData.data[i + imgWidth + 4]) / 9);
            }
            ctx.putImageData(newImageData, 0, 0);
      }
      function changeSharpness() {
            let sharpness = parseInt(sharpnessSlider.value);
            let imgWidth = cvs.width * 4;
            let pixels, pixelMax, pixelMin;

            for (let i = 0; i < imageData.data.length; i++) {
                  // jeżeli (i+1%4===0) continue;
                  let pixels = [imageData.data[i - 4], imageData.data[i + 4],imageData.data[i - imgWidth - 4],
                  imageData.data[i - imgWidth], imageData.data[i - imgWidth + 4], imageData.data[i + imgWidth - 4], 
                  imageData.data[i + imgWidth], imageData.data[i + imgWidth + 4]]
                  let pixelMin = Math.min(...pixels)
                  let pixelMax = Math.max(...pixels)
                  if (Math.abs(pixelMax-imageData.data[i]) - Math.abs(pixelMin-imageData.data[i]) > 10) {
                        if (Math.abs(pixelMax-imageData.data[i]) > Math.abs(pixelMin-imageData.data[i])) {
                              newImageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] - sharpness));
                        } else {
                              newImageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + sharpness));
                        }
                  } 
            }
            ctx.putImageData(newImageData, 0, 0);
      }

      // Interface Slider-a
      const brightnessSlider = document.querySelector('#brightness');
      const contrastSlider = document.querySelector('#contrast');
      const saturationSlider = document.querySelector('#saturation');
      const blurBtn = document.querySelector('#blur');
      const sharpnessSlider = document.querySelector('#sharpness');
      const hueRedSlider = document.querySelector('#hue__red');
      const hueGreenSlider = document.querySelector('#hue__green');
      const hueBlueSlider = document.querySelector('#hue__blue');
      const sepiaBtn = document.querySelector('#sepia__btn');
      const colorBtn = document.querySelector('#pen__color');
      const sizeBtn = document.querySelector('#pen__size');
      const round = document.querySelector('#round');
      const square = document.querySelector('#square');

      brightnessSlider.addEventListener('change', changeBrightness);
      contrastSlider.addEventListener('change', changeContrast);
      saturationSlider.addEventListener('change', changeSaturation);
      blurBtn.addEventListener('click', changeBlur);
      sharpnessSlider.addEventListener('change', changeSharpness);
      hueRedSlider.addEventListener('change', () => changeHue(0));
      hueGreenSlider.addEventListener('change', () => changeHue(1));
      hueBlueSlider.addEventListener('change', () => changeHue(2));
      sepiaBtn.addEventListener('click', addSepia);
      colorBtn.addEventListener('change', () => penColor = colorBtn.value);
      sizeBtn.addEventListener('change', () => penSize = sizeBtn.value);
      round.addEventListener('click', () => penShape = 'round');
      square.addEventListener('click', () => penShape = 'square');

      function download() {
            let image = cvs.toDataURL("image/png").replace("image/png", "image/octet-stream");
            downloadBtn.setAttribute("href", image);
            downloadBtn.setAttribute("download", "image.png");
      }
      const downloadBtn = document.querySelector('#download');
      downloadBtn.addEventListener('click', download);

      let penColor = '#000';
      let penSize = 16;
      let penShape = 'round';

      // Ostatnia znana pozycja
      let pos = { x: 0, y: 0 };

      cvs.addEventListener('mousemove', draw);
      cvs.addEventListener('mousedown', setPosition);
      cvs.addEventListener('mouseenter', setPosition);

      //  Nowa pozycja z odczytu myszy 
      function setPosition(e) {
            pos.x = e.offsetX;
            pos.y = e.offsetY;
      }

      function draw(e) {
            //  !!! Trzeba kliknąć lewym klawiszem myszy
            if (e.buttons !== 1) return;
            ctx.beginPath(); // Rozpocznij

            ctx.lineWidth = penSize;
            ctx.lineCap = penShape;
            ctx.strokeStyle = penColor;

            ctx.moveTo(pos.x, pos.y); // Z / from
            setPosition(e);
            ctx.lineTo(pos.x, pos.y); // Do / to

            ctx.stroke(); // Rysuj :)
      }
}