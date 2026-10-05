# Portfolio image uploads with Cloudflare R2

Add these values to `.env.local` and the Vercel environment, then restart/redeploy:

```dotenv
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_R2_PUBLIC_URL=https://images.your-domain.com
```

Use an R2 API token with Object Read & Write scoped to the image bucket. Keep the access keys server-only. The public URL contains no credentials. Use the same public URL at build time and runtime because Next.js image configuration and client validation use it.

Enable public access to the bucket through a custom domain, or use the bucket's `https://pub-….r2.dev` development URL. The public URL is not the S3 API endpoint.

In the bucket's CORS settings, add your real production origins and localhost:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

The admin chooses files; the authenticated server signs an upload valid for five minutes. The browser uploads directly to R2. Only the public image URL is stored in the portfolio. JPG, PNG, WebP and AVIF are accepted, up to 10 MB each and 20 gallery images per project. Content type and declared content length are signed.

Uploading a file does not publish the portfolio until the user saves the project. Removing a gallery image or project removes its reference, but does not delete the object from R2. This avoids deleting images still used elsewhere; unused uploads may need periodic cleanup.

References:
- https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- https://developers.cloudflare.com/r2/buckets/cors/
- https://developers.cloudflare.com/r2/buckets/public-buckets/
