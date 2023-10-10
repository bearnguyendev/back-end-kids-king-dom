const axios = require('axios');

const VNPaySandbox = {
    paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    tmnCode: '195JTS5P', // Mã merchant
    secretKey: 'CRXZBSKCNSHBMGIFIBWBAWVUNMFVJNVL', // Khóa bí mật

    generatePaymentUrl: async (result) => {
        const returnUrl = `${process.env.URL_REACT}/payment-success`; // URL để VNPay gửi kết quả thanh toán về, bạn cần thay đổi tương ứng với frontend React
        const responseUrl = `${process.env.URL_REACT}/payment`; // URL để VNPay gửi request trạng thái thanh toán về, bạn cần thay đổi tương ứng với frontend React

        const data = new URLSearchParams({
            vnp_Version: '2.0.0',
            vnp_Command: 'pay',
            vnp_TmnCode: VNPaySandbox.tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: Date.now().toString(), // Thay đổi transaction reference tương ứng
            vnp_OrderInfo: result.invoiceNo || 'YOUR_ORDER_INFO', // Thay đổi thông tin đơn hàng tương ứng
            vnp_OrderType: 'billpayment',
            vnp_Amount: result.amount * 100, // VNPay yêu cầu số tiền phải được nhân 100
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format thời gian theo đúng yêu cầu của VNPay
            vnp_BankCode: '',
            vnp_PaymentType: 'atm',
        });

        // // Tạo chuỗi signature để xác thực dữ liệu
        // const secretKey = VNPaySandbox.secretKey;
        // const signData = Object.keys(data)
        //     .sort()
        //     .map((key) => `${key}=${data[key]}`)
        //     .join('&');
        // const secureHash = require('crypto')
        //     .createHmac('sha512', secretKey)
        //     .update(Buffer.from(signData, 'utf8'))
        //     .digest('hex');

        // // Thêm chuỗi signature vào dữ liệu
        // data.vnp_SecureHashType = 'SHA512';
        // data.vnp_SecureHash = secureHash;

        // // Gửi request tới VNPay để lấy URL thanh toán
        // const response = await axios.post(VNPaySandbox.paymentUrl, data);
        // console.log("check respose: ", response);

        const response = await axios.get(`${VNPaySandbox.paymentUrl}?${data}`);
        return response.data;
    }
};

module.exports = VNPaySandbox;