# 🐕 Husky Git Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) to enforce code quality standards through Git hooks and ensure consistent development practices.

## 🚀 What's Included

### Git Hooks

1. **Pre-commit Hook** (`.husky/pre-commit`)
   - Runs `lint-staged` to lint and format only staged files
   - Performs TypeScript type checking on the entire project
   - Automatically fixes ESLint errors where possible
   - Prevents commits if there are linting or type errors

2. **Pre-push Hook** (`.husky/pre-push`)
   - Runs comprehensive linting on entire codebase
   - Performs TypeScript type checking
   - Runs a full build to ensure the project compiles correctly
   - Prevents pushes if any checks fail

3. **Commit Message Hook** (`.husky/commit-msg`)
   - Enforces conventional commit message format
   - Requires messages to follow: `type(scope): description`
   - Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

### Tools Configured

- **Husky**: Git hooks management
- **lint-staged**: Run linters only on staged files
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **TypeScript**: Type checking

## 📋 Scripts Available

```bash
# Linting
pnpm lint              # Run ESLint
pnpm lint:fix          # Run ESLint with auto-fix

# Formatting
pnpm format            # Format all files with Prettier
pnpm format:check      # Check if files are formatted correctly

# Type checking
pnpm type-check        # Run TypeScript type checking
```

## 🎯 Lint-staged Configuration

When you commit files, `lint-staged` will automatically:

- **For `.js`, `.jsx`, `.ts`, `.tsx` files:**
  - Run ESLint with auto-fix
  - Format with Prettier

- **For `.json`, `.md`, `.mdx`, `.css`, `.html`, `.yml`, `.yaml` files:**
  - Format with Prettier

## 💡 Commit Message Examples

✅ **Valid commit messages:**

```
feat: add new contact form validation
fix(ui): resolve button hover animation
docs: update README with setup instructions
refactor(components): simplify project card logic
style: format code according to prettier rules
test: add unit tests for contact form
chore: update dependencies
perf(api): optimize database queries
ci: add GitHub Actions workflow
build: update webpack configuration
revert: revert "add broken feature"
```

❌ **Invalid commit messages:**

```
Add new feature          # Missing type
fix button               # Too vague
feat(): empty scope      # Empty scope
FEAT: wrong case         # Wrong case
```

## 🔧 Setup Process

The Husky setup was configured with:

1. Install Husky and related tools:

   ```bash
   pnpm add --save-dev husky lint-staged prettier
   ```

2. Initialize Husky:

   ```bash
   pnpx husky init
   ```

3. Configure hooks in `.husky/` directory
4. Add lint-staged configuration to `package.json`
5. Create Prettier configuration files

## 🚨 Troubleshooting

### If pre-commit hook fails:

1. Check the specific error message
2. Fix linting/formatting issues: `pnpm lint:fix && pnpm format`
3. Fix TypeScript errors manually
4. Try committing again

### If pre-push hook fails:

1. Run `pnpm build` locally to see the build error
2. Fix the build issues
3. Try pushing again

### If commit message is rejected:

1. Follow the conventional commit format
2. Use one of the valid types listed above
3. Keep the description concise and clear

### To bypass hooks (use sparingly):

```bash
git commit --no-verify    # Skip pre-commit and commit-msg hooks
git push --no-verify      # Skip pre-push hook
```

## 📁 Files Created/Modified

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/pre-push` - Pre-push hook script
- `.husky/commit-msg` - Commit message validation hook
- `.prettierrc.json` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `package.json` - Added scripts and lint-staged configuration

## 🎉 Benefits

- **Consistent Code Quality**: Automatic linting and formatting
- **Prevent Broken Builds**: Type checking and build validation
- **Better Commit History**: Enforced conventional commit messages
- **Team Collaboration**: Everyone follows the same standards
- **Faster CI/CD**: Fewer failed builds due to preventive checks
