import express from "express";
import passport from 'passport';
import userController from "../controllers/userController";
import allCodeController from "../controllers/allCodeController";
import productController from '../controllers/productController';
import blogController from '../controllers/blogController';
import bannerController from "../controllers/bannerController";
import typeShipController from "../controllers/typeShipController";
import typeVoucherController from "../controllers/typeVoucherController";
import voucherController from "../controllers/voucherController";
import orderController from "../controllers/orderController";
import cartController from "../controllers/cartController";
import receiverController from "../controllers/receiverController";
import commentController from "../controllers/commentController";
import importProductController from "../controllers/importProductController";

let router = express.Router();
let initApiRoutes = (app) => {
    router.post("/create-a-new-user", userController.createANewUser); //body
    router.get("/get-all-user", userController.getAllUsers);
    router.get("/get-detail-user-by-id", userController.getDetailUserById); //id
    router.put("/edit-a-user", userController.editAUser); //body
    router.delete("/delete-a-user", userController.deleteAUser); //id
    router.post("/login", userController.handleLogin); // email, password
    router.put("/change-password", userController.handleChangePassword); // id, oldP, newP
    router.post("/send-verify-email", userController.sendVerifyEmail); //id
    router.post("/verify-email", userController.handleVerifyEmail); //id, token
    router.post("/send-forgot-password", userController.sendForgotPassword); //email
    router.post("/reset-password", userController.handleResetPassword); // id, token, newP
    router.put('/change-status-user', userController.changeStatusUser);

    router.get("/get-all-code", allCodeController.getAllCode); //"ALL,'TYPE'"
    router.post('/create-new-all-code', allCodeController.createNewAllCode); //keyMap, value, type
    router.put('/update-all-code', allCodeController.updateAllCode); //keyMap, value, id
    router.delete('/delete-all-code', allCodeController.deleteAllCode); //id
    router.get('/get-list-all-code', allCodeController.getListAllCode); //type,limit
    router.get('/get-detail-all-code-by-id', allCodeController.getDetailAllCodeById); //id
    router.put('/change-status-all-code', allCodeController.changeStatusAllcode);

    router.post('/create-new-product', productController.createNewProduct);
    router.put('/update-product', productController.updateProduct);
    router.get('/get-all-product', productController.getAllProduct);
    router.get('/get-top-product-home-page', productController.getTopProductHomePage);
    router.put('/change-status-product', productController.changeStatusProduct);
    router.delete('/delete-product', productController.deleteProduct);
    router.get('/search-product', productController.searchProduct);
    router.get('/get-detail-product-by-id', productController.getDetailProductById);
    router.get('/get-top-product-sold', productController.getTopProductSold);

    router.post('/create-new-product-image', productController.createNewProductImage);
    router.put('/update-product-image', productController.updateProductImage);
    router.get('/get-all-product-image-from-product', productController.getAllProductImageFromProduct);
    router.delete('/delete-product-image', productController.deleteProductImage);

    router.post('/create-new-banner', bannerController.createNewBanner);
    router.get('/get-all-banner', bannerController.getAllBanner);
    router.get('/get-detail-banner-by-id', bannerController.getDetailBannerById);
    router.get('/get-list-banner', bannerController.getListBanner);
    router.put('/update-banner', bannerController.updateBanner);
    router.delete('/delete-banner', bannerController.deleteBanner);
    router.put('/change-status-banner', bannerController.changeStatusBanner);

    router.post('/create-new-blog', blogController.createNewBlog);
    router.get('/get-detail-blog-by-id', blogController.getDetailBlogById);
    router.get('/get-all-blog', blogController.getAllBlog);
    router.get('/get-list-blog', blogController.getListBlog);
    router.put('/update-blog', blogController.updateBlog);
    router.delete('/delete-blog', blogController.deleteBlog);
    router.put('/change-status-blog', blogController.changeStatusBlog);

    router.post('/create-new-type-ship', typeShipController.createNewTypeShip);
    router.get('/get-detail-type-ship', typeShipController.getDetailTypeShipById);
    router.get('/get-all-type-ship', typeShipController.getAllTypeShip);
    router.get('/get-list-type-ship', typeShipController.getListTypeShip);
    router.put('/update-type-ship', typeShipController.updateTypeShip);
    router.delete('/delete-type-ship', typeShipController.deleteTypeShip);

    router.post('/create-new-type-voucher', typeVoucherController.createNewTypeVoucher);
    router.get('/get-detail-type-voucher-by-id', typeVoucherController.getDetailTypeVoucherById);
    router.get('/get-all-type-voucher', typeVoucherController.getAllTypeVoucher);
    router.put('/update-type-voucher', typeVoucherController.updateTypeVoucher);
    router.delete('/delete-type-voucher', typeVoucherController.deleteTypeVoucher);
    router.get('/get-select-type-voucher', typeVoucherController.getSelectTypeVoucher);

    router.post('/create-new-voucher', voucherController.createNewVoucher);
    router.get('/get-all-voucher', voucherController.getAllVoucher);
    router.put('/update-voucher', voucherController.updateVoucher);
    router.delete('/delete-voucher', voucherController.deleteVoucher);
    router.post('/save-user-voucher', voucherController.saveUserVoucher);
    router.get('/get-detail-voucher', voucherController.getDetailVoucherById);
    router.get('/get-all-voucher-user-used-by-user-id', voucherController.getAllVoucherByUserId);

    router.post('/create-new-order', orderController.createNewOrder);
    router.get('/get-all-order', orderController.getAllOrders);
    router.get('/get-detail-order', orderController.getDetailOrderById);
    router.put('/update-status-order', orderController.updateStatusOrder);
    router.get('/get-all-order-by-user-id', orderController.getAllOrdersByUserId);

    router.post('/add-cart', cartController.addItemCart);
    router.get('/get-all-cart-by-user-id', cartController.getAllCartByUserId);
    router.delete('/delete-item-cart', cartController.deleteItemCart);
    router.delete('/delete-item-cart-by-user-id', cartController.deleteItemCartByUserId);

    router.post('/create-new-receiver', receiverController.createNewReceiver);
    router.get('/get-all-receiver-by-user-id', receiverController.getAllReceiverByUserId);
    router.get('/get-detail-receiver-by-id', receiverController.getDetailReceiverById);
    router.put('/update-receiver', receiverController.editReceiver);
    router.put('/change-status-receiver', receiverController.handleChangeStatusReceiver);
    router.delete('/delete-receiver', receiverController.deleteReceiver);

    router.post('/create-new-comment', commentController.createNewComment)
    router.post('/reply-comment', commentController.ReplyComment)
    router.get('/get-all-comment-by-product-id', commentController.getAllCommentByProductId)
    router.delete('/delete-comment', commentController.deleteComment)

    router.post('/create-new-import-product', importProductController.addImport);
    router.get('/get-all-import-product', importProductController.getAllImport);
    router.put('/update-import-product', importProductController.updateImport);
    router.delete('/delete-import-product', importProductController.deleteImport);

    router.post('/payment-momo', orderController.paymentMomoOrder)
    router.post('/payment-paypal', orderController.paymentPayPalOrder)
    router.post('/payment-paypal-success', orderController.paymentPayPalSuccess)


    return app.use("/api", router);
}
module.exports = initApiRoutes