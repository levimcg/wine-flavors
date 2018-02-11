#!/bin/sh

if [[ $(git status -s) ]]
then
    echo "The working directory is dirty. Please commit any pending changes."
    exit 1;
fi

echo "Deleting old publication"
rm -rf _site
mkdir _site
git worktree prune
rm -rf .git/worktrees/_site/

echo "Checking out gh-pages branch into public"
git worktree add -B gh-pages _site origin/gh-pages

echo "Removing existing files"
rm -rf _site/*

echo "Generating site"
gulp build

echo "Updating gh-pages branch"
cd _site && git add --all && git commit -m "Publishing to gh-pages (deploy.sh)"

echo "Deploying to Github pages"
git push origin gh-pages

echo "Successfully pushed to gh-pages!"