const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
const defaultPath = path.join(prismaClientPath, 'default');
const prismaClientPackagePath = path.join(__dirname, '..', 'node_modules', '@prisma', 'client');

// Create default directory if it doesn't exist
if (!fs.existsSync(defaultPath)) {
  fs.mkdirSync(defaultPath, { recursive: true });
}

// Copy all files from .prisma/client to .prisma/client/default
if (fs.existsSync(prismaClientPath)) {
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'default') continue; // Skip default directory itself
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
  
  // Copy all files and directories
  copyDir(prismaClientPath, defaultPath);
  
  // Create index.js that works for both CommonJS and ESM
  const indexPath = path.join(defaultPath, 'index.js');
  const prismaClientIndexPath = path.join(prismaClientPackagePath, 'index.js');
  
  // Create index.js that re-exports from @prisma/client/index.js
  // This works for both standalone scripts and Next.js builds
  const indexContent = `module.exports = require('../../../@prisma/client/index.js');\n`;
  fs.writeFileSync(indexPath, indexContent);
  
  // Also create index.d.ts
  const indexDtsPath = path.join(defaultPath, 'index.d.ts');
  const prismaClientIndexDtsPath = path.join(prismaClientPackagePath, 'index.d.ts');
  if (fs.existsSync(prismaClientIndexDtsPath)) {
    const indexDtsContent = `export * from '../../../@prisma/client/index.d.ts';\n`;
    fs.writeFileSync(indexDtsPath, indexDtsContent);
  }
  
  // Ensure the parent index.js exists (for Turbopack compatibility)
  const parentIndexPath = path.join(prismaClientPath, 'index.js');
  if (!fs.existsSync(parentIndexPath) && fs.existsSync(prismaClientIndexPath)) {
    // Create a parent index.js that re-exports from @prisma/client
    const parentIndexContent = `module.exports = require('../../@prisma/client/index.js');\n`;
    fs.writeFileSync(parentIndexPath, parentIndexContent);
  }
}

// Also fix @prisma/client/default.js to use correct path
const defaultJsPath = path.join(prismaClientPackagePath, 'default.js');
if (fs.existsSync(defaultJsPath)) {
  let content = fs.readFileSync(defaultJsPath, 'utf8');
  // Update the require path to use the correct relative path
  content = content.replace(
    /require\(['"]\.prisma\/client\/default['"]\)/g,
    "require('../../.prisma/client/default/index.js')"
  );
  fs.writeFileSync(defaultJsPath, content);
}

console.log('✅ Prisma client structure fixed!');
