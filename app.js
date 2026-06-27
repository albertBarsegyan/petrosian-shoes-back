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
  const uploadDir = path.join(__dirname, "client", "build", "upload", shortId);

  fs.mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    file.mv(path.join(uploadDir, name), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      if (name) {
        sharp(path.join(uploadDir, name))
          .resize({ height: 780 })
          .toFile(path.join(uploadDir, `thumb.${name}`))
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
    console.error("MongoDB connection error:", e.message);
    process.exit(1);
  }
}

start();
app.listen(PORT, "0.0.0.0", () => {
  console.log(`app has been started on port ${PORT}`);
});
