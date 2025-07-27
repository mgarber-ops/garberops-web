// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            filterPosts(selectedCategory);
        });
    });
    
    function filterPosts(category) {
        postCards.forEach(card => {
            const cardCategories = card.getAttribute('data-categories').split(',');
            
            if (category === 'all' || cardCategories.includes(category)) {
                card.classList.remove('filtered');
                card.classList.add('show');
            } else {
                card.classList.add('filtered');
                card.classList.remove('show');
            }
        });
    }
    
    // Load more posts functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more posts
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // Add more posts (this would typically fetch from an API)
                addMorePosts();
                this.innerHTML = 'Load More Posts';
                this.disabled = false;
            }, 1500);
        });
    }
    
    function addMorePosts() {
        const postsGrid = document.getElementById('postsGrid');
        const additionalPosts = [
            {
                title: "Optimizing AWS Costs: A Practical Guide",
                excerpt: "Learn how to identify and eliminate unnecessary AWS spending while maintaining performance and reliability.",
                date: "February 10, 2024",
                readTime: "7 min read",
                category: "AWS",
                tags: ["Cost Optimization", "AWS", "FinOps"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
            },
            {
                title: "Building Resilient Microservices with Docker",
                excerpt: "Best practices for designing and deploying microservices that can handle failures gracefully.",
                date: "February 5, 2024",
                readTime: "9 min read",
                category: "DevOps",
                tags: ["Docker", "Microservices", "Resilience"],
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop"
            },
            {
                title: "Implementing Zero Trust Security Architecture",
                excerpt: "A comprehensive approach to implementing zero trust principles in cloud environments.",
                date: "January 30, 2024",
                readTime: "12 min read",
                category: "Security",
                tags: ["Zero Trust", "Security", "IAM"],
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
            }
        ];
        
        additionalPosts.forEach(post => {
            const postElement = createPostElement(post);
            postsGrid.appendChild(postElement);
        });
        
        // Re-apply current filter
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterPosts(activeCategory);
    }
    
    function createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.setAttribute('data-categories', post.category.toLowerCase());
        
        article.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
                <div class="post-categories">
                    <span class="category">${post.category}</span>
                </div>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="read-time">${post.readTime}</span>
                </div>
                <h3><a href="posts/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html">${post.title}</a></h3>
                <p>${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        return article;
    }
    
    // Newsletter signup
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for subscribing! You\'ll receive our latest insights soon.', 'success');
                this.reset();
                submitBtn.innerHTML = 'Subscribe';
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Search functionality (if needed)
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                searchPosts(searchTerm);
            });
        }
    }
    
    function searchPosts(term) {
        postCards.forEach(card => {
            const title = card.querySelector('h2 a, h3 a').textContent.toLowerCase();
            const excerpt = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(term) || 
                           excerpt.includes(term) || 
                           tags.some(tag => tag.includes(term));
            
            if (matches || term === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Initialize search if search input exists
    initializeSearch();
    
    // Reading time estimation
    function estimateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }
    
    // Add reading progress indicator for blog posts
    function addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // Initialize reading progress
    addReadingProgress();
    
    // Lazy loading for images
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Share functionality
    function initializeShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const url = window.location.href;
                const title = document.title;
                
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        url: url
                    });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(url).then(() => {
                        showNotification('Link copied to clipboard!', 'success');
                    });
                }
            });
        });
    }
    
    // Initialize share buttons if they exist
    initializeShareButtons();
});

// Enhanced notification system for blog
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
} 