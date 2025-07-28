const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth.middleware.js");
const { getChatById, solveDoubt, deleteChatById, platformDoubt, resumeBuilder } = require("../controllers/chat.controller.js");

const chatRouter = express.Router();

chatRouter.post("/faq",userAuthMiddleware, platformDoubt);
chatRouter.post("/resume/generate",userAuthMiddleware, resumeBuilder);
chatRouter.post("/:id",userAuthMiddleware, solveDoubt);
chatRouter.get("/:id",userAuthMiddleware, getChatById);
chatRouter.delete("/:id",userAuthMiddleware, deleteChatById);

module.exports = chatRouter;
