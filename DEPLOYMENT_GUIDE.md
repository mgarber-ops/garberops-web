# GarberOps Website Deployment Guide

This guide provides step-by-step instructions for deploying your GarberOps website to AWS S3 with static website hosting.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure the AWS CLI
3. **IAM Permissions**: Ensure your AWS user has the following permissions:
   - `s3:CreateBucket`
   - `s3:PutBucketPolicy`
   - `s3:PutBucketWebsite`
   - `s3:PutObject`
   - `s3:GetObject`
   - `s3:ListBucket`

## Quick Deployment

### Option 1: Using the Automated Script (Recommended)

1. **Navigate to the project directory**:
   ```bash
   cd /home/mgarber/garber-ops
   ```

2. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

   The script will:
   - Create an S3 bucket named `garberops-website`
   - Configure static website hosting
   - Set appropriate bucket policies
   - Upload all website files
   - Display the website URL

### Option 2: Manual Deployment

If you prefer to deploy manually or need custom configuration:

1. **Create an S3 bucket**:
   ```bash
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

2. **Configure static website hosting**:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

3. **Set bucket policy for public access**:
   ```bash
   aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }'
   ```

4. **Upload website files**:
   ```bash
   aws s3 sync . s3://your-bucket-name --exclude "*.md" --exclude ".git/*" --exclude "deploy.sh"
   ```

5. **Get your website URL**:
   ```bash
   aws s3api get-bucket-website --bucket your-bucket-name
   ```

## Custom Domain Setup (Optional)

### Using CloudFront

1. **Create a CloudFront distribution**:
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: index.html

2. **Configure custom domain**:
   - Add your domain to the CloudFront distribution
   - Create SSL certificate in AWS Certificate Manager
   - Update DNS records to point to CloudFront

### Using Route 53

1. **Create a hosted zone** for your domain
2. **Create an A record** pointing to your S3 website endpoint
3. **Create an AAAA record** for IPv6 support

## Configuration Options

### Customizing the Deployment Script

You can customize the deployment by modifying the variables at the top of `deploy.sh`:

```bash
BUCKET_NAME="garberops-website"  # Change bucket name
REGION="us-east-1"               # Change AWS region
PROFILE="default"                # Change AWS profile
```

### Command Line Options

The deployment script supports command line options:

```bash
# Use custom bucket name
./deploy.sh --bucket-name my-custom-website

# Use different region
./deploy.sh --region us-west-2

# Use different AWS profile
./deploy.sh --profile production

# Show help
./deploy.sh --help
```

## Troubleshooting

### Common Issues

1. **Bucket already exists in another region**:
   - Choose a different bucket name or region
   - S3 bucket names must be globally unique

2. **Access denied errors**:
   - Check your AWS credentials: `aws configure list`
   - Verify IAM permissions
   - Ensure you're using the correct AWS profile

3. **Website not loading**:
   - Check bucket policy is set correctly
   - Verify static website hosting is enabled
   - Check the website endpoint URL

4. **Files not uploading**:
   - Check file permissions
   - Verify you're in the correct directory
   - Check AWS CLI configuration

### Verification Steps

1. **Check bucket exists**:
   ```bash
   aws s3 ls s3://your-bucket-name
   ```

2. **Verify website configuration**:
   ```bash
   aws s3api get-bucket-website --bucket your-bucket-name
   ```

3. **Check bucket policy**:
   ```bash
   aws s3api get-bucket-policy --bucket your-bucket-name
   ```

4. **Test website access**:
   ```bash
   curl -I http://your-bucket-name.s3-website-region.amazonaws.com
   ```

## Security Considerations

1. **HTTPS**: Consider using CloudFront with SSL certificate for HTTPS
2. **Access Logging**: Enable S3 access logging for monitoring
3. **Versioning**: Enable S3 versioning for backup and rollback
4. **Monitoring**: Set up CloudWatch alarms for monitoring

## Cost Optimization

1. **S3 Storage**: Minimal cost for static website hosting
2. **Data Transfer**: Free for first 1GB per month
3. **CloudFront**: Consider for global distribution and HTTPS
4. **Monitoring**: Set up billing alerts

## Maintenance

### Updating the Website

To update your website, simply run the deployment script again:

```bash
./deploy.sh
```

The script will sync only changed files, making updates efficient.

### Backup

Consider enabling S3 versioning for automatic backups:

```bash
aws s3api put-bucket-versioning --bucket your-bucket-name --versioning-configuration Status=Enabled
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review AWS S3 documentation
3. Check AWS CLI documentation
4. Verify your AWS account status and billing

---

**Your GarberOps website is now ready for deployment!** 🚀 