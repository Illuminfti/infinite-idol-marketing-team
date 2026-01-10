# Sync System Troubleshooting

Common issues and solutions for the GitHub ↔ Notion sync system.

## Authentication Errors

### "Invalid Notion token format"

**Symptom**: Config validation fails with token format error.

**Solution**:
- Notion tokens must start with `secret_`
- Verify the token in your `.env` or GitHub secrets
- Regenerate the token if it's been compromised

### "Invalid GitHub token format"

**Symptom**: Config validation fails with GitHub token error.

**Solution**:
- GitHub tokens must start with `ghp_` or `github_pat_`
- Create a new Personal Access Token if needed
- Ensure the token has `repo` scope for private repositories

### "Notion API returned 401 Unauthorized"

**Symptom**: Sync fails with authentication error from Notion.

**Solution**:
1. Verify the integration token is correct
2. Ensure the database is shared with the integration
3. Check that the integration has the required capabilities

## Sync Issues

### "No changes detected"

**Symptom**: Sync runs but reports no changes.

**Cause**: File hashes match the cached state.

**Solutions**:
- Use `--force` flag to sync all files regardless of cache
- Reset the sync state: `npm run sync:to-notion -- status` then delete `.sync-state.json`
- Verify the files are in the configured sync paths

### "Database not found"

**Symptom**: Error when trying to query or update a database.

**Solutions**:
1. Verify the database ID is correct (32-character string)
2. Ensure the database is shared with your integration
3. Check that the database hasn't been deleted or moved

### "Property not found"

**Symptom**: Error when trying to set a property value.

**Solutions**:
- Ensure all required properties exist in the Notion database
- Property names are case-sensitive
- Check for special characters in property names

### "Block limit exceeded"

**Symptom**: Error when syncing large documents.

**Cause**: Notion API limits requests to 100 blocks.

**Solution**: The sync system handles this automatically by chunking. If you still see this error, check for corrupted state.

## Conflict Resolution

### "Conflict requires manual resolution"

**Symptom**: Sync stops and reports a conflict.

**Solution**:
1. Check the conflict report: `npm run sync:from-notion -- status`
2. Decide which version to keep
3. Either:
   - Edit the file in GitHub and push
   - Edit the page in Notion
4. Re-run sync with `--conflict-strategy github-wins` or `--conflict-strategy notion-wins`

### Conflicts keep appearing

**Symptom**: Same files show conflicts repeatedly.

**Solutions**:
- Ensure both systems use the same timezone for timestamps
- Check that the `lastSynced` frontmatter is being preserved
- Clear the sync state and start fresh

## GitHub Actions Issues

### Workflow not triggering

**Symptom**: Push to main doesn't trigger sync.

**Solutions**:
1. Check the `paths` filter in the workflow file
2. Verify secrets are configured
3. Check the Actions tab for disabled workflows

### "Resource not accessible by integration"

**Symptom**: GitHub Actions can't access the repository.

**Solutions**:
- For the default `GITHUB_TOKEN`, enable write permissions in repo settings
- For PATs, ensure the token has sufficient permissions

### Tests pass locally but fail in CI

**Symptom**: Tests work on your machine but not in GitHub Actions.

**Solutions**:
- Check Node.js version matches (should be 20.x)
- Verify all dependencies are in `package.json` (not global installs)
- Check for environment-specific code

## Performance Issues

### Sync is very slow

**Symptom**: Sync takes minutes to complete.

**Causes & Solutions**:
1. **Many files**: Use `--files` to sync specific files
2. **Large pages**: Break up very large documents
3. **API rate limits**: The system handles this, but large syncs may be throttled

### Memory errors

**Symptom**: Node.js crashes with heap allocation errors.

**Solution**:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run sync:to-notion
```

## Data Issues

### Frontmatter is corrupted

**Symptom**: YAML parsing errors when reading files.

**Solutions**:
1. Ensure frontmatter is valid YAML
2. Quote values containing colons or special characters
3. Use the provided parser to validate: `npm run validate-frontmatter <file>`

### Formatting is lost in Notion

**Symptom**: Markdown formatting doesn't appear correctly in Notion.

**Supported formatting**:
- Headers (H1-H3)
- Bold, italic, code, strikethrough
- Bullet and numbered lists
- Code blocks with language
- Quotes
- Links

**Not supported**:
- Tables (converted to code blocks)
- Complex nested lists (flattened)
- HTML tags

### Content appears duplicated

**Symptom**: Same content appears multiple times.

**Solutions**:
1. Check if `notionId` in frontmatter matches the page
2. Clear page content before updating (done automatically)
3. Reset sync state and re-sync

## Getting Help

If you're still stuck:

1. Enable debug logging:
   ```bash
   LOG_LEVEL=debug npm run sync:to-notion
   ```

2. Check the sync state:
   ```bash
   cat scripts/notion-sync/.sync-state.json
   ```

3. Review recent activity:
   ```bash
   git log --oneline -10 scripts/notion-sync/
   ```

4. Open an issue with:
   - Error message and stack trace
   - Relevant config (redact tokens!)
   - Steps to reproduce
