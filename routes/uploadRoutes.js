const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');


const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
})


module.exports = app => {
    app.get('/api/upload', (req, res) => {
        const key = `${req.User.id}/${uuid().jpeg}`

        s3.getSignedUrl('putObject', {
            Bucket: 'my-blog-bucket-123',
            ContentType: 'image/jpeg',
            key: key
        },
        (err, url) => res.send({ key, url }))
    });
};