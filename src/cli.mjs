import fs from 'node:fs';
import process from 'node:process';
import { calibrateTranslation } from './index.mjs';

export async function runCli(argv) {
  const args = argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'verify-json': {
      const sourceFile = args[1];
      const targetFile = args[2];

      if (!sourceFile || !targetFile) {
        console.error('Usage: agentic-i18n verify-json <source.json> <target.json>');
        process.exit(1);
      }

      if (!fs.existsSync(sourceFile) || !fs.existsSync(targetFile)) {
        console.error('Error: Source or target file does not exist.');
        process.exit(1);
      }

      try {
        const srcData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
        const tgtData = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));

        console.log(`Auditing translations: ${sourceFile} -> ${targetFile}`);

        let totalKeys = 0;
        let failedKeys = 0;

        for (const [key, srcVal] of Object.entries(srcData)) {
          totalKeys++;
          const tgtVal = tgtData[key];
          if (typeof srcVal === 'string' && typeof tgtVal === 'string') {
            const report = calibrateTranslation(srcVal, tgtVal);
            if (!report.compliant) {
              failedKeys++;
              console.log(`\n[I18N ERROR] Key: "${key}"`);
              report.issues.forEach(i => console.log(`  - ${i.message}`));
            }
          }
        }

        console.log(`\nAudit complete: ${totalKeys} checked, ${failedKeys} issue(s) detected.`);
        process.exit(failedKeys === 0 ? 0 : 1);
      } catch (err) {
        console.error('File parsing failed:', err.message);
        process.exit(1);
      }
      break;
    }

    case 'help':
    default: {
      console.log(`
agentic-i18n-core - Precision Calibration Engine for AI Translation Agents

Usage:
  agentic-i18n verify-json <source.json> <target.json>   Audit i18n JSON files
  agentic-i18n help                                     Display this guidance
      `.trim());
      process.exit(0);
    }
  }
}
