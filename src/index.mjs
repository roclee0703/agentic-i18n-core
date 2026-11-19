import { validatePlaceholders } from './validators/placeholder-integrity.mjs';
import { validateTags } from './validators/tag-preservation.mjs';
import { auditGlossary } from './glossary/term-consistency.mjs';

export { validatePlaceholders, validateTags, auditGlossary };

export function calibrateTranslation(sourceText, targetText, options = {}) {
  const { glossary = {} } = options;

  const placeholderResult = validatePlaceholders(sourceText, targetText);
  const tagResult = validateTags(sourceText, targetText);
  const glossaryResult = auditGlossary(sourceText, targetText, glossary);

  const allIssues = [
    ...placeholderResult.issues,
    ...tagResult.issues,
    ...glossaryResult.issues
  ];

  return {
    compliant: allIssues.length === 0,
    issueCount: allIssues.length,
    issues: allIssues,
    details: {
      placeholders: placeholderResult,
      tags: tagResult,
      glossary: glossaryResult
    }
  };
}
