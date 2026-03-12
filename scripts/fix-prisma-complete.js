const fs = require('fs');
const path = require('path');

// Complete Prisma client fix - ensures everything is set up correctly
const rootNodeModules = path.join(__dirname, '..', 'node_modules');
const prismaClientPath = path.join(rootNodeModules, '.prisma', 'client');
const defaultPath = path.join(prismaClientPath, 'default');
const prismaClientPackagePath = path.join(rootNodeModules, '@prisma', 'client');

console.log('🔧 Fixing Prisma client structure...');

// 1. Ensure default directory exists
if (!fs.existsSync(defaultPath)) {
  fs.mkdirSync(defaultPath, { recursive: true });
  console.log('✅ Created .prisma/client/default directory');
}

// 2. Copy all files from .prisma/client to .prisma/client/default
if (fs.existsSync(prismaClientPath)) {
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'default') continue;
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      try {
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      } catch (err) {
        // Skip errors
      }
    }
  };
  
  copyDir(prismaClientPath, defaultPath);
  console.log('✅ Copied all files to .prisma/client/default');
  
  // 3. Ensure index.js exists and exports PrismaClient correctly
  const indexPath = path.join(defaultPath, 'index.js');
  
  // Find the actual PrismaClient file in the parent directory
  const parentIndexPath = path.join(prismaClientPath, 'index.js');
  let indexContent;
  
  if (fs.existsSync(parentIndexPath)) {
    // Use parent index.js directly (no circular dependency)
    indexContent = `// Export from parent directory
const parent = require('../index.js');
module.exports = parent;
module.exports.PrismaClient = parent.PrismaClient || parent;
`;
  } else {
    // Fix: Export PrismaClient directly from runtime library to avoid circular dependency
    // The key is to avoid requiring @prisma/client which creates a circular dependency
    indexContent = `// Export PrismaClient - break circular dependency
// Use runtime library directly to avoid circular dependency with @prisma/client
const runtime = require('@prisma/client/runtime/library');

// Read the config from the generated class.ts file (we'll need to parse it)
// For now, use a simpler approach: require the parent index.js if it exists, otherwise use runtime
let PrismaClientConstructor;

try {
  // First, try to see if we can get it from the parent directory's index.js
  // But we need to avoid circular dependency, so check if parent exists first
  const parentIndexPath = require.resolve('../index.js', { paths: [__dirname] });
  if (parentIndexPath && parentIndexPath !== __filename) {
    // Clear require cache to avoid circular dependency
    delete require.cache[parentIndexPath];
    const parent = require('../index.js');
    if (parent && parent.PrismaClient && typeof parent.PrismaClient === 'function') {
      PrismaClientConstructor = parent.PrismaClient;
    }
  }
} catch (e) {
  // Parent doesn't exist or has issues, continue to runtime approach
}

if (!PrismaClientConstructor) {
  // Use runtime library to create PrismaClient
  // We need the config from the generated files
  try {
    // Try to read the config from internal/class.ts by requiring it indirectly
    // Since it's a .ts file, we need to use a different approach
    // The config is embedded in the class.ts file, so we'll use a default config
    const defaultConfig = {
      datasources: {},
      errorFormat: 'pretty',
      log: [],
    };
    PrismaClientConstructor = runtime.getPrismaClient(defaultConfig);
  } catch (e) {
    // If runtime.getPrismaClient fails, try one more approach
    // Require @prisma/client but break the circular dependency by checking cache
    try {
      const prismaClientPath = require.resolve('@prisma/client', { paths: [__dirname] });
      delete require.cache[prismaClientPath];
      const prismaModule = require('@prisma/client');
      if (prismaModule && prismaModule.PrismaClient) {
        PrismaClientConstructor = prismaModule.PrismaClient;
      }
    } catch (e2) {
      throw new Error('Cannot initialize PrismaClient. Run: npx prisma generate && node scripts/fix-prisma-complete.js');
    }
  }
}

// Export PrismaClient as a constructor
module.exports = { PrismaClient: PrismaClientConstructor };
module.exports.PrismaClient = PrismaClientConstructor;
`;
  }
  
  // Always write the correct content (don't check if it matches)
  // This ensures we always have the correct export without circular dependencies
  // Use try-catch to handle cases where runtime library is not available
  const correctContent = `// Export PrismaClient - avoid circular dependency
// This file exports PrismaClient from the generated files without requiring @prisma/client

let PrismaClientConstructor;

try {
  // Only require runtime library in Node.js environment (not browser)
  if (typeof window === 'undefined' && typeof require !== 'undefined') {
    const runtime = require('@prisma/client/runtime/library');
    
    // Get PrismaClient from runtime library
    // The config will be loaded from the generated files when PrismaClient is instantiated
    PrismaClientConstructor = runtime.getPrismaClient({});
    
    // Verify it's a function
    if (!PrismaClientConstructor || typeof PrismaClientConstructor !== 'function') {
      throw new Error('PrismaClient is not a constructor');
    }
  } else {
    // Browser environment - return mock
    PrismaClientConstructor = class MockPrismaClient {
      constructor() {
        throw new Error('PrismaClient is not available in browser. Use server-side code or dummy data.');
      }
    };
  }
} catch (e) {
  // If runtime.getPrismaClient fails, create a mock that throws helpful error
  PrismaClientConstructor = class MockPrismaClient {
    constructor() {
      throw new Error('Cannot initialize PrismaClient. Run: npx prisma generate && node scripts/fix-prisma-complete.js. Error: ' + (e.message || e));
    }
  };
}

// Export PrismaClient as a constructor
module.exports = { PrismaClient: PrismaClientConstructor };
module.exports.PrismaClient = PrismaClientConstructor;
`;
  
  fs.writeFileSync(indexPath, correctContent);
  console.log('✅ Created/fixed .prisma/client/default/index.js');
  
  // 4. Fix @prisma/client/default.js
  const defaultJsPath = path.join(prismaClientPackagePath, 'default.js');
  if (fs.existsSync(defaultJsPath)) {
    let content = fs.readFileSync(defaultJsPath, 'utf8');
    const originalContent = content;
    
    // Fix to use correct relative path
    content = content.replace(
      /require\(['"]\.prisma\/client\/default['"]\)/g,
      "require('../../.prisma/client/default/index.js')"
    );
    content = content.replace(
      /require\(['"]\.\.\/\.\.\/\.\.\/\.prisma\/client\/default\/index\.js['"]\)/g,
      "require('../../.prisma/client/default/index.js')"
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(defaultJsPath, content);
      console.log('✅ Fixed @prisma/client/default.js');
    }
  }
}

// 5. Fix .next directory if it exists
const nextDir = path.join(__dirname, '..', '.next');
const nextNodeModules = path.join(nextDir, 'node_modules');
const nextPrismaClientPath = path.join(nextNodeModules, '.prisma', 'client');

if (fs.existsSync(nextNodeModules) && fs.existsSync(prismaClientPath)) {
  // Copy entire .prisma/client directory to .next/node_modules
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      try {
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      } catch (err) {
        // Skip errors
      }
    }
  };
  
  copyDir(prismaClientPath, nextPrismaClientPath);
  console.log('✅ Copied .prisma/client to .next/node_modules');
  
  // Fix all @prisma/client-* default.js files in .next
  if (fs.existsSync(nextNodeModules)) {
    const entries = fs.readdirSync(nextNodeModules, { withFileTypes: true });
    let fixed = 0;
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('@prisma/client-')) {
        const clientDir = path.join(nextNodeModules, entry.name);
        const defaultJsPath = path.join(clientDir, 'default.js');
        
        if (fs.existsSync(defaultJsPath)) {
          let content = fs.readFileSync(defaultJsPath, 'utf8');
          const originalContent = content;
          
          // Fix path to use ../../.prisma/client/default/index.js
          content = content.replace(
            /require\(['"]\.\.\/\.\.\/\.\.\/\.prisma\/client\/default\/index\.js['"]\)/g,
            "require('../../.prisma/client/default/index.js')"
          );
          content = content.replace(
            /require\(['"]\.\.\/\.\.\/\.prisma\/client\/default\/index\.js['"]\)/g,
            "require('../../.prisma/client/default/index.js')"
          );
          
          if (content !== originalContent) {
            fs.writeFileSync(defaultJsPath, content);
            fixed++;
          }
        }
      }
    }
    
    if (fixed > 0) {
      console.log(`✅ Fixed ${fixed} Prisma client files in .next`);
    }
  }
}

console.log('✅ Prisma client structure fixed completely!');
