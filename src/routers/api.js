import express from "express";
import { ProductBrandList, ProductCategoryList, ProductDetails, ProductListByBrand, ProductListByCategory, ProductListByKeyword, ProductListByRemark, ProductListBySmilier, ProductSliderList} from "../controllers/ProductController.js";

const router = express.Router();

router.get('/productBrandList', ProductBrandList);
router.get('/ProductCategoryList', ProductCategoryList);
router.get('/ProductSliderList', ProductSliderList);
router.get('/ProductListByBrand/:brandID', ProductListByBrand);
router.get('/ProductListByCategory/:categoryID',ProductListByCategory);
router.get('/ProductListBySmilier/:categoryID',ProductListBySmilier);
router.get('/ProductListByKeyword/:Keyword',ProductListByKeyword);
router.get('/ProductListByRemark/:Remark',ProductListByRemark);
router.get('/ProductDetails/:ProductID',ProductDetails);




export default router;