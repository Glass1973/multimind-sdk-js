#!/usr/bin/env node

/**
 * Fix All Imports Script
 * 
 * This script rewrites all import paths in compiled JavaScript files
 * to include .js extensions for ES module compatibility.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

async function fixAllImports() {
  const distDir = path.join(process.cwd(), 'dist');
  
  try {
    // Check if dist directory exists
    await fs.access(distDir);
  } catch (error) {
    console.log('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  let totalFixed = 0;

  // Recursively find all .js files in dist
  async function processDirectory(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.name.endsWith('.js')) {
        try {
          // Read the file
          let content = await fs.readFile(fullPath, 'utf-8');
          const originalContent = content;
          
          // Fix relative imports to include .js extension
          content = content.replace(
            /from ['"](\.[^'"]*)['"]/g,
            (match, importPath) => {
              // Skip if already has .js extension or is a package import
              if (importPath.endsWith('.js') || !importPath.startsWith('.')) {
                return match;
              }
              return `from '${importPath}.js'`;
            }
          );
          
          // Fix specific bridge import
          content = content.replace(
            /from ['"]\.\/bridge\/multimind-bridge['"]/g,
            "from './bridge/multimind-bridge.js'"
          );
          
          // Fix python-bridge import for CommonJS compatibility
          content = content.replace(
            /import \{ pythonBridge \} from ['"]python-bridge['"];?/g,
            `import pkg from 'python-bridge';
const { pythonBridge } = pkg;`
          );
          
          // Write back if changed
          if (content !== originalContent) {
            await fs.writeFile(fullPath, content, 'utf-8');
            const relativePath = path.relative(distDir, fullPath);
            console.log(`✅ Fixed imports in ${relativePath}`);
            totalFixed++;
          }
        } catch (error) {
          console.log(`⚠️  Could not process ${fullPath}:`, error.message);
        }
      }
    }
  }

  await processDirectory(distDir);
  
  console.log(`\n🎉 Fixed imports in ${totalFixed} files`);
  console.log('📁 All compiled files are ready for ES module execution');
}

// Run the script
fixAllImports().catch(console.error); 