"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = void 0;
const database_1 = __importDefault(require("../util/database"));
const transaction = () => {
    return database_1.default.transaction();
};
exports.transaction = transaction;
