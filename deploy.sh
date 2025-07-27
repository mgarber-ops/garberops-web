#!/bin/bash

# GarberOps Website Deployment Script
# This script deploys the website to AWS S3 with static website hosting

set -e  # Exit on any error

# Configuration
BUCKET_NAME="garberops-website"
REGION="us-east-1"  # Change this to your preferred region
PROFILE="default"   # Change this to your AWS profile if different

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    print_success "AWS CLI found"
}

# Check if bucket exists, create if it doesn't
create_bucket_if_not_exists() {
    print_status "Checking if bucket '$BUCKET_NAME' exists..."
    
    if aws s3api head-bucket --bucket "$BUCKET_NAME" --profile "$PROFILE" 2>/dev/null; then
        print_success "Bucket '$BUCKET_NAME' already exists"
    else
        print_status "Creating bucket '$BUCKET_NAME' in region '$REGION'..."
        aws s3 mb "s3://$BUCKET_NAME" --region "$REGION" --profile "$PROFILE"
        print_success "Bucket '$BUCKET_NAME' created successfully"
    fi
}

# Configure bucket for static website hosting
configure_website_hosting() {
    print_status "Configuring static website hosting..."
    
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document index.html \
        --profile "$PROFILE"
    
    print_success "Static website hosting configured"
}

# Set bucket policy for public read access
set_bucket_policy() {
    print_status "Setting bucket policy for public read access..."
    
    # Create bucket policy JSON
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    # Apply the policy
    aws s3api put-bucket-policy \
        --bucket "$BUCKET_NAME" \
        --policy file://bucket-policy.json \
        --profile "$PROFILE"
    
    # Clean up
    rm bucket-policy.json
    
    print_success "Bucket policy set successfully"
}

# Upload files to S3
upload_files() {
    print_status "Uploading files to S3..."
    
    aws s3 sync . "s3://$BUCKET_NAME" \
        --exclude "*.md" \
        --exclude ".git/*" \
        --exclude "deploy.sh" \
        --exclude "bucket-policy.json" \
        --profile "$PROFILE"
    
    print_success "Files uploaded successfully"
}

# Get website URL
get_website_url() {
    print_status "Getting website URL..."
    
    WEBSITE_URL=$(aws s3api get-bucket-website --bucket "$BUCKET_NAME" --profile "$PROFILE" --query 'WebsiteEndpoint' --output text)
    
    print_success "Website deployed successfully!"
    echo ""
    echo "🌐 Your website is now live at:"
    echo "   http://$WEBSITE_URL"
    echo ""
    echo "📝 To update the website, simply run this script again."
    echo ""
}

# Main deployment function
main() {
    echo "🚀 Starting GarberOps website deployment..."
    echo ""
    
    check_aws_cli
    create_bucket_if_not_exists
    configure_website_hosting
    set_bucket_policy
    upload_files
    get_website_url
    
    echo "✅ Deployment completed successfully!"
}

# Check if script is run with correct arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --bucket-name NAME    Set custom bucket name (default: garberops-website)"
    echo "  --region REGION       Set AWS region (default: us-east-1)"
    echo "  --profile PROFILE     Set AWS profile (default: default)"
    echo "  --help, -h           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 --bucket-name my-website --region us-west-2"
    echo "  $0 --profile production"
    exit 0
fi

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --bucket-name)
            BUCKET_NAME="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main deployment
main 