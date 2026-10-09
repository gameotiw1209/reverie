"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const notes_1 = __importDefault(require("./routes/notes"));
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "100kb" }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5000",
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
app.use("/api", notes_1.default);
app.use("/api", auth_1.default);
app.use("/api", chat_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map