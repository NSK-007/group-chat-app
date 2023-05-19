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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const AWS = require('aws-sdk');
const uploadToS3 = (filename, file, type) => __awaiter(void 0, void 0, void 0, function* () {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: file.buffer,
        ContentType: type,
        // Body: Buffer.from(file.buffer, 'binary'),
        // ACL: 'public-read'
        ACL: process.env.ACL_VALUE,
    };
    const s3_promise = new Promise((res, rej) => {
        s3bucket.upload(params, (err, s3_res) => {
            if (err) {
                console.log(err);
                rej(new Error(err.message));
            }
            else {
                res(s3_res.Location);
            }
        });
    });
    return yield s3_promise;
});
exports.uploadToS3 = uploadToS3;
