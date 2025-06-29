#!/usr/bin/env node

/**
 * Fix Example Imports Script
 * 
 * This script rewrites import paths in compiled JavaScript example files
 * from '../src/index' to '../index.js' for proper runtime resolution.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

async function fixExampleImports() {
  const exampleDir = path.join(process.cwd(), 'dist', 'example');
  
  try {
    // Check if dist/example directory exists
    await fs.access(exampleDir);
  } catch (error) {
    console.log('❌ dist/example directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  const jsFiles = [
    'comprehensive-demo.js',
    'advanced-usage.js', 
    'run-agent.js',
    'context-transfer-cli.js'
  ];

  let fixedCount = 0;

  for (const fileName of jsFiles) {
    const filePath = path.join(exampleDir, fileName);
    
    try {
      // Read the file
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Replace import paths
      const originalContent = content;
      content = content.replace(
        /from ['"]\.\.\/src\/index['"]/g,
        "from '../index.js'"
      );
      
      // Write back if changed
      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Fixed imports in ${fileName}`);
        fixedCount++;
      } else {
        console.log(`ℹ️  No changes needed in ${fileName}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not process ${fileName}:`, error.message);
    }
  }

  console.log(`\n🎉 Fixed imports in ${fixedCount} files`);
  console.log('📁 Example files are ready to run from dist/example/');
}

// Run the script
fixExampleImports().catch(console.error); 