import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, 'node_modules/genlayer-js/dist/types/index.js');

try {
  let content = readFileSync(filePath, 'utf8');
  
  console.log('📝 Original content:');
  console.log(content);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Remove the Account import line
  content = content.replace(/import { Account } from "viem";\n?/g, '// Account import removed - not used in runtime\n');
  
  // Remove Account from exports
  content = content.replace(/export {\n\s*Account,\n\s*TransactionStatus\n};/g, 
    'export {\n  TransactionStatus\n};');
  
  writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Fixed! New content:');
  console.log(content);
  console.log('\n✨ genlayer-js has been patched successfully!');
  console.log('🚀 You can now run: npm run dev');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}