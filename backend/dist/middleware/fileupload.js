"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileStorage = multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "../public/uploads/");
            },
            filename: function (req, file, cb) {
                console.log(file.fieldname);
                cb(null, Date.now() + file.fieldname);
            }
        });
        const maxSize = 1 * 1000 * 1000;
        let upload = (0, multer_1.default)({
            storage: fileStorage,
            limits: { fileSize: maxSize },
            fileFilter: function (req, file, cb) {
                if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'video/mp4' || file.mimetype === 'application/pdf') {
                    cb(null, true);
                }
                else {
                    cb(null, false);
                }
            }
        }).single('multimedia');
        // req.upload = upload;
        return upload;
    }
    catch (err) {
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.fileUpload = fileUpload;
