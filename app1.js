const express = require("express");
const { PDFDocument } = require("pdf-lib");
const mysql = require("mysql2/promise");

const app = express();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "236951Arjit",
  database: "notes_app",
});

// Endpoint to generate and download receipt
// app.get("/receipt", async (req, res) => {
//   try {
//     // Connect to MySQL database
//     await connection.connect();

//     // Fetch receipt data from the database
//     const [rows, fields] = await connection.execute("SELECT * FROM login");

//     // Create HTML receipt using the retrieved data
//     const htmlReceipt = `
//       <html>
//         <head>
//           <title>Receipt</title>
//         </head>
//         <body>
//           <h1>Receipt</h1>
//           <table>
//             <tr>
//               <th>Item</th>
//               <th>Price</th>
//             </tr>
//             ${rows
//               .map(
//                 (row) => `
//               <tr>
//                 <td>${row.item}</td>
//                 <td>${row.price}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </table>
//         </body>
//       </html>
//     `;

//     // Convert HTML to PDF
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();
//     page.drawText(htmlReceipt, { x: 50, y: page.getHeight() - 50 });

//     // Save PDF to buffer
//     const pdfBytes = await pdfDoc.save();

//     // Send PDF as downloadable file
//     res.setHeader("Content-Disposition", 'attachment; filename="receipt.pdf"');
//     res.setHeader("Content-Type", "application/pdf");
//     res.send(pdfBytes);
//   } catch (error) {
//     console.error("Error generating receipt:", error);
//     res.status(500).send("Internal Server Error");
//   } finally {
//     // Close MySQL connection
//     await connection.end();
//   }
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
