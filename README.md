
# DigitalOcean Spaces - upload test

How to clone and use this repo:

1. After creating a bucket, go to Spaces > Manage keys > Generate new key and secret > Copy it into .env.example (note: the SPACES_API_ENDPOINT should be like this: https://fra1.digitaloceanspaces.com/ not the full one)
2. Rename .env.example to .env
3. In /api/get-presigned-url change your **region in s3Client**, **bucketName** and path to your bucket/folder in the **key** variable
4. IMPORTANT! Go to your Spaces bucket > Settings > Add CORS > Allowed headers and Origin should both be * , and select all methods for now
5. Install and run app and try to upload something

**P.S.** I didn't bother too much to make it look preety, so if you press Upload inside the uppy Dashboard it will show sucess, but only if you press the upload button below it will you get the response from Spaces printed out into the console
