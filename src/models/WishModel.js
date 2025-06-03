import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    productID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "products"},
    userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WishModel = mongoose.model("wishes", DataSchema);

export default WishModel;
