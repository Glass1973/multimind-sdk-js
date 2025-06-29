# MultiMind SDK Quick Reference

## 🚀 Quick Commands

```bash
# Check for new Python SDK features
npm run sync-features

# Build and test
npm run build && npm run test

# Run context transfer CLI
npx ts-node example/context-transfer-cli.ts --help
```

## 📋 New Feature Implementation Checklist

### 1. **Detect New Feature**
```bash
npm run sync-features
# Check output for missing modules
```

### 2. **Analyze Python Module**
```bash
# Get module structure
curl -s "https://api.github.com/repos/multimindlab/multimind-sdk/contents/multimind/NEW_MODULE" | jq -r '.[].name'

# Get main file content
curl -s "https://raw.githubusercontent.com/multimindlab/multimind-sdk/develop/multimind/NEW_MODULE/__init__.py"
```

### 3. **Implement in JS SDK**

#### Create Module File
```typescript
// src/NEW_MODULE.ts
import { py } from './bridge/multimind-bridge';

export interface NewModuleConfig {
  // Add config interface
}

export class NewModule {
  constructor(config?: NewModuleConfig) {}
  
  async process(input: any) {
    return await py`NewModuleClass.process(${input})`;
  }
}
```

#### Update Bridge
```typescript
// src/bridge/multimind-bridge.ts
await py.ex`
  from multimind.NEW_MODULE import NewModuleClass
`;
```

#### Update Exports
```typescript
// src/index.ts
export { NewModule } from './NEW_MODULE';
export type { NewModuleConfig } from './NEW_MODULE';

// Add to SDK class
async createNewModule(config?: NewModuleConfig) {
  await this.initialize();
  return new NewModule(config);
}
```

### 4. **Test Implementation**
```bash
npm run build
npm run test
npm run sync-features  # Should show no missing modules
```

## 🔍 Common Patterns

### Bridge Call Pattern
```typescript
// Simple function call
const result = await py`function_name(${param1}, ${param2})`;

// Class instantiation
const instance = await py`ClassName(param1=${param1}, param2=${param2})`;

// Method call
const result = await py`instance.method_name(${param})`;
```

### Error Handling Pattern
```typescript
try {
  const result = await py`PythonFunction(${input})`;
  return result;
} catch (error) {
  console.error('Bridge error:', error);
  throw new Error(`Failed to call Python function: ${error.message}`);
}
```

### Configuration Pattern
```typescript
export interface ModuleConfig {
  option1?: string;
  option2?: number;
  option3?: boolean;
}

export class Module {
  private config: ModuleConfig;
  
  constructor(config: ModuleConfig = {}) {
    this.config = {
      option1: 'default',
      option2: 10,
      option3: true,
      ...config
    };
  }
}
```

## 📁 File Structure Reference

```
src/
├── NEW_MODULE.ts          # Main module implementation
├── bridge/
│   └── multimind-bridge.ts # Python imports
├── index.ts               # Main exports
└── types.ts               # Shared types (if needed)

example/
├── NEW_MODULE-example.ts  # Usage example
└── NEW_MODULE-cli.ts      # CLI interface (if applicable)

docs/
├── MAINTENANCE.md         # Detailed maintenance guide
└── QUICK_REFERENCE.md     # This file
```

## 🐛 Troubleshooting

### Bridge Import Errors
```bash
# Check if Python module exists
curl -s "https://api.github.com/repos/multimindlab/multimind-sdk/contents/multimind" | jq -r '.[].name'

# Check specific module structure
curl -s "https://api.github.com/repos/multimindlab/multimind-sdk/contents/multimind/MODULE_NAME" | jq -r '.[].name'
```

### TypeScript Errors
```bash
# Check compilation
npm run build

# Check specific file
npx tsc --noEmit src/NEW_MODULE.ts
```

### Export Errors
```bash
# Validate all exports
npm run validate-exports
```

## 📊 Monitoring Commands

```bash
# Check feature parity
npm run sync-features

# Get detailed report
cat feature-sync-report.json | jq '.'

# Check specific module
cat feature-sync-report.json | jq '.details.MODULE_NAME'
```

## 🔄 Release Process

```bash
# 1. Ensure all features are synced
npm run sync-features

# 2. Build and test
npm run build && npm run test

# 3. Update version
npm version patch

# 4. Publish
npm publish
```

## 📞 Quick Help

- **New Feature Detected:** Run `npm run sync-features` and follow checklist
- **Bridge Error:** Check Python SDK structure and imports
- **Type Error:** Verify TypeScript interfaces match Python classes
- **Export Error:** Ensure module is exported in `src/index.ts`

## 🎯 Key Files to Remember

- `src/bridge/multimind-bridge.ts` - Python imports
- `src/index.ts` - Main exports
- `scripts/sync-features.js` - Feature detection
- `docs/MAINTENANCE.md` - Detailed guide 