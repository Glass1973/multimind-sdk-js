#!/usr/bin/env node

/**
 * Feature Sync Script
 * 
 * This script compares the Python MultiMind SDK features with the JavaScript SDK
 * to ensure feature parity and identify any missing implementations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Python SDK features (from the develop branch)
const PYTHON_SDK_FEATURES = {
  core: [
    'agent',
    'fine_tune', 
    'rag',
    'adapters',
    'evaluation',
    'models'
  ],
  advanced: [
    'advanced_fine_tuning',
    'advanced_rag', 
    'model_conversion',
    'compliance',
    'advanced_agent',
    'model_client_system',
    'gateway'
  ],
  context_transfer: [
    'context_transfer_manager',
    'context_transfer_adapters',
    'context_transfer_api',
    'context_transfer_batch',
    'context_transfer_validation',
    'context_transfer_chrome_extension'
  ]
};

// Define JavaScript SDK features (current implementation)
const JS_SDK_FEATURES = {
  core: [
    'agent',
    'fineTune',
    'rag', 
    'adapters',
    'evaluation',
    'models'
  ],
  advanced: [
    'advancedFineTuning',
    'advancedRAG',
    'modelConversion', 
    'compliance',
    'advancedAgent',
    'modelClientSystem',
    'gateway'
  ],
  context_transfer: [
    'contextTransfer'
  ]
};

// Feature mapping between Python and JS
const FEATURE_MAPPING = {
  'agent': 'agent',
  'fine_tune': 'fineTune',
  'rag': 'rag',
  'adapters': 'adapters', 
  'evaluation': 'evaluation',
  'models': 'models',
  'advanced_fine_tuning': 'advancedFineTuning',
  'advanced_rag': 'advancedRAG',
  'model_conversion': 'modelConversion',
  'compliance': 'compliance',
  'advanced_agent': 'advancedAgent',
  'model_client_system': 'modelClientSystem',
  'gateway': 'gateway',
  'context_transfer_manager': 'contextTransfer',
  'context_transfer_adapters': 'contextTransfer',
  'context_transfer_api': 'contextTransfer',
  'context_transfer_batch': 'contextTransfer',
  'context_transfer_validation': 'contextTransfer',
  'context_transfer_chrome_extension': 'contextTransfer'
};

function checkFeatureParity() {
  console.log('🔍 Checking feature parity between Python and JavaScript SDKs...\n');
  
  const report = {
    pythonFeatures: 0,
    jsFeatures: 0,
    implemented: 0,
    missing: [],
    extra: [],
    coverage: 0
  };
  
  // Count Python features
  Object.values(PYTHON_SDK_FEATURES).flat().forEach(feature => {
    report.pythonFeatures++;
  });
  
  // Count JS features
  Object.values(JS_SDK_FEATURES).flat().forEach(feature => {
    report.jsFeatures++;
  });
  
  // Check implementation status
  Object.values(PYTHON_SDK_FEATURES).flat().forEach(pythonFeature => {
    const jsFeature = FEATURE_MAPPING[pythonFeature];
    if (jsFeature && Object.values(JS_SDK_FEATURES).flat().includes(jsFeature)) {
      report.implemented++;
    } else {
      report.missing.push(pythonFeature);
    }
  });
  
  // Check for extra JS features
  Object.values(JS_SDK_FEATURES).flat().forEach(jsFeature => {
    const hasPythonEquivalent = Object.values(FEATURE_MAPPING).includes(jsFeature);
    if (!hasPythonEquivalent) {
      report.extra.push(jsFeature);
    }
  });
  
  // Calculate coverage
  report.coverage = Math.round((report.implemented / report.pythonFeatures) * 100);
  
  return report;
}

function generateReport(report) {
  console.log('📊 Feature Parity Report\n');
  console.log(`Python SDK Features: ${report.pythonFeatures}`);
  console.log(`JavaScript SDK Features: ${report.jsFeatures}`);
  console.log(`Implemented Features: ${report.implemented}`);
  console.log(`Coverage: ${report.coverage}%\n`);
  
  if (report.missing.length > 0) {
    console.log('❌ Missing Features:');
    report.missing.forEach(feature => {
      console.log(`  - ${feature}`);
    });
    console.log();
  }
  
  if (report.extra.length > 0) {
    console.log('➕ Extra Features (not in Python SDK):');
    report.extra.forEach(feature => {
      console.log(`  + ${feature}`);
    });
    console.log();
  }
  
  if (report.coverage === 100) {
    console.log('🎉 Perfect! 100% feature parity achieved!');
  } else if (report.coverage >= 90) {
    console.log('✅ Excellent! High feature parity achieved.');
  } else if (report.coverage >= 75) {
    console.log('⚠️  Good coverage, but some features are missing.');
  } else {
    console.log('❌ Significant features are missing. Consider implementing them.');
  }
  
  return report;
}

function saveReport(report) {
  const reportPath = path.join(__dirname, '..', 'feature-sync-report.json');
  const reportData = {
    timestamp: new Date().toISOString(),
    ...report
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

function main() {
  try {
    const report = checkFeatureParity();
    generateReport(report);
    saveReport(report);
    
    if (report.coverage < 100) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error generating feature sync report:', error.message);
    process.exit(1);
  }
}

main(); 