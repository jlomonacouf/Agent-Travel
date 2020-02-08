const AWS = require('aws-sdk');
const config = require('../config/config');

const ID = process.env.S3_KEY_ID || config.aws.id;
const SECRET = process.env.S3_SECRETE_KEY || config.aws.key;
const BUCKET_NAME = process.env.S3_BUCKET_NAME || config.aws.bucketName;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    signatureVersion: 'v4'
});

exports.generatedUploadURL = (file) => {
    const fileName = file.filename;

    var params = {
        Bucket: BUCKET_NAME,
        Key: file.username + "/" + fileName,
        Expires: 60
    };

    s3.getSignedUrl("putObject", params, function(err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log(data)
            res.json({success:true, data:{data}});
            return data;
        }
    });
};