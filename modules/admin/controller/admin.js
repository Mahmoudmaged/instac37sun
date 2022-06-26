const userModel = require("../../../DB/model/User");
const { createInvoice } = require("../../../services/createInvoice");
const sendEmail = require("../../../services/email");
const path = require('path')
const getAllUsers = async (req, res) => {
    const users = await userModel.find({ role: { $nin: ['Admin'] } });
    res.json({ message: "Done", users })
}

const changeRole = async (req, res) => {
    const { id } = req.params; //userID
    const { role } = req.body
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    sendEmail(user.email, `<p> admin has change u  role to ${user.role}</p>`)
    res.json({ message: "Done", user })
}

const blockUser = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findOne({ _id: id });
    if (user.role == req.user.role) {
        res.status(401).json({ message: "sorry u can't block user of with same role" })
    } else {
        await userModel.findByIdAndUpdate(user._id, { isBlooked: true })
        sendEmail(user.email, `<p> your account hase been blocked plz contact with help to re-open u account</p>`)
        res.json({ message: "Done", user })
    }

}
const invoice = async (req, res) => {

    const users = await userModel.find({}).select('userName email age gender phone');
    const invoiceData = {
        shipping: {
            name: "John Doe",
            address: "1234 Main Street",
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: 94111
        },
        items: users,
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234
    };
    createInvoice(invoiceData, path.join(__dirname, '../../../uploads/PDF/allUsers.pdf'))
    res.json({message:"Done" , link : req.protocol + '://' + req.headers.host + '/api/v1/admin/uploads/pdf/allUsers.pdf'  , users})
}


module.exports = {
    getAllUsers,
    changeRole,
    blockUser,
    invoice
}