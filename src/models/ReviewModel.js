import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    productID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "products"},
    userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"},
    des: {type: String},
    rating: {type: String, required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ReviewModel = mongoose.model("reviews", DataSchema);

export default ReviewModel;
