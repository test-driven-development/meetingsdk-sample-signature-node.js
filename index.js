require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')
const KJUR = require('jsrsasign')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json(), cors())
app.options('*', cors())

app.post('/', (req, res) => {
  console.log('start post')
  console.log(`ZOOM_SDK_KEY : ${JSON.stringify(process.env.ZOOM_SDK_KEY)}`)

  console.log(
    `ZOOM_SDK_SECRET : ${JSON.stringify(process.env.ZOOM_SDK_SECRET)}`,
  )

  console.log(`req.body : ${JSON.stringify(req.body)}`)

  const iat = Math.round(new Date().getTime() / 1000) - 30
  const exp = iat + 60 * 60 * 2

  const oHeader = {alg: 'HS256', typ: 'JWT'}

  const oPayload = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: process.env.ZOOM_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const signature = KJUR.jws.JWS.sign(
    'HS256',
    sHeader,
    sPayload,
    process.env.ZOOM_SDK_SECRET,
  )

  console.log('end post : ')
  console.log(signature)
  res.json({
    signature: signature,
  })
})

app.listen(port, () =>
  console.log(`Zoom Meeting SDK Sample Signature Node.js on port ${port}!`),
)
