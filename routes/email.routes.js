const { Router } = require('express');
const router = Router();
const nodemailer = require('nodemailer');


router.post('/emailContact', async (req, res) => {
  const { email, message, location } = req.body;
  if (!(email && message)) {
    res.status(500).json({ message: 'wrong email or message' });
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: 'petrosianshoes@gmail.com',
      pass: 'pxfsqngcrrwfspuf'
    }
  });

  const mailOptions = {
    from: `support@petrosianshoes.com`,
    to: 'petrosianshoes@gmail.com',
    subject: 'Contact page new message',
    text: `email: ${email}\nlocation: ${location}\nmessage: ${message}`,
    html: `
            <div>
              <p>email: <a href="mailto:${email}">${email}</a></p>
              <p>location: ${location}</p>
              <p style="font-size: 22px">${message}</p>
            </div>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log(error);
    } else {
      // console.log('Email sent: ' + info.response);
    }
  });
});

module.exports = router;
