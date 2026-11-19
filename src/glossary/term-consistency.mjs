/**
 * Domain Glossary Consistency Auditor
 * Enforces strict terminology constraints across technical B2B translations.
 */
export function auditGlossary(sourceText, targetText, glossaryMap = {}) {
  const issues = [];

  for (const [term, expectedTarget] of Object.entries(glossaryMap)) {
    const termRegex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
    if (termRegex.test(sourceText)) {
      // If term is in source, check whether expected term is in target
      const expectedRegex = new RegExp(`\\b${escapeRegExp(expectedTarget)}\\b`, 'i');
      if (!expectedRegex.test(targetText)) {
        issues.push({
          type: 'glossary_mismatch',
          sourceTerm: term,
          expectedTerm: expectedTarget,
          message: `Source contains technical term "${term}", but translation lacks required terminology "${expectedTarget}".`
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
