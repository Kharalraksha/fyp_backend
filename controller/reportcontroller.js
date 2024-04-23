const database = require("../connect/database");
const PdfPrinter = require("pdfmake");

// Setup pdfmake with default fonts
const fonts = {
  Roboto: {
    normal: "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf",
    bold: "node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf",
    italics: "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
    bolditalics:
      "node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf",
  },
};
const printer = new PdfPrinter(fonts);

async function fetchDataForReport() {
  try {
    const data = await Promise.all([
      databaseQuery("SELECT COUNT(*) AS userCount FROM user"),
      databaseQuery("SELECT COUNT(*) AS artistCount FROM artist"),
      databaseQuery("SELECT COUNT(*) AS appointmentCount FROM appointment"),
      databaseQuery("SELECT SUM(amount) AS totalPayments FROM payment"),
    ]);

    return {
      users: data[0],
      artists: data[1],
      appointments: data[2],
      payments: data[3],
    };
  } catch (error) {
    console.error("Fetch data failed:", error);
    throw error; // Rethrow to handle it in the calling function
  }
}

function databaseQuery(query) {
  return new Promise((resolve, reject) => {
    database.query(query, (err, res) => {
      if (err) {
        console.error(`Query failed: ${query}`, err);
        reject(err);
      } else {
        resolve(res[0][Object.keys(res[0])[0]]); // Simplifying data extraction
      }
    });
  });
}

exports.generateReport = async (req, res) => {
  try {
    const data = await fetchDataForReport();
    const docDefinition = {
      content: [
        {
          text: "Admin Report",
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        "This is the overall report.",
        {
          style: "tableExample",
          table: {
            body: [
              ["Metric", "Count"],
              ["Total Users", data.users],
              ["Total Artists", data.artists],
              ["Total Appointments", data.appointments],
              ["Total Payments", `$${parseFloat(data.payments).toFixed(2)}`],
            ],
          },
        },
      ],
      defaultStyle: {
        font: "Roboto",
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.send(result);
    });
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error - Unable to generate report." });
  }
};
