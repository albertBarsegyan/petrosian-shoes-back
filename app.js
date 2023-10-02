const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");

const app = express();

app.use(express.json({ extended: true }));
app.use(fileUpload());

app.use("/api/checkout", require("./routes/checkout.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/email", require("./routes/email.routes"));
app.use("/api/link", require("./routes/create.routes"));

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  const [shortId, name] = file.name.split("___");
  fs.stat(`${__dirname}/client/build/getLocation/${shortId}`, function (err) {
    if (err !== null) {
      fs.mkdir(
        path.join(`${__dirname}/client/build/upload/`, shortId),
        (err) => {
          if (err) {
            return false
          }
        }
      );
      return 
    }

    file.mv(`${__dirname}/client/build/upload/${shortId}/${name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      if (name) {
        sharp(`${__dirname}/client/build/upload/${shortId}/${name}`)
          .resize({ height: 780 })
          .toFile(`${__dirname}/client/build/upload/${shortId}/thumb.${name}`)
          .then(function (newFileInfo) {
            console.log(newFileInfo);
          })
          .catch(function (err) {
            console.log("Error occured");
          });
      }
      res.json({ message: "Success" });
    });
  });
});

app.post("/uploadSlide", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  const name = file.name;

  fs.stat(`${__dirname}/client/build/upload/${name}`, function (err) {
    file.mv(`${__dirname}/client/build/upload/${name}`, (err) => {
      if (err) {
        res.status(500).send(err);
        return 
      }
      res.json({ message: "Success" });
    });
  });
});

app.use("/", express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = config.get("port") || 5000;
async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    // console.log("Server error from node app.js", e.message);
    process.exit(1);
  }
}

start();
app.listen(PORT, () => console.log(`app has been started on port ${PORT}`));
