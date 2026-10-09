"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROQ_MODEL = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY
});
exports.GROQ_MODEL = process.env.GROQ_MODEL;
exports.default = groq;
//# sourceMappingURL=groq.js.map