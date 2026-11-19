/**
 * Placeholder Integrity Validator
 * Checks whether variables, tokens, and format specifiers are preserved accurately
 * between original text and translated output.
 */
export function validatePlaceholders(sourceText, targetText) {
  const issues = [];
  const tokenRegex = /(?:\{\s*[\w.-]+\s*\}|\{\{\s*[\w.-]+\s*\}\}|%[sdbfu]|\$[0-9]+)/g;

  const extractTokens = (str) => {
    const tokens = [];
    let match;
    const re = new RegExp(tokenRegex);
    while ((match = re.exec(str)) !== null) {
      tokens.push(match[0].replace(/\s+/g, ''));
    }
    return tokens.sort();
  };

  const sourceTokens = extractTokens(sourceText);
  const targetTokens = extractTokens(targetText);

  // Check for missing tokens in target
  for (const token of sourceTokens) {
    if (!targetTokens.includes(token)) {
      issues.push({
        type: 'missing_token',
        token,
        message: `Placeholder token "${token}" found in source was corrupted or omitted in translation.`
      });
    }
  }

  // Check for unexpected extra tokens in target
  for (const token of targetTokens) {
    if (!sourceTokens.includes(token)) {
      issues.push({
        type: 'extra_token',
        token,
        message: `Unexpected placeholder token "${token}" introduced in target translation.`
      });
    }
  }

  return {
    valid: issues.length === 0,
    sourceTokenCount: sourceTokens.length,
    targetTokenCount: targetTokens.length,
    issues
  };
}
