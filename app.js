require('dotenv').config()
const express = require("express");
const connectDB = require('./DB/connection');
const app = express()
const cors = require('cors')
const schedule = require('node-schedule');
const fs = require('fs')
const port = process.env.PORT
const indexRouter = require("./modules/index.router")
// var whitelist = ['http://example1.com', 'http://example2.com']
// const corsOptions = {
//   origin: function (origin, callback) {

//     if (whitelist.includes(origin)) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
app.use(cors())
app.use(express.json())
const path = require('path')
app.use('/api/v1/uploads', express.static(path.join(__dirname, './uploads')))
app.use('/api/v1/auth', indexRouter.authRouter)
app.use('/api/v1/user', indexRouter.userRouter)
app.use('/api/v1/post', indexRouter.postRouter)
app.use('/api/v1/admin', indexRouter.adminRouter)
const QRCode = require('qrcode');
const { createInvoice } = require('./services/createInvoice');
const sendEmail = require('./services/email');
app.get("/", (req, res) => {
    QRCode.toDataURL(`<a href='https://stackoverflow.com/questions/16531895/mongoose-query-where-value-is-not-null'> click me</a>`, function (err, url) {
        if (err) {
            res.status(400).json({ message: "QR err" })
        } else {
            console.log(url)
            res.json({ message: "QR", url })
        }
    })
})

const invoice = {
    shipping: {
        name: "John Doe",
        address: "1234 Main Street",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postal_code: 94111
    },
    items: [
        {
            userName: "Mahmoud",
            Email: "mm@gmail.com",
            Age: 22,
            Gender: "Male",
            phone: "01142951602"
        },
        {
            userName: "Rana",
            Email: "rana@gmail.com",
            Age: 24,
            Gender: "Female",
            phone: "01142951608"
        },
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
};
createInvoice(invoice, path.join(__dirname, './uploads/PDF/invoice.pdf'))
// sendEmail('routefri@gmail.com', `<p>plz check u invoice</p>`, [
//     {
//         content: fs.readFileSync(
//             path.join(__dirname, './uploads/PDF/invoice.pdf')).toString("base64"),
//         filename: "attachment.pdf",
//         type: "application/pdf",
//         disposition: "attachment"
//     }
// ])
//Outlook
// sendEmail('routefri@gmail.com', `<p>plz check u invoice</p>`, [
//     {
//        path: path.join(__dirname, './uploads/PDF/invoice.pdf'),
//        filename:'invoice.pdf'
//     }
// ])

schedule.scheduleJob('15 5 23 26 6 0', function(){
  console.log('The answer to life, the universe, and everything!');
});
connectDB()
app.listen(port, () => {
    console.log(`server is runnin on port :::: ${port}`);
})