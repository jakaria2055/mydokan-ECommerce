import mongoose from "mongoose";
import axios from "axios";
import FormData from "form-data";

import CartModel from "../models/CartModel.js";
import ProfileModel from "../models/ProfileModel.js";
import InvoiceModel from "../models/InvoiceModel.js";
import InvoiceProductModel from "../models/InvoiceProductModel.js";
import PaymentSettingModel from "../models/PaymentSettingModel.js";

const ObjectID = mongoose.Types.ObjectId;
export const CreateInvoiceService = async (req) => {
  const user_id = new ObjectID(req.headers.user_id);
  const cus_email = req.headers?.email;

  //CALCULATE VAT & TOTAL PAYBALE AMOUNT
  const CartProduct = await CartModel.aggregate([
    { $match: { userID: user_id } },
    {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);

  //console.log(CartProduct);

  let totalAmount = 0;
  CartProduct.forEach((element) => {
    const price = element.product.discount
      ? parseFloat(element.product.discountPrice)
      : parseFloat(element.product.price);
    totalAmount = totalAmount + parseFloat(element.qty) * price;
  });
  //console.log(totalAmount);

  const vat = totalAmount * 0.05;
  const payable = totalAmount + vat;

  //CUSTOMER AND SHIPPING DETAILS
  const profile = await ProfileModel.aggregate([
    { $match: { userID: user_id } },
  ]);
  //console.log(profile);

  const cusDetails = `Name: ${profile[0]?.cus_name}, Email: ${cus_email}, Address: ${profile[0]?.cus_add}, Phone: ${profile[0]?.cus_phone}`;
  const shipDetails = `Name: ${profile[0].ship_name}, City: ${profile[0].ship_city}, Address: ${profile[0].ship_add}, Phone: ${profile[0].ship_phone}`;

  //TRANSACTION DETAILS
  const tran_id = Math.floor(10000000 + Math.random() * 90000000);
  const val_id = 0;
  const delivery_status = "Pending...";
  const payment_status = "Pending";

  //INVOICE
  const createInvoice = await InvoiceModel.create({
    userID: user_id,
    payable,
    cus_details: cusDetails,
    ship_details: shipDetails,
    tran_id,
    val_id,
    payment_status,
    delivery_status,
    total: totalAmount,
    vat,
  });

  //CREATE INVOICE PRODUCT
  const invoice_id = createInvoice._id;
  CartProduct.forEach(async (element) => {
    await InvoiceProductModel.create({
      userID: user_id,
      productID: element.productID,
      invoiceID: invoice_id,
      qty: element.qty,
      price: element.product.discount
        ? element.product.discountPrice
        : element.product.price,
      color: element.color,
      size: element.size,
    });
  });

  //CLEAR CART
  await CartModel.deleteMany({ userID: user_id });

  //PREAPARE SSL PAYMENT
  const PaymentSettings = await PaymentSettingModel.find();
  //console.log(PaymentSettings);

  const form = new FormData();
  form.append("store_id", PaymentSettings[0].store_id);
  form.append("store_passwd", PaymentSettings[0].store_password);
  form.append("total_amount", payable.toString());
  form.append("currency", PaymentSettings[0].currency);
  form.append("tran_id", tran_id);

  form.append("success_url", `${PaymentSettings[0].success_url}/${tran_id}`);
  form.append("fail_url", `${PaymentSettings[0].fail_url}/${tran_id}`);
  form.append("cancel_url", `${PaymentSettings[0].cancel_url}/${tran_id}`);
  form.append("ipn_url", `${PaymentSettings[0].ipn_url}/${tran_id}`);

  form.append("cus_name", profile[0].cus_name);
  form.append("cus_email", cus_email);
  form.append("cus_add1", profile[0].cus_add);
  form.append("cus_add2", profile[0].cus_add);
  form.append("cus_city", profile[0].cus_city);
  form.append("cus_state", profile[0].cus_state);
  form.append("cus_postcode", profile[0].cus_postcode);
  form.append("cus_country", profile[0].cus_country);
  form.append("cus_phone", profile[0].cus_phone);
  form.append("cus_fax", profile[0].cus_phone);

  form.append("shipping_method", "YES");
  form.append("ship_name", profile[0].ship_name);
  form.append("ship_add1", profile[0].ship_add);
  form.append("ship_add2", profile[0].ship_add);
  form.append("ship_city", profile[0].ship_city);
  form.append("ship_state", profile[0].ship_state);
  form.append("ship_country", profile[0].ship_country);
  form.append("ship_postcode", profile[0].ship_postcode);

  form.append("product_name", "According Invoice");
  form.append("product_category", "According Invoice");
  form.append("product_profile", "According Invoice");
  form.append("product_amount", "According Invoice");

  const SSLRes = await axios.post(PaymentSettings[0].init_url, form);
  return { status: "success", data: SSLRes.data };
};

export const PaymentSuccessService = async (req) => {
  try {
    const trxID = req.params.trxID;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: "success" }
    );
    return { status: "success" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const PaymentFailService = async (req) => {
  try {
    const trxID = req.params.trxID;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: "fail" }
    );
    return { status: "fail" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const PaymentCancelService = async (req) => {
  try {
    const trxID = req.params.trxID;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: "cancel" }
    );
    return { status: "cancel" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const PaymentIPNService = async (req) => {
  try {
    const trxID = req.params.trxID;
    const status = req.body.status;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: status }
    );
    return { status: "success" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const InvoiceListService = async (req) => {
  try {
    const user_id = req.headers.user_id;
    const invoice = await InvoiceModel.find({ userID: user_id });
    return { status: "success", data: invoice };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const InvoiceProductListService = async (req) => {
  try {
    const user_id = new ObjectID(req.headers.user_id);
    const invoice_id = new ObjectID(req.params.invoice_id);

    const products = await InvoiceProductModel.aggregate([
      { $match: { userID: user_id, invoiceID: invoice_id } },
      {
        $lookup: {
          from: "products",
          localField: "productID",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    return { status: "success", data: products };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};
