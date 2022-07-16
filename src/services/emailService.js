require('dotenv').config()
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    if (dataSend.type === 'verifyEmail') {
        let info = await transporter.sendMail({
            from: '"BearNguyen 👻" <phuocnhanh19@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Xác thực email", // Subject line
            html: getBodyHTMLEmailVerify(dataSend)
        });
    }
    if (dataSend.type === 'forgotPassword') {
        let info = await transporter.sendMail({
            from: '"BearNguyen 👻" <phuocnhanh19@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Xác nhận quên mật khẩu", // Subject line
            html: getBodyHTMLEmailForgotPassword(dataSend)
        });
    }
}

let getBodyHTMLEmailVerify = (dataSend) => {
    let fullName = `${dataSend.lastName} ${dataSend.firstName}`
    let result = `<h3>Xin chào ${fullName}!</h3>
        <p>Bạn nhận được email này vì đã yêu cầu xác thực email!</p>
        <p>Bạn vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục xác minh email.</p>
        <div>
            <a href="${dataSend.redirectLink}" target=""_blank>Click here</a>
        </div>
        <div>Chúc bạn một ngày tốt lành, xin cảm ơn!</div>
    `
    return result;
}
let getBodyHTMLEmailForgotPassword = (dataSend) => {
    let fullName = `${dataSend.lastName} ${dataSend.firstName}`
    let result = `<h3>Xin chào ${fullName}!</h3>
        <p>Bạn đã quên mật khẩu?</p>
        <p>Đừng lo lắng, thỉnh thoảng chúng ta cũng hay quên mật khẩu mà!</p>
        <p>Bạn vui lòng click vào đường link bên dưới để xác nhận quên mật khẩu và lấy lại mật khẩu của bạn</p>
        <div>
            <a href="${dataSend.redirectLink}" target=""_blank>Click here</a>
        </div>
        <div>Xin cảm ơn !</div>
    `
    return result;
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
}