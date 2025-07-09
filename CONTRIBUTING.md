# Contributing to Android Kernel Customizer

Thank you for your interest in contributing to Android Kernel Customizer! We welcome contributions from the community and are grateful for any help you can provide.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. **Check existing issues** - Before creating a new issue, please check if it has already been reported
2. **Use the issue template** - Fill out all sections of the bug report template
3. **Provide details** - Include:
   - Your operating system and version
   - WSL distribution and version
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Error messages or logs

### Suggesting Features

1. **Check the roadmap** - See if the feature is already planned
2. **Open a discussion** - Start with a GitHub Discussion before creating an issue
3. **Be specific** - Describe the problem your feature would solve
4. **Consider implementation** - If possible, suggest how it might work

### Pull Requests

1. **Fork the repository** - Create your own fork of the project
2. **Create a branch** - Use a descriptive branch name: `feature/amazing-feature` or `fix/issue-123`
3. **Follow the style guide** - Ensure your code matches the project's style
4. **Write tests** - Add tests for new functionality when applicable
5. **Update documentation** - Keep README and docs in sync with changes
6. **Submit the PR** - Fill out the PR template completely

## Development Setup

1. **Prerequisites**
   ```bash
   # Install WSL2 if on Windows
   wsl --install -d Ubuntu-22.04
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and setup**
   ```bash
   git clone https://github.com/FiveOs/android-kernel-customizer.git
   cd android-kernel-customizer
   cp .env.example .env
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer async/await over callbacks

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types for props
- Follow the existing file structure

### Commits
- Use conventional commit format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for tests
  - `chore:` for maintenance

Example: `feat: add device unbrick recovery system`

### Testing
- Write unit tests for utilities and services
- Test edge cases and error conditions
- Ensure all tests pass before submitting PR

## Adding Device Support

To add support for a new device:

1. **Add device preset** in `shared/schema.ts`:
   ```typescript
   "device-codename": {
     name: "Device Name",
     codename: "device-codename",
     manufacturer: "Manufacturer",
     androidVersions: ["13", "14"],
     kernelRepo: "https://github.com/...",
     defconfig: "device_defconfig",
     architecture: "arm64",
     nethunterSupported: true
   }
   ```

2. **Test the configuration** - Build a kernel for the device
3. **Document the addition** - Update device list in README
4. **Submit PR** - Include test results and device specs

## Security

- Never commit sensitive data (API keys, passwords)
- Report security vulnerabilities privately to maintainers
- Follow secure coding practices
- Validate all user inputs

## Getting Help

- **Discord**: Join our community server (link in README)
- **GitHub Discussions**: Ask questions and share ideas
- **XDA Forums**: Check the official thread
- **Documentation**: Read the full docs in `/docs`

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in relevant documentation

Thank you for contributing to Android Kernel Customizer! Your efforts help make Android customization accessible to everyone.

---

**Questions?** Feel free to open a discussion or reach out to the maintainers.