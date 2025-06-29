#!/usr/bin/env node

/**
 * MultiMind SDK Feature Sync Script
 * 
 * Compares the Python SDK structure with the JS SDK to identify
 * missing features and provide implementation guidance.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class FeatureSyncChecker {
  constructor() {
    this.pythonSDKRepo = 'multimindlab/multimind-sdk';
    this.jsSDKPath = path.join(__dirname, '..', 'src');
  }

  async fetchPythonSDKStructure() {
    return new Promise((resolve, reject) => {
      const url = `https://api.github.com/repos/${this.pythonSDKRepo}/contents/multimind`;
      
      const options = {
        headers: {
          'User-Agent': 'MultiMind-SDK-Sync/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      };
      
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              console.error(`GitHub API error: ${res.statusCode}`);
              console.error('Response:', data);
              reject(new Error(`GitHub API returned status ${res.statusCode}`));
              return;
            }
            
            const response = JSON.parse(data);
            if (Array.isArray(response)) {
              const modules = response
                .filter(item => item.type === 'dir' && !item.name.includes('__'))
                .map(item => item.name);
              resolve(modules);
            } else {
              reject(new Error('Unexpected response format from GitHub API'));
            }
          } catch (error) {
            console.error('Failed to parse GitHub API response:', error);
            console.error('Raw response:', data.substring(0, 200) + '...');
            reject(error);
          }
        });
      }).on('error', (error) => {
        console.error('Network error:', error);
        reject(error);
      });
    });
  }

  getJSSDKStructure() {
    const modules = [];
    
    function scanDirectory(dirPath, basePath = '') {
      if (!fs.existsSync(dirPath)) {
        return;
      }
      
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.join(basePath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Check if directory contains .ts files
          const hasTsFiles = fs.readdirSync(fullPath).some(file => file.endsWith('.ts'));
          if (hasTsFiles) {
            modules.push(relativePath.replace(/\\/g, '/'));
          }
          scanDirectory(fullPath, relativePath);
        } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
          const moduleName = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/');
          if (!modules.includes(moduleName)) {
            modules.push(moduleName);
          }
        }
      }
    }
    
    scanDirectory(this.jsSDKPath);
    return modules;
  }

  async getModuleDetails(moduleName) {
    return new Promise((resolve) => {
      const url = `https://api.github.com/repos/${this.pythonSDKRepo}/contents/multimind/${moduleName}`;
      
      const options = {
        headers: {
          'User-Agent': 'MultiMind-SDK-Sync/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      };
      
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              if (Array.isArray(response)) {
                const files = response
                  .filter(item => item.type === 'file')
                  .map(item => item.name);
                resolve(files);
              } else {
                resolve([]);
              }
            } else {
              resolve([]); // Module might not exist or be empty
            }
          } catch (error) {
            resolve([]); // Handle parsing errors gracefully
          }
        });
      }).on('error', () => {
        resolve([]); // Handle network errors gracefully
      });
    });
  }

  async generateSyncReport() {
    console.log('🔄 Fetching Python SDK structure...');
    const pythonModules = await this.fetchPythonSDKStructure();
    
    console.log('📁 Scanning JS SDK structure...');
    const jsModules = this.getJSSDKStructure();
    
    console.log('\n📊 Generating comparison report...\n');
    
    // Find missing modules
    const missingInJS = pythonModules.filter(module => !jsModules.includes(module));
    const extraInJS = jsModules.filter(module => !pythonModules.includes(module));
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      pythonModules: pythonModules.length,
      jsModules: jsModules.length,
      missingInJS,
      extraInJS,
      details: {}
    };
    
    // Get details for missing modules
    for (const module of missingInJS) {
      report.details[module] = await this.getModuleDetails(module);
    }
    
    return report;
  }

  printReport(report) {
    console.log('🎯 MultiMind SDK Feature Sync Report');
    console.log('=' .repeat(50));
    console.log(`📅 Generated: ${report.timestamp}`);
    console.log(`🐍 Python SDK modules: ${report.pythonModules}`);
    console.log(`⚡ JS SDK modules: ${report.jsModules}`);
    console.log('');
    
    if (report.missingInJS.length === 0) {
      console.log('✅ All Python SDK modules are implemented in JS SDK!');
    } else {
      console.log('⚠️  Missing modules in JS SDK:');
      console.log('');
      
      for (const module of report.missingInJS) {
        console.log(`📦 ${module}`);
        const files = report.details[module];
        if (files.length > 0) {
          console.log(`   Files: ${files.join(', ')}`);
        }
        console.log('');
      }
      
      console.log('🔧 Implementation Guide:');
      console.log('For each missing module, follow these steps:');
      console.log('');
      console.log('1. Review the Python SDK module structure');
      console.log('2. Create corresponding TypeScript interfaces');
      console.log('3. Implement bridge calls to Python SDK');
      console.log('4. Add to src/index.ts exports');
      console.log('5. Add to src/bridge/multimind-bridge.ts imports');
      console.log('6. Create example usage and tests');
      console.log('7. Update documentation');
      console.log('');
    }
    
    if (report.extraInJS.length > 0) {
      console.log('📝 Extra modules in JS SDK (not in Python):');
      report.extraInJS.forEach(module => {
        console.log(`   - ${module}`);
      });
      console.log('');
    }
    
    // Save detailed report to file
    const reportFile = 'feature-sync-report.json';
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportFile}`);
  }

  async run() {
    try {
      const report = await this.generateSyncReport();
      this.printReport(report);
      
      if (report.missingInJS.length > 0) {
        process.exit(1); // Exit with error if missing modules
      }
    } catch (error) {
      console.error('❌ Error during sync check:', error);
      process.exit(1);
    }
  }
}

// Run the sync checker
if (require.main === module) {
  const checker = new FeatureSyncChecker();
  checker.run();
}

module.exports = FeatureSyncChecker; 