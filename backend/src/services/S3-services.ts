const AWS = require('aws-sdk'); 
export const uploadToS3 = async (filename: string, file: Express.Multer.File, type: string) => {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET

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
    }

    const s3_promise = new Promise((res, rej) => {
        s3bucket.upload(params, (err: Error | any, s3_res: any) => {
            if(err){
                console.log(err);
                rej(new Error(err.message));
            }
            else{
                res(s3_res.Location);
            }
        });
    });

    return await s3_promise;
}