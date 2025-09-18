-- Blog automation database schema
CREATE DATABASE IF NOT EXISTS blog_automation;
USE blog_automation;

-- Keywords table for storing Ahrefs data
CREATE TABLE IF NOT EXISTS keywords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    keyword VARCHAR(255) NOT NULL UNIQUE,
    search_volume INT NOT NULL,
    keyword_difficulty DECIMAL(5,2) NOT NULL,
    cpc DECIMAL(8,2),
    competition DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    blog_post_id INT NULL,
    INDEX idx_search_volume (search_volume),
    INDEX idx_keyword_difficulty (keyword_difficulty),
    INDEX idx_used (used),
    INDEX idx_created_at (created_at)
);

-- Blog posts table for tracking generated content
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    published_at DATE NOT NULL,
    read_time VARCHAR(20),
    category VARCHAR(100),
    tags JSON,
    cover_image VARCHAR(500),
    author_name VARCHAR(100),
    author_avatar VARCHAR(500),
    seo_meta JSON,
    quality_score INT DEFAULT 0,
    word_count INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_published_at (published_at),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_quality_score (quality_score)
);

-- Content quality metrics table
CREATE TABLE IF NOT EXISTS quality_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blog_post_id INT NOT NULL,
    word_count INT NOT NULL,
    heading_count INT NOT NULL,
    internal_links INT NOT NULL,
    external_links INT NOT NULL,
    image_count INT NOT NULL,
    faq_section BOOLEAN DEFAULT FALSE,
    meta_description_length INT NOT NULL,
    keyword_density DECIMAL(5,2) NOT NULL,
    overall_score INT NOT NULL,
    issues JSON,
    suggestions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    INDEX idx_blog_post_id (blog_post_id),
    INDEX idx_overall_score (overall_score)
);

-- Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action_type ENUM('keyword_fetch', 'blog_generation', 'quality_check', 'publish') NOT NULL,
    status ENUM('success', 'failed', 'partial') NOT NULL,
    message TEXT,
    details JSON,
    execution_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action_type (action_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Content performance tracking
CREATE TABLE IF NOT EXISTS content_performance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blog_post_id INT NOT NULL,
    metric_type ENUM('page_views', 'unique_visitors', 'bounce_rate', 'avg_time_on_page', 'conversion_rate') NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    date_recorded DATE NOT NULL,
    source VARCHAR(100), -- e.g., 'google_analytics', 'manual'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    INDEX idx_blog_post_id (blog_post_id),
    INDEX idx_metric_type (metric_type),
    INDEX idx_date_recorded (date_recorded)
);

-- SEO tracking table
CREATE TABLE IF NOT EXISTS seo_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blog_post_id INT NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    position INT,
    search_volume INT,
    cpc DECIMAL(8,2),
    difficulty DECIMAL(5,2),
    date_tracked DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    INDEX idx_blog_post_id (blog_post_id),
    INDEX idx_keyword (keyword),
    INDEX idx_date_tracked (date_tracked),
    INDEX idx_position (position)
);

-- Content templates table for consistent formatting
CREATE TABLE IF NOT EXISTS content_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    template_structure JSON NOT NULL,
    seo_guidelines JSON,
    quality_requirements JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- Insert default content templates
INSERT INTO content_templates (name, category, template_structure, seo_guidelines, quality_requirements) VALUES
('YouTube Monetization Guide', 'YouTube Monetization', 
 JSON_OBJECT(
   'introduction', 'Hook with problem statement',
   'main_content', 'Step-by-step guide with examples',
   'case_studies', 'Real-world examples',
   'faq', 'Common questions and answers',
   'conclusion', 'Summary and next steps'
 ),
 JSON_OBJECT(
   'min_word_count', 2000,
   'max_word_count', 3000,
   'heading_structure', 'H1, H2, H3 required',
   'internal_links', 3,
   'external_links', 2,
   'images', 1
 ),
 JSON_OBJECT(
   'min_quality_score', 70,
   'required_sections', ['introduction', 'main_content', 'faq'],
   'keyword_density_min', 1.0,
   'keyword_density_max', 3.0
 )
);

-- Create views for analytics
CREATE VIEW blog_analytics AS
SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.published_at,
    bp.quality_score,
    bp.word_count,
    qm.overall_score,
    qm.issues,
    qm.suggestions,
    COUNT(cp.id) as performance_metrics_count
FROM blog_posts bp
LEFT JOIN quality_metrics qm ON bp.id = qm.blog_post_id
LEFT JOIN content_performance cp ON bp.id = cp.blog_post_id
GROUP BY bp.id;

CREATE VIEW keyword_performance AS
SELECT 
    k.keyword,
    k.search_volume,
    k.keyword_difficulty,
    k.used,
    k.used_at,
    bp.title as blog_title,
    bp.slug as blog_slug,
    st.position,
    st.date_tracked
FROM keywords k
LEFT JOIN blog_posts bp ON k.blog_post_id = bp.id
LEFT JOIN seo_tracking st ON bp.id = st.blog_post_id AND k.keyword = st.keyword
ORDER BY k.search_volume DESC;

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetUnusedKeywords(IN limit_count INT)
BEGIN
    SELECT * FROM keywords 
    WHERE used = FALSE 
    ORDER BY search_volume DESC 
    LIMIT limit_count;
END //

CREATE PROCEDURE UpdateKeywordAsUsed(IN keyword_text VARCHAR(255), IN blog_post_id INT)
BEGIN
    UPDATE keywords 
    SET used = TRUE, used_at = NOW(), blog_post_id = blog_post_id 
    WHERE keyword = keyword_text;
END //

CREATE PROCEDURE GetQualityReport(IN days_back INT)
BEGIN
    SELECT 
        bp.title,
        bp.published_at,
        qm.overall_score,
        qm.word_count,
        qm.heading_count,
        qm.internal_links,
        qm.external_links,
        qm.image_count,
        qm.faq_section,
        qm.issues,
        qm.suggestions
    FROM blog_posts bp
    JOIN quality_metrics qm ON bp.id = qm.blog_post_id
    WHERE bp.published_at >= DATE_SUB(CURDATE(), INTERVAL days_back DAY)
    ORDER BY bp.published_at DESC;
END //

DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_keywords_used_search_volume ON keywords(used, search_volume);
CREATE INDEX idx_blog_posts_published_status ON blog_posts(published_at, status);
CREATE INDEX idx_quality_metrics_score_date ON quality_metrics(overall_score, created_at);
CREATE INDEX idx_automation_logs_type_status ON automation_logs(action_type, status);
