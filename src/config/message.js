
export const Message = {
    errCode500: "Lỗi từ máy chủ",
    errCode1: "Thiếu các thông số bắt buộc!",
    failPhoneNumber: "Số điện thoại của bạn không đúng định dạng!",
    email: {
        e1: "Email không hợp lệ!",
        e2: 'Email đã được sử dụng. Vui lòng thử một email khác!'
    },
    password: {
        e1: "Mật khẩu không được để trống",
        e2: "Mật khẩu phải có ít nhất một ký tự in hoa",
        e3: "Mật khẩu phải có ít nhất một ký tự thường",
        e4: "Mật khẩu phải có ít nhất một ký tự số",
        e5: "Mật khẩu phải có ít nhất một ký tự đặc biệt",
        e6: "Mật khẩu phải có ít nhất 8 ký tự"
    },
    User: {
        add: "Thêm mới người dùng thành công!",
        up: 'Cập nhật thông tin thành công!',
        errCode2: 'Không tìm thấy người dùng!',
        dlt: 'Xoá người dùng thành công!',
        dltFail: 'Xoá người dùng thất bại!',
        ok: 'Ok',
        block: 'Tài khoản của bạn đã bị vô hiệu hoá!',
        wrongPassword: 'Sai mật khẩu!',
        noEmail: `Email của bạn không tồn tại trong hệ thống. Vui lòng thử một email khác!`,
        upPassword: 'Thay đổi mật khẩu thành công!',
        wrongOldPass: 'Mật khẩu cũ không chính xác',
        enterEmail: "Hãy nhập email!",
        newNotSameOld: 'Mật khẩu mới không được trùng với mật khẩu cũ',
        ban: 'Vô hiệu hoá người dùng thành công!',
        permit: 'Mở khoá người dùng thành công!'

    },
    Allcode: {
        alreadyExists: 'Đã tồn tại trên hệ thống!',
        errCode0: "Ok",
        errCode2: 'Không tồn tại trên hệ thống',
        used: `Đã được sử dụng không thể xoá chỉ có thể ẩn!`,
        delete: `Xoá thành công!`,
        hidden: 'Ẩn thành công!',
        show: 'Hiện thành công!'
    },
    Banner: {
        errCode2: 'Không tìm thấy biểu ngữ!',
        add: 'Tạo mới biểu ngữ thành công!',
        update: 'Cập nhật thông tin biểu ngữ thành công!',
        delete: 'Xoá biểu ngữ thành công!',
        hidden: 'Ẩn biểu ngữ thành công!',
        show: 'Hiện biểu ngữ thành công!'
    },
    Blog: {
        add: 'Thêm mới bài đăng thành công!',
        addFail: 'Thêm mới bài đăng thất bại!',
        upFail: 'Chỉnh sửa bài đăng thất bại!',
        up: 'Chỉnh sửa bài đăng thành công!',
        errCode2: 'Không tìm thấy bài đăng!',
        deleteFail: 'Xoá bài đăng thất bại!',
        delete: 'Xoá bài đăng thành công!',
        hidden: 'Ẩn bài đăng thành công!',
        show: 'Hiện bài đăng thành công!'
    },
    Cart: {
        up: `Cập nhật số lượng sản phẩm thành công`,
        add: 'Thêm sản phẩm vào giỏ hàng thành công!',
        notFound: "Không tìm thấy!",
        deleteItem: `Xoá sản phẩm khỏi giỏ hàng thành công!`,
        errCode2: `Không tìm thấy sản phẩm trong giỏ hàng!`,
        delete: `Xoá giỏ hàng thành công!`
    },
    Comment: {
        add: 'Đánh giá thành công!',
        addFail: 'Đánh giá thất bại!',
        reply: 'Phản hồi bình luận thành công!',
        replyFail: 'Phản hồi bình luận thất bại!',
        delete: 'Xoá bình luận thành công!',
        deleteFail: 'Xoá bình luận thất bại!'
    },
    Import: {
        errCode2SP: 'Không tìm thấy sản phẩm!',
        errCode2PN: 'Không tìm thấy phiếu nhập!',
        add: 'Tạo mới phiếu nhập thành công!',
        up: 'Cập nhật phiếu nhập thành công!',
        noProductInImport: 'Không tìm thấy sản phẩm trong phiếu nhập!',
        delete: 'Xoá phiếu nhập thành công!'

    },
    Order: {
        success: 'Đặt hàng thành công!',
        cancel: 'Huỷ đơn hàng thành công!',
        ok: "Ok",
        paymentFail: "Thanh toán thất bại"
    },
    Product: {
        errCode2: 'Không tìm thấy sản phẩm!',
        addProduct: 'Thêm mới sản phẩm thành công!',
        addImgFail: 'Thêm mới hình ảnh sản phẩm thất bại!',
        addAgeFail: 'Thêm mới độ tuổi sử dụng sản phẩm thất bại!',
        addProductFail: 'Thêm mới sản phẩm thất bại!',
        noId: `Thiếu thông số bắt buộc: id`,
        up: 'Cập nhật sản phẩm thành công!',
        noName: 'Chưa nhập tên phẩm cần tìm!',
        hidden: 'Ẩn sản phẩm thành công!',
        show: 'Hiện sản phẩm thành công!',
        bought: 'Sản phẩm đã có người mua chỉ có thể ẩn không thể xoá!',
        delete: 'Xoá sản phẩm thành công!',
        addImg: 'Thêm mới hình ảnh thành công!',
        upImg: 'Cập nhật hình ảnh sản phẩm thành công!',
        noImg: 'Không tìm thấy hình ảnh sản phẩm!',
        getImgFail: 'Lấy dữ liệu hình ảnh thất bại!',
        dltImg: 'Xoá hình ảnh thành công!',
        dltImgFail: 'Xoá hình ảnh thất bại!',
        getDataFail: 'Lấy dữ liệu thất bại'
    },
    Receiver: {
        addFail: 'Tạo mới địa chỉ nhận hàng thất bại!',
        add: 'Tạo mới địa chỉ nhận hàng thành công!',
        errCode2: 'Không tìm thấy địa chỉ nhận hàng!',
        delete: 'Xoá địa chỉ nhận hàng thành công!',
        deleteFail: 'Xoá địa chỉ nhận hàng thất bại!',
        up: 'Chỉnh sửa địa chỉ nhận hàng thành công!',
        setDefault: 'Đặt địa chỉ nhận hàng làm mặc định thành công!'
    },
    TypeShip: {
        errCode2: 'Không tìm thấy phương thức vận chuyển',
        add: 'Tạo mới phương thức vận chuyển thành công!',
        up: 'Cập nhật thông tin phương thức vận chuyển thành công!',
        used: 'Không thể xoá phương thức vận chuyển đã được sử dụng!',
        dlt: 'Xoá phương thức vận chuyển thành công!'
    },
    TypeVoucher: {
        addFail: 'Thêm mới loại giảm giá thất bại!',
        add: 'Thêm mới loại giảm giá thành công!',
        up: 'Cập nhật thông tin loại giảm giá thành công!',
        upFail: 'Cập nhật thông tin loại giảm giá thất bại!',
        errCode2: 'Không tìm thấy loại giảm giá',
        dltFail: 'Xoá loại giảm giá thất bại!',
        dlt: 'Xoá loại giảm giá thành công!',
        used: 'Loại giảm giá đã được sử dụng không thể xoá!'
    },
    Voucher: {
        add: 'Thêm mới mã giảm giá thành công!',
        errCode2: "Không tìm thấy mã giảm giá!",
        upFail: 'Cập nhật mã giảm giá thất bại!',
        up: 'Cập nhật mã giảm giá thành công!',
        errCode2: 'Không tìm thấy mã giảm giá!',
        used: 'Không thể xoá mã giảm giá đã được sử dụng!',
        dltFail: 'Xoá mã giảm giá thất bại!',
        dlt: 'Xoá mã giảm giá thành công!',
        saved: 'Bạn đã lưu mã giảm giá này!',
        save: 'Lưu mã giảm giá thành công!',
        noVoucherOfUserUsed: "Không tìm thấy mã giảm giá người dùng đã sử dụng!"
    }
}