import express from "express";
import {
  CreateReview,
  ProductBrandList,
  ProductCategoryList,
  ProductDetails,
  ProductListByBrand,
  ProductListByCategory,
  ProductListByFilter,
  ProductListByKeyword,
  ProductListByRemark,
  ProductListBySmilier,
  ProductReviewList,
  ProductSliderList,
} from "../controllers/ProductController.js";
import { AuthVerification } from "../middlewares/AuthVerification.js";
import {
  CreateProfile,
  ReadProfile,
  UpdateProfile,
  UserLogout,
  UserOTP,
  VerifyLogin,
} from "../controllers/UserController.js";
import {
  RemoveWishList,
  SaveWishList,
  WishList,
} from "../controllers/WishListController.js";
import {
  CartList,
  RemoveCartList,
  SaveCartList,
  UpdateCartList,
} from "../controllers/CartListController.js";

const router = express.Router();

//PRODUCT
router.get("/productBrandList", ProductBrandList);
router.get("/ProductCategoryList", ProductCategoryList);
router.get("/ProductSliderList", ProductSliderList);

router.get("/ProductListByBrand/:brandID", ProductListByBrand);
router.get("/ProductListByCategory/:categoryID", ProductListByCategory);
router.get("/ProductListBySmilier/:categoryID", ProductListBySmilier);
router.get("/ProductListByKeyword/:Keyword", ProductListByKeyword);
router.get("/ProductListByRemark/:Remark", ProductListByRemark);
router.get("/ProductDetails/:ProductID", ProductDetails);

router.post("/create-review", AuthVerification, CreateReview);
router.get("/review-list/:ProductID", ProductReviewList);

router.post("/list-by-filter", ProductListByFilter);

//USER
router.get("/UserOTP/:email", UserOTP);
router.get("/VerifyLogin/:email/:otp", VerifyLogin);
router.get("/UserLogout", AuthVerification, UserLogout);

router.post("/CreateProfile", AuthVerification, CreateProfile);
router.get("/ReadProfile", AuthVerification, ReadProfile);
router.put("/UpdateProfile", AuthVerification, UpdateProfile);

//Wishlist
router.post("/SaveWishList", AuthVerification, SaveWishList);
router.delete("/RemoveWishList", AuthVerification, RemoveWishList);
router.get("/WishList", AuthVerification, WishList);

//Cart
router.post("/SaveCartList", AuthVerification, SaveCartList);
router.post("/UpdateCartList/:cartID", AuthVerification, UpdateCartList);
router.post("/RemoveCartList", AuthVerification, RemoveCartList);
router.get("/CartList", AuthVerification, CartList);

export default router;
