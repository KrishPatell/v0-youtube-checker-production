#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Quality metrics
const qualityMetrics = {
  wordCount: { min: 2000, max: 3000, weight: 0.2 },
  headingStructure: { min: 3, weight: 0.15 },
  internalLinks: { min: 3, weight: 0.15 },
  externalLinks: { min: 2, weight: 0.1 },
  images: { min: 1, weight: 0.1 },
  faqSection: { weight: 0.1 },
  metaDescription: { min: 150, max: 160, weight: 0.1 },
  keywordDensity: { min: 1, max: 3, weight: 0.1 }
};

// Analyze content quality
function analyzeContent(blogPost) {
  const analysis = {
    wordCount: 0,
    headingStructure: { h1: 0, h2: 0, h3: 0 },
    internalLinks: 0,
    externalLinks: 0,
    images: 0,
    faqSection: false,
    metaDescription: blogPost.excerpt?.length || 0,
    keywordDensity: 0,
    score: 0,
    issues: [],
    suggestions: []
  };

  // Word count
  analysis.wordCount = blogPost.content.split(/\s+/).length;

  // Heading structure
  const h1Matches = blogPost.content.match(/^#\s/gm) || [];
  const h2Matches = blogPost.content.match(/^##\s/gm) || [];
  const h3Matches = blogPost.content.match(/^###\s/gm) || [];
  
  analysis.headingStructure = {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length
  };

  // Internal links (look for relative URLs or specific patterns)
  const internalLinkPattern = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  const internalMatches = blogPost.content.match(internalLinkPattern) || [];
  analysis.internalLinks = internalMatches.length;

  // External links (look for http/https URLs)
  const externalLinkPattern = /\[([^\]]+)\]\(https?:\/\/[^)]+\)/g;
  const externalMatches = blogPost.content.match(externalLinkPattern) || [];
  analysis.externalLinks = externalMatches.length;

  // Images (look for image markdown or img tags)
  const imagePattern = /!\[([^\]]*)\]\([^)]+\)|<img[^>]+>/g;
  const imageMatches = blogPost.content.match(imagePattern) || [];
  analysis.images = imageMatches.length;

  // FAQ section (look for FAQ, Q&A, or question patterns)
  const faqPattern = /(FAQ|Q&A|Frequently Asked Questions|Questions and Answers)/i;
  analysis.faqSection = faqPattern.test(blogPost.content);

  // Keyword density (basic analysis)
  const focusKeyword = blogPost.seo_meta?.focus_keyword || '';
  if (focusKeyword) {
    const keywordMatches = blogPost.content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || [];
    analysis.keywordDensity = (keywordMatches.length / analysis.wordCount) * 100;
  }

  return analysis;
}

// Calculate quality score
function calculateQualityScore(analysis) {
  let score = 0;
  const maxScore = 100;

  // Word count score
  if (analysis.wordCount >= qualityMetrics.wordCount.min && analysis.wordCount <= qualityMetrics.wordCount.max) {
    score += qualityMetrics.wordCount.weight * 100;
  } else if (analysis.wordCount < qualityMetrics.wordCount.min) {
    score += (analysis.wordCount / qualityMetrics.wordCount.min) * qualityMetrics.wordCount.weight * 100;
    analysis.issues.push(`Content is too short (${analysis.wordCount} words, minimum ${qualityMetrics.wordCount.min})`);
  } else {
    score += qualityMetrics.wordCount.weight * 100;
    analysis.suggestions.push(`Consider breaking this into multiple posts (${analysis.wordCount} words)`);
  }

  // Heading structure score
  const totalHeadings = analysis.headingStructure.h1 + analysis.headingStructure.h2 + analysis.headingStructure.h3;
  if (totalHeadings >= qualityMetrics.headingStructure.min) {
    score += qualityMetrics.headingStructure.weight * 100;
  } else {
    score += (totalHeadings / qualityMetrics.headingStructure.min) * qualityMetrics.headingStructure.weight * 100;
    analysis.issues.push(`Insufficient heading structure (${totalHeadings} headings, minimum ${qualityMetrics.headingStructure.min})`);
  }

  // Internal links score
  if (analysis.internalLinks >= qualityMetrics.internalLinks.min) {
    score += qualityMetrics.internalLinks.weight * 100;
  } else {
    score += (analysis.internalLinks / qualityMetrics.internalLinks.min) * qualityMetrics.internalLinks.weight * 100;
    analysis.issues.push(`Need more internal links (${analysis.internalLinks}, minimum ${qualityMetrics.internalLinks.min})`);
  }

  // External links score
  if (analysis.externalLinks >= qualityMetrics.externalLinks.min) {
    score += qualityMetrics.externalLinks.weight * 100;
  } else {
    score += (analysis.externalLinks / qualityMetrics.externalLinks.min) * qualityMetrics.externalLinks.weight * 100;
    analysis.issues.push(`Need more external links (${analysis.externalLinks}, minimum ${qualityMetrics.externalLinks.min})`);
  }

  // Images score
  if (analysis.images >= qualityMetrics.images.min) {
    score += qualityMetrics.images.weight * 100;
  } else {
    score += (analysis.images / qualityMetrics.images.min) * qualityMetrics.images.weight * 100;
    analysis.issues.push(`Need more images (${analysis.images}, minimum ${qualityMetrics.images.min})`);
  }

  // FAQ section score
  if (analysis.faqSection) {
    score += qualityMetrics.faqSection.weight * 100;
  } else {
    analysis.suggestions.push('Consider adding an FAQ section to improve user engagement');
  }

  // Meta description score
  if (analysis.metaDescription >= qualityMetrics.metaDescription.min && analysis.metaDescription <= qualityMetrics.metaDescription.max) {
    score += qualityMetrics.metaDescription.weight * 100;
  } else {
    score += qualityMetrics.metaDescription.weight * 50; // Partial score
    analysis.issues.push(`Meta description length is ${analysis.metaDescription} chars (optimal: ${qualityMetrics.metaDescription.min}-${qualityMetrics.metaDescription.max})`);
  }

  // Keyword density score
  if (analysis.keywordDensity >= qualityMetrics.keywordDensity.min && analysis.keywordDensity <= qualityMetrics.keywordDensity.max) {
    score += qualityMetrics.keywordDensity.weight * 100;
  } else if (analysis.keywordDensity < qualityMetrics.keywordDensity.min) {
    score += (analysis.keywordDensity / qualityMetrics.keywordDensity.min) * qualityMetrics.keywordDensity.weight * 100;
    analysis.issues.push(`Keyword density too low (${analysis.keywordDensity.toFixed(2)}%, minimum ${qualityMetrics.keywordDensity.min}%)`);
  } else {
    score += qualityMetrics.keywordDensity.weight * 50; // Partial score for over-optimization
    analysis.suggestions.push(`Keyword density might be too high (${analysis.keywordDensity.toFixed(2)}%, maximum ${qualityMetrics.keywordDensity.max}%)`);
  }

  analysis.score = Math.round(score);
  return analysis;
}

// Generate quality report
function generateQualityReport(analyses) {
  const report = {
    timestamp: new Date().toISOString(),
    totalPosts: analyses.length,
    averageScore: 0,
    posts: analyses,
    summary: {
      excellent: 0, // 90-100
      good: 0,     // 70-89
      fair: 0,     // 50-69
      poor: 0      // 0-49
    },
    commonIssues: {},
    recommendations: []
  };

  // Calculate summary statistics
  let totalScore = 0;
  analyses.forEach(analysis => {
    totalScore += analysis.score;
    
    if (analysis.score >= 90) report.summary.excellent++;
    else if (analysis.score >= 70) report.summary.good++;
    else if (analysis.score >= 50) report.summary.fair++;
    else report.summary.poor++;
  });

  report.averageScore = Math.round(totalScore / analyses.length);

  // Identify common issues
  const allIssues = analyses.flatMap(a => a.issues);
  allIssues.forEach(issue => {
    report.commonIssues[issue] = (report.commonIssues[issue] || 0) + 1;
  });

  // Generate recommendations
  if (report.averageScore < 70) {
    report.recommendations.push('Overall content quality needs improvement. Focus on the most common issues.');
  }
  
  if (report.commonIssues['Content is too short']) {
    report.recommendations.push('Increase content length to meet minimum word count requirements.');
  }
  
  if (report.commonIssues['Insufficient heading structure']) {
    report.recommendations.push('Improve heading structure with more H2 and H3 tags for better readability.');
  }
  
  if (report.commonIssues['Need more internal links']) {
    report.recommendations.push('Add more internal links to improve site structure and user engagement.');
  }

  return report;
}

// Load and analyze recent blog posts
async function analyzeRecentPosts() {
  try {
    const blogDataFile = path.join(process.cwd(), 'lib', 'blog-data.ts');
    const data = await fs.readFile(blogDataFile, 'utf8');
    
    // Extract blog posts from the TypeScript file
    const blogPostsMatch = data.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\]/);
    if (!blogPostsMatch) {
      throw new Error('Could not find blogPosts in blog-data.ts');
    }
    
    // This is a simplified extraction - in a real implementation, you'd use a proper parser
    const posts = [];
    const postMatches = blogPostsMatch[1].match(/\{[^}]*id:\s*(\d+)[^}]*\}/g);
    
    if (postMatches) {
      for (const postMatch of postMatches.slice(-5)) { // Analyze last 5 posts
        // Extract basic post data (simplified)
        const idMatch = postMatch.match(/id:\s*(\d+)/);
        const titleMatch = postMatch.match(/title:\s*"([^"]+)"/);
        const contentMatch = postMatch.match(/content:\s*`([^`]+)`/);
        const excerptMatch = postMatch.match(/excerpt:\s*"([^"]+)"/);
        
        if (idMatch && titleMatch && contentMatch) {
          posts.push({
            id: parseInt(idMatch[1]),
            title: titleMatch[1],
            content: contentMatch[1],
            excerpt: excerptMatch ? excerptMatch[1] : '',
            seo_meta: { focus_keyword: 'youtube monetization' } // Default
          });
        }
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error loading blog posts:', error.message);
    return [];
  }
}

// Main execution
async function main() {
  try {
    console.log('🔍 Starting content quality analysis...');
    
    const posts = await analyzeRecentPosts();
    if (posts.length === 0) {
      console.log('❌ No blog posts found to analyze');
      return;
    }
    
    console.log(`📊 Analyzing ${posts.length} recent blog posts...`);
    
    const analyses = [];
    for (const post of posts) {
      const analysis = analyzeContent(post);
      const scoredAnalysis = calculateQualityScore(analysis);
      analyses.push(scoredAnalysis);
      
      console.log(`📝 ${post.title}: ${scoredAnalysis.score}/100`);
      if (scoredAnalysis.issues.length > 0) {
        console.log(`   Issues: ${scoredAnalysis.issues.join(', ')}`);
      }
    }
    
    // Generate quality report
    const report = generateQualityReport(analyses);
    
    // Save report
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const reportFile = path.join(reportsDir, 'quality-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    console.log('✅ Quality analysis completed!');
    console.log(`📊 Average score: ${report.averageScore}/100`);
    console.log(`📈 Score distribution:`);
    console.log(`   Excellent (90-100): ${report.summary.excellent}`);
    console.log(`   Good (70-89): ${report.summary.good}`);
    console.log(`   Fair (50-69): ${report.summary.fair}`);
    console.log(`   Poor (0-49): ${report.summary.poor}`);
    
    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
    
    console.log(`📄 Full report saved to: ${reportFile}`);
    
  } catch (error) {
    console.error('❌ Error during quality analysis:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeContent, calculateQualityScore, generateQualityReport };
