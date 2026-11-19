import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calibrateTranslation } from '../src/index.mjs';

describe('agentic-i18n-core Engine', () => {
  it('detects corrupted placeholder tokens', () => {
    const src = 'Welcome back, {username}! You have {count} unread notifications.';
    const corruptedTgt = '欢迎回来！您有 { count } 条未读通知。'; // {username} missing, space in { count }
    const result = calibrateTranslation(src, corruptedTgt);

    assert.strictEqual(result.compliant, false);
    assert.ok(result.issues.some(i => i.type === 'missing_token' && i.token === '{username}'));
  });

  it('detects unclosed HTML attributes', () => {
    const src = 'Please click <a href="/login">here</a> to sign in.';
    const badTgt = '请点击 <a href="/login>这里</a> 登录。'; // missing closing quote on href
    const result = calibrateTranslation(src, badTgt);

    assert.strictEqual(result.compliant, false);
    assert.ok(result.issues.some(i => i.type === 'malformed_attribute_quotes'));
  });

  it('passes on accurate translations with intact placeholders and tags', () => {
    const src = 'Download your <a href="/catalog">Spec Sheet ({version})</a> now.';
    const cleanTgt = '立即下载您的 <a href="/catalog">技术规格书 ({version})</a>。';
    const result = calibrateTranslation(src, cleanTgt);

    assert.strictEqual(result.compliant, true);
    assert.strictEqual(result.issueCount, 0);
  });
});
