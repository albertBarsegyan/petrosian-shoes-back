const { Router } = require('express')
const shortid = require('shortid')
const Item = require('../models/Item')
const User = require('../models/Email')
const auth = require('../middleware/auth.middleware')
const Email = require('../models/Email')
const router = Router()
const validator = require('email-validator')
const Client = require('../models/Client')
const Purchase = require('../models/Purchase')
const nodemailer = require('nodemailer')
const http = require('http')
const NewPayment = require('../models/NewPayment')
const { shippingKeyResponseTemplate } = require('../templates/shipping-key-response-template')
const fetch = require('node-fetch')
const mails = require('./mails')

const Username = '19530451_api'
const Password = 'PRfBEMFKU6YY2m9a'

router.post('/offSale', auth, async (req, res) => {
  try {
    const items = await Item.find({ sale: true })
    if (items)
      items.forEach(async el => {
        const item = await Item.findOne({ shortId: el.shortId })
        if (item) {
          item.sale = false
          await item.save()
        }
      })
    res.json({ items })
    return
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/generate', auth, async (req, res) => {
  try {
    let {
      type,
      name,
      collectionType,
      prices,
      description,
      arrDetailList,
      shortId,
      avatarImg,
      hoverImg,
      collectionImg,
      sizeArr,
      existingSizeArr,
      carousel
    } = req.body
    const it = await Item.findOne({ shortId: shortId })
    if (!hoverImg) {
      hoverImg = avatarImg
    }
    if (it) {
      res.status(400).json({ message: 'Already added' })
      return
    }
    for (let i = 0; i < prices.length; ++i) {
      if (!prices[i]) {
        prices[i] = 0
      }
    }
    const item = new Item({
      type,
      name,
      collectionType,
      prices,
      description,
      detailList: arrDetailList,
      shortId,
      avatarImg,
      hoverImg,
      collectionImg,
      sale: false,
      newPrices: prices,
      sizes: sizeArr,
      existingSizes: existingSizeArr,
      carousel
    })
    await item.save()
    res.status(201).json({ item })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/subscribe', async (req, res) => {
  try {
    let { email, location, date } = req.body
    let user = await User.findOne({ email })

    if (user) {
      res.status(400).json({ message: 'Already added' })
      return
    }

    user = new User({
      email, location, date: Date.now(), counter: 0
    })

    await user.save()
    res.status(201).json({ item })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/edit', auth, async (req, res) => {
  try {
    let {
      type,
      prices,
      description,
      arrDetailList,
      shortId,
      avatarImg,
      hoverImg,
      collectionImg,
      name,
      collectionType,
      sale,
      newPrices,
      sizeArr,
      existingSizeArr,
      carousel
    } = req.body
    let it = await Item.findOne({ shortId })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }

    if (!hoverImg) {
      hoverImg = avatarImg
    }

    for (let i = 0; i < prices.length; i++) {
      if (!prices[i]) {
        prices[i] = 0
      }
    }

    if (existingSizeArr.length) {
      existingSizeArr.sort((a, b) => a.split(' ')[0] - b.split(' ')[0])
    }

    it.type = type
    it.prices = prices
    it.description = description
    it.detailList = arrDetailList
    it.avatarImg = avatarImg
    it.hoverImg = hoverImg
    it.collectionImg = collectionImg
    it.name = name
    it.collectionType = collectionType
    it.sale = sale || false
    it.newPrices = newPrices || prices
    it.sizes = sizeArr
    it.existingSizes = existingSizeArr
    it.carousel = carousel

    await it.save()

    res.status(201).json({ it })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/delete', auth, async (req, res) => {
  try {
    let { shortId } = req.body
    let it = await Item.findOne({ shortId: shortId })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }
    await it.remove()

    res.status(201).json({ message: 'successfully removed' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/deletePurchase', auth, async (req, res) => {
  try {
    let { shortId } = req.body
    let it = await Purchase.findOne({ shortId: shortId })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }
    await it.remove()

    res.status(201).json({ message: 'successfully removed' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})
router.post('/addShipmentKey', auth, async (req, res) => {
  try {
    let { shortId, shippingKey, courierServiceName, courierServiceLink } = req.body
    if (!shippingKey) {
      res.status(400).json({ message: 'Wrong shipping key' })
      return
    }
    let it = await Purchase.findOne({ shortId: shortId })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }
    it.shippingKey = shippingKey
    await it.save()

    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.beget.com',
      secure: true,
      auth: {
        user: 'support@petrosianshoes.com',
        pass: 'I8%w4ub3'
      }
    })

    const mailOptions = {
      from: `support@petrosianshoes.com`,
      to: `${it.email}`,
      subject: 'Your shipping tracking number is ready.',
      text: `Hi dear ${it.fname}! Your shipping tracking number is ${shippingKey}`,
      html: shippingKeyResponseTemplate({
        fname: it.fname,
        lname: it.lname,
        shippingKey,
        courierServiceName,
        courierServiceLink,
      })
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error)
      } else {
        // console.log('Email sent: ' + info.response)
      }
    })

    res.status(201).json({ message: 'successfully removed' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/finishPurchase', auth, async (req, res) => {
  try {
    let { shortId } = req.body

    let it = await Purchase.findOne({ shortId: shortId })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }
    if (!it.finished) {
      it.finished = true
      await it.save()
      res.json({ message: 'Moved to finished' })
      return
    }

    await it.remove()
    res.status(201).json({ message: 'Successfully deleted' })
    return
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/deleteEmail', auth, async (req, res) => {
  try {
    let { email } = req.body
    let it = await Email.findOne({ email })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }
    await it.remove()
    res.status(201).json({ message: 'successfully removed' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/deletePhoto', auth, async (req, res) => {
  try {
    let { shortId, photo } = req.body
    let it = await Item.findOne({ shortId: shortId })
    if (!it) {
      res.status(400).json({ message: 'Try again' })
      return
    }
    if (photo === 'avatarImg' || photo === 'hoverImg') {
      res.status(400).json({ message: 'Wrong image choice' })
      return
    }

    let newColl = it.collectionImg
    newColl.splice(newColl.indexOf(photo), 1)
    await it.save()
    res.status(201).json({ message: 'successfully removed' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/setCarousel', auth, async (req, res) => {
  try {
    let { img, shortId } = req.body
    let it = await Item.findOne({ shortId })
    if (!it && !img) {
      res.status(400).json({ message: 'Try again' })
      return
    }

    if (!img.includes('thumb')) {
      img = 'thumb.' + img
    }

    it.carousel = true
    it.carouselImg = img
    await it.save()
    res.status(201).json({ message: 'successfully changed' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const items = await Item.find({})
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/popular', async (req, res) => {
  try {
    const items = await Item.find({})
    items.sort((a, b) => b.clicks - a.clicks)
    if (items.length > 12) {
      let items_ = items.slice(0, 12)
      res.json(items_)
      return
    }
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/email', auth, async (req, res) => {
  try {
    const items = await Email.find({})
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/clients', auth, async (req, res) => {
  try {
    const items = await Client.find({})
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})
router.get('/purchases', auth, async (req, res) => {
  try {
    const items = await Purchase.find({})
    return res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/shortid', async (req, res) => {
  try {
    let shortId = shortid.generate()
    res.json({ shortId })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/sale/man', async (req, res) => {
  try {
    const items = await Item.find({ sale: true, type: 'Man' })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/sale/woman', async (req, res) => {
  try {
    const items = await Item.find({ sale: true, type: 'Woman' })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/getLocation/:lat/:long', async (req, res) => {
  const lat = req.params.lat
  const long = req.params.long
  const accessKey = '10b8477477060160639a45a7cfc8e31f'
  const url = `http://api.positionstack.com/v1/reverse?access_key=${accessKey}&query=${lat},${long}`

  http.get(url, (res_) => {
    let body = ''

    res_.on('data', (chunk) => {
      body += chunk
    })

    res_.on('end', () => {
      try {
        let json = JSON.parse(body)
        res.json(json.data[0])
      } catch (error) {
        // console.error(error.message);
      }

    })
  }).on('error', (error) => {
    // console.error(error.message);
  })
})

router.get('/sale', async (req, res) => {
  try {
    const items = await Item.find({ sale: true })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/man', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Man' })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/man/spring-summer', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Man' })

    const arr = []
    items.map(el => {
      if (el.collectionType.indexOf('Spring / Summer') > -1) {
        arr.push(el)
      }
    })

    res.json(arr)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/man/autumn-winter', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Man' })

    const arr = []
    items.map(el => {
      if (el.collectionType.indexOf('Autumn / Winter') > -1) {
        arr.push(el)
      }
    })
    res.json(arr)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/woman/spring-summer', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Woman' })

    const arr = []
    items.map(el => {
      if (el.collectionType.indexOf('Spring / Summer') > -1) {
        arr.push(el)
      }
    })

    res.json(arr)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/woman/autumn-winter', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Woman' })

    const arr = []
    items.map(el => {
      if (el.collectionType.indexOf('Autumn / Winter') > -1) {
        arr.push(el)
      }
    })

    res.json(arr)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/woman', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Woman' })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/accessories', async (req, res) => {
  try {
    const items = await Item.find({ type: 'Accessories' })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/shortid', async (req, res) => {
  try {
    let shortId = shortid.generate()
    res.json({ shortId })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ shortId: req.params.id })
    if (item) {
      item.clicks++
      await item.save()
    }
    res.json(item)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.get('/purchase/:id', auth, async (req, res) => {
  try {
    const item = await Purchase.findOne({ shortId: req.params.id })
    if (item) {
      res.json(item)
      return
    }
    return res.json({ message: 'Not found' })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.post('/email', async (req, res) => {
  try {
    const { email, location } = req.body
    if (!validator.validate(email)) {
      res.json({ message: 'Enter valid email' })
      return
    }
    let item = await Email.findOne({ email })
    if (item) {
      res.json({ message: 'Already subscribed' })
      return
    }

    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.beget.com',
      secure: true,
      auth: {
        user: 'support@petrosianshoes.com',
        pass: 'I8%w4ub3'
      }
    })

    const mailOptions = {
      from: `support@petrosianshoes.com`,
      to: email,
      subject: 'Subscribed to news and sales.',
      text: 'Success! You\'ve just subscribed to our brand news and sales!',
      html: `
      <div style="font-size: 20px">
        <p>Success! You've just subscribed to our brand news and sales!</p>
        <p>Feel free to <a href="https://petrosianshoes.com/contact">contact us</a> at any time</p>
      </div>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
      }
    })

    item = new Email({ email, location, date: Date.now().toString(), counter: 0 })
    await item.save()
    res.status(201).json({ message: 'Success!' })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' })
  }
})

router.post('/savePurchase', async (req, res) => {
  try {
    const {
      email,
      location,
      firstName,
      lastName,
      country,
      city,
      postal,
      region,
      address,
      purchase,
      PaymentID,
      OrderID
    } = req.body
    if (!validator.validate(email)) {
      res.json({ message: 'Enter valid email' })
      return
    }
    let item = await Email.findOne({ email })
    if (!item) {
      item = new Email({ email, location, counter: 0 })
      await item.save()
    }

    let shortId = shortid.generate()
    item = await Email.findOne({ shortId })
    if (item) {
      shortId = shortid.generate()
    }

    item = new Purchase({
      ...purchase,
      shortId,
      email,
      location,
      fname: firstName,
      lname: lastName,
      country,
      city,
      postalCode: postal,
      address,
      region,
      isPayed: false,
      shippingKey: '',
      PaymentID,
      OrderID
    })
    await item.save()
    res.status(201).json({ data: item })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

const mail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.beget.com',
    secure: true,
    auth: {
      user: 'support@petrosianshoes.com',
      pass: 'I8%w4ub3'
    }
  })

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('email error', error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

router.post('/doSale', auth, async (req, res) => {
  try {
    let { shortId, newPrices } = req.body

    for (let i = 0; i < newPrices.length; ++i) {
      if (!newPrices[i]) {
        newPrices[i] = 0
      }
    }
    const item = await Item.findOne({ shortId })
    item.sale = true
    item.newPrices = newPrices
    await item.save()
    res.json({ item })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/undoSale', auth, async (req, res) => {
  try {
    let { shortId } = req.body

    const item = await Item.findOne({ shortId })
    item.sale = false
    await item.save()
    res.json({ item })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router
