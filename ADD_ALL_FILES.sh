#!/bin/bash
# Script to add all local files to git repository

cd "/Users/shaing/Documents/Documents - Shain's MacBook Pro/04_IAD15/3_Semester/Coding Portfolio "

echo "Adding all files to git..."
git add -A

echo ""
echo "Files to be committed:"
git status --short

echo ""
echo "Total files:"
git status --short | wc -l

echo ""
read -p "Press Enter to commit, or Ctrl+C to cancel..."

git commit -m "feat: add all source files to repository

- Add all pages (index, about, contact, projects, etc.)
- Add layouts (Base, PageLayout, ProjectLayout)
- Add content collections (projects, posts)
- Add all components (Hero, Navigation, WhatArkDoes, etc.)
- Add styles and design tokens
- Add utility libraries (seo, projects, etc.)
- Add public assets
- Complete source code structure for deployment"

echo ""
echo "Pushing to remote..."
git push origin main

echo ""
echo "Done! Check Vercel for new deployment."

