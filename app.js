const
  fs = require("file-system"),
  pr = require("pdfreader"),
  util = require("util"),
  parseData = require("./parser"),
  readPDFPages = require("./bufferer");

if (typeof XLSX == 'undefined') XLSX = require('xlsx');

// ------------------------------
// FILE READER
// ------------------------------

const testFolder = "./sample/";

fs.readdir(testFolder, (err, files) => {
  console.log(consolidate(files));
});

// ------------------------------
// RESULT DATA
// ------------------------------

async function resultData(buf, reader) {
  try {
    const newData = [];

    const data = await readPDFPages(buf, reader);

    newData.push(parseData(data));

  } catch (err) {
    console.error(err);
  }
}

// ------------------------------
// CONSOLIDATE DATA
// ------------------------------

async function consolidate(files) {
  try {
    let x = [];

    for (let i = 0; i < files.length; i++) {
      fs.readFile(testFolder + files[i], (err, pdfBuffer) => {
        let y = resultData(pdfBuffer, new pr.PdfReader);
        x.push(y[0])
        console.log(x.length);

        // checkPdf(pdfBuffer, new pr.PdfReader);
      });
    }

  } catch (err) {
    console.log(err);
  }
}

// ------------------------------
// DISPLAY EXCEL
// ------------------------------

function excel(data) {
  // XLSX
  const ws_name = "InvoiceData";

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  XLSX.writeFile(wb, "testExcel.xlsx");
}

// ------------------------------
// TEST
// ------------------------------

async function checkPdf(buf, reader) {
  try {
    const data = await readPDFPages(buf, reader);

    console.log(data);

    return data;

  } catch (err) {
    console.log(err);
  }
}

