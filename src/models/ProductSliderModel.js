import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    image1: {type: String, required: true},
    desc: {type: String, required: true},
    price: {type: String, required: true},
    image: {type: String, required: true},
    productID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "products"},

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductSliderModel = mongoose.model("productsliders", DataSchema);

export default ProductSliderModel;
