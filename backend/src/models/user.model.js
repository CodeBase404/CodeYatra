const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  razorpay_payment_id: String,
  razorpay_order_id: String,
  amount: Number,
  status: {
    type: String,
    enum: ["captured", "failed", "refunded"],
    default: "captured",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const premiumPlanSchema = new Schema({
  type: {
    type: String,
    enum: ["none", "monthly", "yearly"],
    default: "none",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  startDate: Date,
  endDate: Date,
  isUsed: {
    type: Boolean,
    default: false,
  },
});

const otpSchema = new Schema({
  otp: String,
  expireAt: Date,
  sentAt: Date,
  verified: {
    type: Boolean,
    default: false,
  },
});

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      default: "prefer not to say",
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    location: { type: String },
    birthday: { type: Date },
    summary: { type: String, maxlength: 1000 },
    profileImage: {
      publicId: String,
      secureUrl: String,
    },
    github: { type: String },
    linkedin: { type: String },
    skills: [{ type: String }],
    experience: [experienceSchema],
    education: [educationSchema],
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
        },
      ],
      unique: true,
    },
    dailyChallengeHistory: [
      {
        date: String,
        problemId: mongoose.Schema.Types.ObjectId,
        solved: Boolean,
      },
    ],
    premiumPlan: premiumPlanSchema,
    paymentHistory: [paymentSchema],
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    emailVerification: otpSchema,
    passwordReset: otpSchema,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "problem" }],
    streak: {
      count: { type: Number, default: 0 },
      lastSolvedDate: { type: Date },
      highestStreak: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
