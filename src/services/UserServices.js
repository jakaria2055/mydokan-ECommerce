import ProfileModel from "../models/ProfileModel.js";
import UserModel from "../models/UserModel.js";
import { EmailSend } from "../utils/EmailHelper.js";
import { EncodeToken } from "../utils/TokenHelper.js";

export const UserOTPService = async (req) => {
  try {
    let email = req.params.email;
    let code = Math.floor(100000 + Math.random() * 900000);

    let emailText = `Your Verifiaction code is ${code}`;
    let emailSubject = "Email Verification of mydokan";

    await EmailSend(email, emailText, emailSubject);

    await UserModel.updateOne(
      { email: email },
      { $set: { otp: code } },
      { upsert: true }
    );

    return { status: "success", message: "Your OTP has ben sent" };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const VerifyOTPService = async (req) => {
  try {
    let email = req.params.email;
    let otp = req.params.otp;

    let total = await UserModel.find({
      email: email,
      otp: otp,
    }).countDocuments();

    if (total == 1) {
      let user_id = await UserModel.find({
        email: email,
        otp: otp,
      }).select("_id");

      let token = EncodeToken(email, user_id[0]["_id"].toString());

      await UserModel.updateOne({ email: email }, { $set: { otp: "0" } });
      return { status: "success", message: "OTP valid", token: token };
    } else {
      return { status: "failed", message: "OTP Invalid" };
    }
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const SaveProfileService = async (req) => {
  try {
    const user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.user_id = user_id;

    await ProfileModel.updateOne(
      { userID: user_id },
      { $set: reqBody },
      { upsert: true },
    );

    return { status: "success", message: "Profile saved successfully." };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const ReadProfileService = async (req) => {
  try {
    const user_id = req.headers.user_id;

    const result =await ProfileModel.find({userID: user_id});

    return { status: "success",data: result, message: "Finded your profile data..." };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};
