const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const NewPayment = require('../models/NewPayment');
const Purchase = require('../models/Purchase');
const nodemailer = require('nodemailer');
const mails = require('./mails');

const ClientID = 'ee47859a-bdfc-400c-8dcf-bdf3ded4a750';
const Username = '19530451_api';
const Password = 'PRfBEMFKU6YY2m9a';

// /api/checkout/initPayment
router.post('/initPayment', async (req, res) => {
    try {
        const items = await NewPayment.find({});
        const OrderID = items.map(i => i.OrderID).sort((a, b) => b - a)[0] + 1 || 2490055;
        const BackURL = `https://petrosianshoes.com/checkoutRes/${OrderID}`;
        let { Currency, Description, Amount, email } = req.body;
        const response = await fetch('https://services.ameriabank.am/VPOS/api/VPOS/InitPayment', {
            method: 'post',
            body: JSON.stringify({ ClientID, Username, Password, Currency, Description, BackURL, OrderID, Amount }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (data.ResponseMessage === 'OK') {
            const newInit = new NewPayment({ OrderID, PaymentID: data.PaymentID, email });
            await newInit.save();

            res.status(201).json({ data });
            return
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

router.post('/emailMe', async (req, res) => {

    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.beget.com",
        secure: true,
        auth: {
            user: 'support@petrosianshoes.com',
            pass: 'I8%w4ub3'
        }
    });

    const itemInCart = (url) => (`<div style="border: 1px solid white; width: 260px; margin: auto; margin-bottom: 20px;">
    <img src="${url}" width="250px" />
    <p>Price: 150$</p>
</div>`);

    const itemsInCart = `<div style="border: 1px solid white; width: 260px; margin: auto; margin-bottom: 20px;">
                <img src="./thumb.avatar.jpg" width="250px" />
                <p>Price: 150$</p>
            </div>`;

    const mailOptions = {
        from: `support@petrosianshoes.com`,
        to: 'masfuerte818@gmail.com',
        subject: 'email me',
        text: `tutuzik`,
        html: `
        <div style="font-size: 22px; margin: 20px auto; text-align: center;">
        <div style="
            padding: 30px 0;
            box-shadow: 0 1px 5px #999;
            background-color: rgba(247,247,247,.9);
            width: 100%;">
            <img src="cid:logo" alt="logo" style="width: 200px; height: 40px;">
        </div>
        <div style="background-color: rgba(51, 51, 51, 0.671); 
        color: white;">
            <p style="margin-top: 0; padding-top:20px">Hello Anun Azganun,</p>
            <p>Congratulations!</p>
            <p>You made a purchase in <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/"
                    target="_blank">PetrosianShoes.com</a>.</p>
            <p>We'll send your shipment tracking number as soon as possible.</p>
            ${itemsInCart}
            <p>
                Feel free to
                <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/contact"
                    target="_blank">contact us</a>
                at any time
            </p>
            <p style="font-size: 18px; margin-bottom: 0; padding-bottom: 20px;">Thanks for your interest in our company.
            </p>
        </div>
    </div>`
    };

    mailOptions.attachments = [{
        filename: 'logo.8cca1b05.png',
        path: __dirname + '/client/build/static/media/logo.8cca1b05.png',
        cid: 'logo'
    }];

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
})


router.post('/GetPaymentDetails/:id', async (req, res) => {
    try {
        const OrderID = req.params.id;
        const arr = await NewPayment.find({ OrderID });
        let item = arr[0]
        const PaymentID = item.PaymentID;

        const response = await fetch('https://services.ameriabank.am/VPOS/api/VPOS/GetPaymentDetails', {
            method: 'post',
            body: JSON.stringify({ PaymentID, Username, Password }),
            headers: { 'Content-Type': 'application/json' },
        });

        const purchase = await Purchase.findOne({ PaymentID });
        const data = await response.json();

        if (data.ResponseCode === '00') {
            const payment = await Purchase.findOne({ PaymentID });
            payment.isPayed = true;
            await payment.save();
        }

        if (!item.alerted) {
            let mailToClient = mails.paymentSuccessToClient;
            let mailToAdmin = mails.paymentSuccessToAdmin;
            let failure = false;
            if (data.ResponseCode === '00') {
                const payment = await Purchase.findOne({ PaymentID });
                payment.isPayed = true;
                await payment.save();
            } else {
                mailToClient = mails.paymentFailureToClient;
                mailToAdmin = mails.paymentFailureToAdmin;
                failure = true;
            }

            mailToClient.to = item.email;
            const currency = purchase.country.includes("Armenia") ?
                "֏" :
                purchase.country.includes("Russia") ?
                    "₽" :
                    (purchase.country.includes("Germany") ||
                        purchase.country.includes("United") ||
                        purchase.country.includes("France") ||
                        purchase.country.includes("Italy") ||
                        purchase.country.includes("Spain") ||
                        purchase.country.includes("Ukraine") ||
                        purchase.country.includes("Poland") ||
                        purchase.country.includes("Romania") ||
                        purchase.country.includes("Netherlands") ||
                        purchase.country.includes("Belgium") ||
                        purchase.country.includes("Czech") ||
                        purchase.country.includes("Greece") ||
                        purchase.country.includes("Portugal") ||
                        purchase.country.includes("Sweden") ||
                        purchase.country.includes("Hungary") ||
                        purchase.country.includes("Belarus") ||
                        purchase.country.includes("Denmark") ||
                        purchase.country.includes("Finland") ||
                        purchase.country.includes("Norway")) ?
                        "€" :
                        "$";

            const itemInCart = (shortIdImg, count, size, price) => (`<div style="border: 1px solid white; width: 260px; margin: auto; margin-bottom: 20px;">
            <img src="https://petrosianshoes.com/upload/${shortIdImg}/thumb.avatar.jpg" width="250px" />
            <p>Price: ${price} ${currency}</p>
            <p>Size: ${size}</p>
            ${count > 1 ? `<p>${count} pairs</p>` : ''}
        </div>`);

            const itemsInCart = purchase.items.map(
                (shortIdP, index) =>
                    itemInCart(shortIdP, purchase.quantities[index], purchase.sizes[index], purchase.prices[index]))
                .join('');

            mailToClient.html = `
                    <div style="font-size: 22px; margin: 20px auto; text-align: center;">
                    <div style="
                        padding: 30px 0;
                        box-shadow: 0 1px 5px #999;
                        background-color: rgba(247,247,247,.9);
                        width: 100%;">
                        <img src="https://petrosianshoes.com/static/media/logo.8cca1b05.png" alt="logo" style="width: 200px; height: 40px;">
                    </div>
                    <div style="background-color: rgba(51, 51, 51, 0.671); 
                    color: white;">
                        <p style="margin-top: 0; padding-top:20px">Hello ${purchase.fname} ${purchase.lname},</p>
                        ${failure ? "<p>Payment failure.</p>" : "<p>Congratulations!</p>"}
                        ${failure ? "" : `<p>You made a purchase in <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/"
                        target="_blank">PetrosianShoes.com</a>.</p>
                <p>We'll send your shipment tracking number as soon as possible.</p>`}
                        ${itemsInCart}
                        <p>
                            Feel free to
                            <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/contact"
                                target="_blank">contact us</a>
                            at any time
                        </p>
                        <p style="font-size: 18px; margin-bottom: 0; padding-bottom: 20px;">Thanks for your interest in our company.
                        </p>
                    </div>
                </div>`

            mailToAdmin.html = `
                    <div style="font-size: 22px; margin: 20px auto; text-align: center;">
                    <div style="
                        padding: 30px 0;
                        box-shadow: 0 1px 5px #999;
                        background-color: rgba(247,247,247,.9);
                        width: 100%;">
                        <img src="https://petrosianshoes.com/static/media/logo.8cca1b05.png" alt="logo" style="width: 200px; height: 40px;">
                    </div>
                    <div style="background-color: rgba(51, 51, 51, 0.671); 
                    color: white;">
                        ${failure ? "<p>Payment failure.</p>" : "<p>Congratulations!</p>"}
                        <p>${purchase.fname} ${purchase.lname} made a purchase in <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/"
                                target="_blank">PetrosianShoes.com</a>.</p>
                        ${itemsInCart}
                    </div>
                </div>`
            mail(mailToClient);
            mail(mailToAdmin);

            item.alerted = true;
            await item.save();
        }

        res.status(201).json({ ...data });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

router.post('/GetPaymentDetailsByPID/:id', async (req, res) => {
    try {
        const PaymentID = req.params.id;
        const arr = await NewPayment.find({ PaymentID });
        let item = arr[0]

        const response = await fetch('https://services.ameriabank.am/VPOS/api/VPOS/GetPaymentDetails', {
            method: 'post',
            body: JSON.stringify({ PaymentID, Username, Password }),
            headers: { 'Content-Type': 'application/json' },
        });

        const purchase = await Purchase.findOne({ PaymentID });

        const data = await response.json();

        if (data.ResponseCode === '00') {
            const payment = await Purchase.findOne({ PaymentID });
            payment.isPayed = true;
            await payment.save();
        }

        if (!item.alerted) {
            let mailToClient = mails.paymentSuccessToClient;
            let mailToAdmin = mails.paymentSuccessToAdmin;
            let failure = false;

            if (data.ResponseCode === '00') {
                const payment = await Purchase.findOne({ PaymentID });
                payment.isPayed = true;
                await payment.save();
            } else {
                mailToClient = mails.paymentFailureToClient;
                mailToAdmin = mails.paymentFailureToAdmin;
                failure = true;
            }

            mailToClient.to = item.email;

            const currency = purchase.country.includes("Armenia") ?
                "֏" :
                purchase.country.includes("Russia") ?
                    "₽" :
                    (purchase.country.includes("Germany") ||
                        purchase.country.includes("United") ||
                        purchase.country.includes("France") ||
                        purchase.country.includes("Italy") ||
                        purchase.country.includes("Spain") ||
                        purchase.country.includes("Ukraine") ||
                        purchase.country.includes("Poland") ||
                        purchase.country.includes("Romania") ||
                        purchase.country.includes("Netherlands") ||
                        purchase.country.includes("Belgium") ||
                        purchase.country.includes("Czech") ||
                        purchase.country.includes("Greece") ||
                        purchase.country.includes("Portugal") ||
                        purchase.country.includes("Sweden") ||
                        purchase.country.includes("Hungary") ||
                        purchase.country.includes("Belarus") ||
                        purchase.country.includes("Denmark") ||
                        purchase.country.includes("Finland") ||
                        purchase.country.includes("Norway")) ?
                        "€" :
                        "$";

            const itemInCart = (shortIdImg, count, size, price) => (`<div style="border: 1px solid white; width: 260px; margin: auto; margin-bottom: 20px;">
            <img src="https://petrosianshoes.com/upload/${shortIdImg}/thumb.avatar.jpg" width="250px" />
            <p>Price: ${price} ${currency}</p>
            <p>Size: ${size}</p>
            ${count > 1 ? `<p>${count} pairs</p>` : ''}
        </div>`);

            const itemsInCart = purchase.items.map(
                (shortIdP, index) =>
                    itemInCart(shortIdP, purchase.quantities[index], purchase.sizes[index], purchase.prices[index]))
                .join('');

            mailToClient.html = `
                    <div style="font-size: 22px; margin: 20px auto; text-align: center;">
                    <div style="
                        padding: 30px 0;
                        box-shadow: 0 1px 5px #999;
                        background-color: rgba(247,247,247,.9);
                        width: 100%;">
                        <img src="https://petrosianshoes.com/static/media/logo.8cca1b05.png" alt="logo" style="width: 200px; height: 40px;">
                    </div>
                    <div style="background-color: rgba(51, 51, 51, 0.671); 
                    color: white;">
                        <p style="margin-top: 0; padding-top:20px">Hello ${purchase.fname} ${purchase.lname},</p>
                        ${failure ? "<p>Payment failure.</p>" : "<p>Congratulations!</p>"}
                        ${failure ? "" : `<p>You made a purchase in <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/"
                        target="_blank">PetrosianShoes.com</a>.</p>
                <p>We'll send your shipment tracking number as soon as possible.</p>`}
                        ${itemsInCart}
                        <p>
                            Feel free to
                            <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/contact"
                                target="_blank">contact us</a>
                            at any time
                        </p>
                        <p style="font-size: 18px; margin-bottom: 0; padding-bottom: 20px;">Thanks for your interest in our company.
                        </p>
                    </div>
                </div>`

            mailToAdmin.html = `
                    <div style="font-size: 22px; margin: 20px auto; text-align: center;">
                    <div style="
                        padding: 30px 0;
                        box-shadow: 0 1px 5px #999;
                        background-color: rgba(247,247,247,.9);
                        width: 100%;">
                        <img src="https://petrosianshoes.com/static/media/logo.8cca1b05.png" alt="logo" style="width: 200px; height: 40px;">
                    </div>
                    <div style="background-color: rgba(51, 51, 51, 0.671); 
                    color: white;">
                        ${failure ? "<p>Payment failure.</p>" : "<p>Congratulations!</p>"}
                        <p>${purchase.fname} ${purchase.lname} made a purchase in <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/"
                                target="_blank">PetrosianShoes.com</a>.</p>
                        ${itemsInCart}
                    </div>
                </div>`

            mail(mailToClient);
            mail(mailToAdmin);

            item.alerted = true;
            await item.save();
        }

        res.status(201).json({ ...data });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

const mail = (mailOptions) => {
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.beget.com",
        secure: true,
        auth: {
            user: 'support@petrosianshoes.com',
            pass: 'I8%w4ub3'
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('email error', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;