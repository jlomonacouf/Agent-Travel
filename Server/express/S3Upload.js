const AWS = require('aws-sdk');
const config = require('./config/config');
var randomatic = require('randomatic');

const ID = config.aws.id;
const SECRET = config.aws.key;
const BUCKET_NAME = config.aws.bucketName;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    signatureVersion: 'v4',
    region: 'us-east-2'
});

exports.generateUploadURL = (username) => {
    return new Promise((resolve, reject) => {
        //const fileName =  randomatic('Aa0', 40);
        const fileName =  "hellomate.txt";
        var params = {
            Bucket: BUCKET_NAME,
            Key: username + "/" + fileName,
            Expires: 60
        };

        s3.getSignedUrl("putObject", params, function(err, data) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            else {
                const returnData = {
                    signedRequest: data,
                    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`
                  };

                resolve(returnData);
                return;
            }
        });
    })
};