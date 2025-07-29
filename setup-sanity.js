#!/usr/bin/env node

/**
 * Sanity Setup Script
 * 
 * This script helps set up your Sanity CMS with initial data and configuration.
 * Run this script after setting up your Sanity project.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Sanity CMS for your portfolio...\n');

// Check if sanity.config.ts exists
const sanityConfigPath = path.join(__dirname, 'sanity.config.ts');
if (!fs.existsSync(sanityConfigPath)) {
  console.error('❌ sanity.config.ts not found. Please make sure you have Sanity configured.');
  process.exit(1);
}

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local not found. Creating template...');
  
  const envTemplate = `# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"

# Contact Form (Optional)
NEXT_PUBLIC_FORM="your-formspree-form-id"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"

# NextAuth (Optional)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template. Please fill in your Sanity project details.');
  console.log('   You can find your project ID at https://sanity.io/manage\n');
}

// Instructions for manual setup
console.log('📋 Manual Setup Steps:');
console.log('');
console.log('1. Update your .env.local file with your Sanity project details:');
console.log('   - NEXT_PUBLIC_SANITY_PROJECT_ID (from sanity.io/manage)');
console.log('   - NEXT_PUBLIC_SANITY_DATASET (usually "production")');
console.log('');
console.log('2. Start the Sanity Studio:');
console.log('   npm run dev');
console.log('   Then go to http://localhost:3000/studio');
console.log('');
console.log('3. Add some sample content:');
console.log('   - Create tags (React, TypeScript, Next.js, etc.)');
console.log('   - Add skills for different categories');
console.log('   - Create projects with images and descriptions');
console.log('   - Fill in about and contact information');
console.log('');
console.log('4. Optional: Import sample data');
console.log('   - Uncomment the last line in sanity/sample-data.ts');
console.log('   - Run: node -r ts-node/register sanity/sample-data.ts');
console.log('');
console.log('🎉 Your portfolio is ready to go!');
console.log('');
console.log('📖 Useful links:');
console.log('   - Sanity Studio: http://localhost:3000/studio');
console.log('   - Portfolio: http://localhost:3000');
console.log('   - Sanity Docs: https://www.sanity.io/docs');
