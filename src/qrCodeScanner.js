console.log('loading');
const qrcode1 = window.qrcode;
import { barcodeStyleOne } from "./barcode/application-identifiers..const";
import { partNumberList } from "./barcode/part-numbers.const";
console.log('loading after err');

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const txtBarcode = document.getElementById("barcode-id");
const outputTerminal = document.getElementById("outputTerminal");
const outputScannerParse = document.getElementById("outputScannerParse");
const inventoryCartCount = document.getElementById("inventoryCartCount");
const scanLog = document.getElementById('scanLog');

const inventoryCart = [];

let scanning = false;

const inventoryScannedItem = barcodeJson => {
  // TODO enhance to handle text in sn
  const partsIdentified = partNumberList
    .filter(p => p.pno === barcodeJson.barcode.partNumber)
    .filter(p => p.snoRangeMin <= Number(barcodeJson.barcode.serialNumber))
    .filter(p => p.snoRangeMax >= Number(barcodeJson.barcode.serialNumber))

  if(!inventoryCart.find(a => a.partNumber === barcodeJson.barcode.partNumber && a.serialNumber === barcodeJson.barcode.serialNumber)) {
    inventoryCart.push(barcodeJson.barcode);
    const itemLogLink = document.createElement('a');
    itemLogLink.setAttribute('href', "#");
    const addItemToLog = document.createElement('div');
    addItemToLog.className = 'scan-log-item';
    addItemToLog.innerText = JSON.stringify(barcodeJson.barcode);
    scanLog.appendChild(itemLogLink);
    itemLogLink.appendChild(addItemToLog);
  }
  
  console.log({
    step: 'barcodeJson',
    barcodeJsonPartNo: barcodeJson.barcode.partNumber,
    partsIdentified,
    barcodeJson,
  });
} 

const processScannedItem = itemBarcode => {
  let partNumberIdx = 0;
  let serialNumberIdx = 0;
  let purchasedFromIdx = 0;
  let locationIdx = 0;
  const barcodeObject = itemBarcode.split(' ')
    .map((o,v) => {
      console.log('o is '+o+'v is '+v)
      if(o === '(241)'){
        partNumberIdx = v+1;
      }
      if(o === '(21)'){
        serialNumberIdx = v+1;
      }
      if(o === '(412)'){
        purchasedFromIdx = v+1;
      }
      if(o === '(414)'){
        locationIdx = v+1;
      }
      return o;
    })
    
  
  console.log({
    partNumber: barcodeObject[partNumberIdx],
    serialNumber: barcodeObject[serialNumberIdx],
    purchasedFrom: barcodeObject[purchasedFromIdx],
    location: barcodeObject[locationIdx],
  })
  const result = { barcode: {
    partNumber: barcodeObject[partNumberIdx],
    serialNumber: barcodeObject[serialNumberIdx],
    purchasedFrom: barcodeObject[purchasedFromIdx],
    location: barcodeObject[locationIdx],
  }}
  inventoryScannedItem(result);
  return result;
  // return JSON.stringify(barcodeStyleOne)
}

// this function should move out of this page
function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

qrcode1.callback = res => {
  if (res) {
    outputData.innerText = res;
    txtBarcode.value = res;
    var event = new Event('input');
    txtBarcode.dispatchEvent(event);
    alert('on input should have fired');

    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

txtBarcode.oninput = evt => {
    const { barcode } = processScannedItem(evt.target.value);
    outputScannerParse.innerText = JSON.stringify(barcode, null, 2);
    console.log(`event ${evt.target.value}`);
    const user = getURLParameter('user');
    // logic in console log is parsing
    console.log(`user is ${user} and barcode1 = ${(() => {
      let partNumberIdx = 0;
      let serialNumberIdx = 0;
      let purchasedFromIdx = 0;
      let locationIdx = 0;
      const barcodeObject = barcodeStyleOne.split(' ')
        .map((o,v) => {
          console.log('o is '+o+'v is '+v)
          if(o === '(241)'){
            partNumberIdx = v+1;
          }
          if(o === '(21)'){
            serialNumberIdx = v+1;
          }
          if(o === '(412)'){
            purchasedFromIdx = v+1;
          }
          if(o === '(414)'){
            locationIdx = v+1;
          }
          return o;
        })
      
      const barcodeObjectParsed = {
        partNumber: barcodeObject[partNumberIdx],
        serialNumber: barcodeObject[serialNumberIdx],
        purchasedFrom: barcodeObject[purchasedFromIdx],
        location: barcodeObject[locationIdx],
      }

      // end console log parsing
      return JSON.stringify(barcodeObjectParsed, null, 2)
    })()}`);
    outputTerminal.innerText = `user: ${user} \n
    scanned: ${evt.target.value}
    `;
    inventoryCartCount.innerText = inventoryCart.length;
}

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode1.decode();
    

  } catch (e) {
    setTimeout(scan, 300);
  }
}
