import mongoose from "mongoose";
import WishModel from "../models/WishModel.js";

export const SaveWishListService = async (req) => {
  try {
    const user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;

    await WishModel.updateOne(reqBody, { $set: reqBody }, { upsert: true });

    return { status: "success", message: "Wishlist Added successfully." };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const RemoveSaveWishListService = async (req) => {
  try {
    const user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;

    await WishModel.deleteOne(reqBody);

    return { status: "success", message: "Wishlist Deleted successfully." };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const WishListService = async (req) => {
  try {
    const user_id = new mongoose.Types.ObjectId(req.headers.user_id);

    let matchStage = { $match: { userID: user_id } };

    let joinStageProduct = {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "PRODUCTS",
      },
    };

    let unwindProductStage = { $unwind: "$PRODUCTS" };

    let joinStageBrand = {
      $lookup: {
        from: "brands",
        localField: "PRODUCTS.brandID",
        foreignField: "_id",
        as: "BRAND",
      },
    };

    let unwindBrandStage = { $unwind: "$BRAND" };

    let joinStageCategory = {
      $lookup: {
        from: "categories",
        localField: "PRODUCTS.categoryID",
        foreignField: "_id",
        as: "CATEGORY",
      },
    };

    let unwindCategoryStage = { $unwind: "$CATEGORY" };

    let projectionStage = {
      $project: {
        _id: 0,
        userID: 0,
        createdAt: 0,
        updatedAt: 0,
        "PRODUCTS._id": 0,
        "PRODUCTS.categoryID": 0,
        "PRODUCTS.brandID": 0,
        "BRAND._id": 0,
        "CATEGORY._id": 0,
      },
    };

    let data = await WishModel.aggregate([
      matchStage,
      joinStageProduct,
      unwindProductStage,
      joinStageBrand,
      unwindBrandStage,
      joinStageCategory,
      unwindCategoryStage,
      projectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};
