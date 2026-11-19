/**
 * HTML Tag & Attribute Preservation Validator
 * Detects attribute truncation, unclosed tags, or malformed quotes in localized strings.
 */
export function validateTags(sourceText, targetText) {
  const issues = [];
  const tagRegex = /<(\/?[a-z0-9]+)([^>]*)>/gi;

  const extractTags = (str) => {
    const list = [];
    let match;
    const re = new RegExp(tagRegex);
    while ((match = re.exec(str)) !== null) {
      list.push({
        raw: match[0],
        tagName: match[1].toLowerCase().replace('/', ''),
        isClose: match[1].startsWith('/')
      });
    }
    return list;
  };

  const srcTags = extractTags(sourceText);
  const tgtTags = extractTags(targetText);

  // Check tag counts
  const srcOpenCount = srcTags.filter(t => !t.isClose).length;
  const tgtOpenCount = tgtTags.filter(t => !t.isClose).length;
  if (srcOpenCount !== tgtOpenCount) {
    issues.push({
      type: 'tag_count_mismatch',
      message: `Open tag count mismatch: source has ${srcOpenCount}, translation has ${tgtOpenCount}.`
    });
  }

  // Detect unclosed quotes in target tag attributes
  for (const tag of tgtTags) {
    if (!tag.isClose) {
      const quoteCount = (tag.raw.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        issues.push({
          type: 'malformed_attribute_quotes',
          tag: tag.raw,
          message: `Truncated or unbalanced double quotes in HTML tag: ${tag.raw}`
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    sourceTags: srcTags.length,
    targetTags: tgtTags.length,
    issues
  };
}
