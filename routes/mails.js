const paymentSuccessToClient = {
  from: `support@petrosianshoes.com`,
  to: 'email',
  subject: 'Payment success!',
  text: `You made a purchase in petrosianshoes.com`,
  html: `
    <div style="font-size: 22px">
      <p>You made a purchase in petrosianshoes.com.
      We'll send your shipment tracking number as soon as possible.</p>
      <p>Feel free to <a href="https://petrosianshoes.com/contact">contact us</a> at any time</p>
      <p style="font-size: 18px">Thanks for your interest in our company.</p> 
    </div>`,
};

const paymentFailureToClient = {
  from: `support@petrosianshoes.com`,
  to: 'email',
  subject: 'Payment failure!',
  text: `Your purchase in petrosianshoes.com failed`,
  html: `
    <div style="font-size: 22px">
      <p>Your payment has failed.</p>
      <p>Feel free to <a href="https://petrosianshoes.com/contact">contact us</a> at any time</p>
      <p style="font-size: 18px">Thanks for your interest in our company.</p> 
    </div>`,
};

const paymentSuccessToAdmin = {
  from: `support@petrosianshoes.com`,
  to: `petrosianshoes@gmail.com`,
  subject: 'Someone payed for shoes!',
  text: `Someone made a purchase in petrosianshoes.com. Check for it.`,
  html: `
    <div style="font-size: 22px">
      <p>Someone made a purchase in petrosianshoes.com.
      Check for it in website.</p> 
    </div>`
};

const paymentFailureToAdmin = {
  from: `support@petrosianshoes.com`,
  to: `petrosianshoes@gmail.com`,
  subject: 'Someone tried to pay!',
  text: `Someone failed payment`,
  html: `
    <div style="font-size: 22px">
      <p>Unsuccessful payment</p> 
    </div>`
};

const EmailMe = {
  from: `support@petrosianshoes.com`,
  to: 'email',
  subject: 'Payment success!',
  text: `You made a purchase in petrosianshoes.com`,
  html: `
      <div style="font-size: 22px; margin: 20px auto; display: flex; flex-direction: column; text-align: center;">
      <div style="display: flex;
          justify-content: center;
          padding: 30px 0;
          box-shadow: 0 1px 5px #999;
          background-color: rgba(247,247,247,.9);
          width: 100%;">
          <img src="cid:logo" alt="logo" style="width: 200px; height: 40px;">
      </div>
      <div style="background-color: rgba(51, 51, 51, 0.671); 
      color: black;">
          <p>Hello Anun Azganun,</p>
          <p>Congratulations!</p>
          <p>You made a purchase in petrosianshoes.com.
              We'll send your shipment tracking number as soon as possible.</p>
          <p>
              Feel free to
              <a style="color: black; text-decoration: none" href="https://petrosianshoes.com/contact"
                  target="_blank">contact us</a>
              at any time
          </p>
          <p style="font-size: 18px">Thanks for your interest in our company.</p>
      </div>
  </div>`,
}

module.exports = Object.freeze({
  paymentSuccessToClient,
  paymentSuccessToAdmin,
  paymentFailureToClient,
  paymentFailureToAdmin,
  EmailMe,
});