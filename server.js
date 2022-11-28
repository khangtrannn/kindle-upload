const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const { join } = require("path");

const app = express();
const port = 2116;

app.use(express.static(join(__dirname, "uploads")));

app.get("/", function (req, res) {
  fs.readdir("uploads", function (err, files) {
    let response = "";

    files.forEach(
      (file, index) =>
        (response += `<a href="/${file}">${index + 1}. ${file}</a><br /><br />`)
    );

    res.end(`
      <div>
        <button onclick="window.location.href='/uploads'">Uploads</button><br /><br />
        ${response}
      </div>
    `);
  });
});

app.get("/uploads", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    '<form action="file-upload" method="post" enctype="multipart/form-data">'
  );
  res.write('<input type="file" name="filetoupload"><br /><br />');
  res.write('<input type="submit">');
  res.write("</form>");
  return res.end();
});

app.post("/file-upload", function (req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const oldpath = files.filetoupload.filepath;
    const newpath = "./uploads/" + files.filetoupload.originalFilename;

    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.redirect("/");
    });
  });
});

app.listen(port, function (error) {
  if (error) {
    console.log("Server started failed!");
  }

  console.log("Server is running on port: " + port);
});
