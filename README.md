# GarberOps - Cloud Consulting Website

A modern, responsive landing page for GarberOps cloud consulting services, featuring DevOps, security, and automation expertise.

## Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Elements**: Smooth scrolling, hover effects, and form validation
- **Performance Optimized**: Fast loading with optimized assets and minimal dependencies
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## Technologies Used

- HTML5
- CSS3 (with modern features like Grid, Flexbox, and CSS Variables)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)

## Project Structure

```
garber-ops/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Local Development

1. Clone or download the project files
2. Open `index.html` in your web browser
3. For live development, you can use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## Deployment to AWS S3

### Prerequisites

- AWS CLI installed and configured
- S3 bucket created
- Appropriate IAM permissions

### Steps

1. **Create an S3 bucket** (if not already created):
   ```bash
   aws s3 mb s3://your-garberops-website
   ```

2. **Configure the bucket for static website hosting**:
   ```bash
   aws s3 website s3://your-garberops-website --index-document index.html --error-document index.html
   ```

3. **Set bucket policy for public read access**:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::your-garberops-website/*"
           }
       ]
   }
   ```

4. **Upload files to S3**:
   ```bash
   aws s3 sync . s3://your-garberops-website --exclude "*.md" --exclude ".git/*"
   ```

5. **Access your website**:
   - Website URL: `http://your-garberops-website.s3-website-[region].amazonaws.com`
   - Or configure a custom domain with CloudFront

### Optional: Custom Domain with CloudFront

1. **Create a CloudFront distribution**:
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: index.html

2. **Configure custom domain** (if you have one):
   - Add your domain to the CloudFront distribution
   - Create SSL certificate in AWS Certificate Manager
   - Update DNS records to point to CloudFront

## Customization

### Colors and Branding

The website uses CSS custom properties for easy customization. Main colors are defined in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #fbbf24;
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --text-dark: #1f2937;
    --text-light: #6b7280;
}
```

### Content Updates

- **Company Information**: Update contact details, phone numbers, and email addresses in `index.html`
- **Services**: Modify service descriptions and features in the services section
- **About Section**: Update company description and expertise tags
- **Social Links**: Replace placeholder social media links with actual URLs

### Form Handling

The contact form currently shows a success message. To handle actual form submissions:

1. **Backend Integration**: Replace the form submission logic in `script.js` with actual API calls
2. **Email Service**: Integrate with services like AWS SES, SendGrid, or Formspree
3. **Validation**: Add server-side validation for security

## Performance Optimization

The website is already optimized for performance:

- **Minimal Dependencies**: Only uses essential external resources
- **Optimized Images**: Uses Font Awesome icons instead of images where possible
- **Efficient CSS**: Uses modern CSS features for better performance
- **Lazy Loading**: Animations are triggered only when elements come into view

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is created for GarberOps consulting services. All rights reserved.

## Support

For questions or issues with the website, contact the development team or refer to the deployment documentation.

---

**GarberOps** - Professional cloud consulting services for modern businesses.
