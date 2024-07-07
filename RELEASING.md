# Releasing

I did not yet have the time to configure GH Actions, so these my notes how to
release by hand.

1. Run tests
2. Check the demo page in browser
3. Bump version: `npm --no-git-tag-version --force version <major|minor|patch>`
4. Commit changes: `git commit -am "Release version <version>"`
5. Push changes: `git push`
6. Tag release: `git tag <version>`
7. Push tag: `git push --tags`
8. Publish to npm: `npm publish`
