"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("yo back at it huhhh :)!!!");
});
app.listen(5000, () => {
    console.log("server starting at port 5000");
});
exports.default = app;
//# sourceMappingURL=server.js.map