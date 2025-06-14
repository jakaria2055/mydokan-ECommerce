import mongoose from "mongoose";
import BrandModel from "../models/BrandModel.js";
import CategoryModel from "../models/CategoryModel.js";
import ProductSliderModel from "../models/ProductSliderModel.js";
import ProductModel from "../models/ProductModel.js";
import ReviewModel from "../models/ReviewModel.js";

const ObjectID = mongoose.Types.ObjectId;

export const BrandListService = async () => {
  try {
    const data = await BrandModel.find();
    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const CreateBrandListService = async (req) => {
  try {
    const data = req.body;

    const createBrand = await BrandModel.create(data);
    return { status: "success", data: createBrand };
  } catch (e) {
    return { status: "fail", data: e.message || e };
  }
};

export const CategoryListService = async () => {
  try {
    const data = await CategoryModel.find();
    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const SliderListService = async () => {
  try {
    const data = await ProductSliderModel.find();
    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const ProductListByBrandService = async () => {
  try {
    const data = await ProductSliderModel.find();
    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const ListByBrandService = async (req) => {
  try {
    const brandID = new ObjectID(req.params.brandID);
    const matchStage = { $match: { brandID: brandID } };
    const joinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    const joinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    const UnwindBrandStage = { $unwind: "$brand" };
    const UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: { brand_id: 0, category_id: 0, brandID: 0 },
    };

    let data = await ProductModel.aggregate([
      matchStage,
      joinWithBrandStage,
      joinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const ListByCategoryService = async (req) => {
  try {
    const categoryID = new ObjectID(req.params.categoryID);
    const matchStage = { $match: { categoryID: categoryID } };
    const joinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    const joinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };
    const UnwindBrandStage = { $unwind: "$brand" };
    const UnwindCategoryStage = { $unwind: "$category" };
    let ProjectionStage = {
      $project: { brand_id: 0, category_id: 0, brandID: 0 },
    };

    let data = await ProductModel.aggregate([
      matchStage,
      joinWithBrandStage,
      joinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const ListBySmilierService = async (req) => {
  try {
    let categoryID = new ObjectID(req.params.categoryID);
    let matchStage = { $match: { categoryID: categoryID } };
    let limitStage = { $limit: 20 };

    let joinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let joinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    const UnwindBrandStage = { $unwind: "$brand" };
    const UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: { brand_id: 0, category_id: 0, brandID: 0 },
    };
    let data = await ProductModel.aggregate([
      matchStage,
      joinWithBrandStage,
      joinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const ListByKeywordService = async (req) => {
  try {
    let SearchRegex = { $regex: req.params.Keyword, $options: "i" };
    let SearchParams = [{ title: SearchRegex }, { shortDes: SearchRegex }];
    let SearchQuery = { $or: SearchParams };

    let matchStage = { $match: SearchQuery };

    let joinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let joinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    const UnwindBrandStage = { $unwind: "$brand" };
    const UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: { brand_id: 0, category_id: 0, brandID: 0 },
    };
    let data = await ProductModel.aggregate([
      matchStage,
      joinWithBrandStage,
      joinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const ListByRemarkService = async (req) => {
  try {
    let remark = req.params.Remark;
    let matchStage = { $match: { remark: remark } };

    let joinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let joinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };

    const UnwindBrandStage = { $unwind: "$brand" };
    const UnwindCategoryStage = { $unwind: "$category" };

    let ProjectionStage = {
      $project: { brand_id: 0, category_id: 0, brandID: 0 },
    };
    let data = await ProductModel.aggregate([
      matchStage,
      joinWithBrandStage,
      joinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const DetailsService = async (req) => {
  try {
    let ProductID = new ObjectID(req.params.ProductID);
    let matchStage = { $match: { _id: ProductID } };

    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "category",
      },
    };
    let JoinWithDetailsStage = {
      $lookup: {
        from: "productdetails",
        localField: "_id",
        foreignField: "productID",
        as: "details",
      },
    };

    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };
    let UnwindDetailsStage = { $unwind: "$details" };

    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "category._id": 0,
        categoryID: 0,
        brandID: 0,
      },
    };

    let data = await ProductModel.aggregate([
      matchStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      JoinWithDetailsStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      UnwindDetailsStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e }.toString();
  }
};

export const CreateReviewService = async (req) => {
  try {
    const user_id = req.headers.user_id;
    const reqBody = req.body;

    const data = await ReviewModel.create({
      productID: reqBody.productID,
      userID: user_id,
      des: reqBody.des,
      rating: reqBody.rating,
    });

    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e.toString() };
  }
};

export const ReviewListService = async (req) => {
  try {
    const ProductID = new ObjectID(req.params.ProductID);

    const data = await ReviewModel.aggregate([
      { $match: { productID: ProductID } },
      {
        $lookup: {
          from: "profiles",
          localField: "userID",
          foreignField: "userID",
          as: "profile",
        },
      },
      { $unwind: "$profile" },
      { $project: { des: 1, rating: 1, "profile.cus_name": 1 } },
    ]);

    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e.toString() };
  }
};

export const ListByFilterService = async (req) => {
  try {
    const matchConditions = {};
    if (req.body.categoryID) {
      matchConditions.categoryID = new ObjectID(req.body.categoryID);
    }
    if (req.body.brandID) {
      matchConditions.brandID = new ObjectID(req.body.brandID);
    }

    const priceMin = parseInt(req.body.priceMin);
    const priceMax = parseInt(req.body.priceMax);

    const priceMatch = {};
    if (!isNaN(priceMin)) priceMatch.numericPrice = { $gte: priceMin };
    if (!isNaN(priceMax))
      priceMatch.numericPrice = {
        ...(priceMatch.numericPrice || {}),
        $lte: priceMax,
      };

    const data = await ProductModel.aggregate([
      { $match: matchConditions },
      { $addFields: { numericPrice: { $toInt: "$price" } } },
      { $match: priceMatch },
      {
        $lookup: {
          from: "brands",
          localField: "brandID",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$brand" },
      { $unwind: "$category" },
      {
        $project: {
          "brand._id": 0,
          "category._id": 0,
          categoryID: 0,
          brandID: 0,
        },
      },
    ]);

    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e.toString() };
  }
};
