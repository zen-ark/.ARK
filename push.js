#!/usr/bin/env node
/**
 * Quick push script - adds, commits, and pushes all changes
 * Run with: node push.js
 */

import { execSync } from 'child_process';
import path from 'path';

const projectPath = "/Users/shaing/Documents/Documents - Shain's MacBook Pro/04_IAD15/3_Semester/Coding Portfolio ";

function runCommand(command, cwd = projectPath) {
  try {
    const output = execSync(command, { 
      cwd,
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

console.log('🔄 Checking for changes...');

// Check if there are any changes
const statusResult = runCommand('git status --porcelain');
if (statusResult.success && !statusResult.output?.trim()) {
  console.log('✅ No changes to commit. Everything is up to date!');
  process.exit(0);
}

console.log('📦 Staging all changes...');
const addResult = runCommand('git add -A');
if (!addResult.success) {
  console.error('❌ Failed to stage changes:', addResult.error);
  process.exit(1);
}

// Get list of changed files
let changedFiles = '';
try {
  const files = execSync('git diff --cached --name-only', { 
    cwd: projectPath,
    encoding: 'utf-8' 
  }).trim().split('\n').filter(Boolean);
  
  const fileCount = files.length;
  if (fileCount > 0) {
    changedFiles = files.slice(0, 5).join(', ');
    if (fileCount > 5) {
      changedFiles += ` and ${fileCount - 5} more`;
    }
  }
} catch (e) {
  changedFiles = 'various files';
}

const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

console.log('💾 Committing changes...');
const commitMessage = `chore: update local changes

- Updated files: ${changedFiles}
- Auto-committed: ${timestamp}`;

const commitResult = runCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
if (!commitResult.success) {
  console.error('❌ Failed to commit:', commitResult.error);
  process.exit(1);
}

console.log('🚀 Pushing to GitHub...');
const pushResult = runCommand('git push origin main');
if (!pushResult.success) {
  console.error('❌ Failed to push:', pushResult.error);
  process.exit(1);
}

console.log('');
console.log('✅ Successfully pushed to GitHub!');

