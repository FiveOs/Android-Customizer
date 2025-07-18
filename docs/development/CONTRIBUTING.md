# Contributing to Android Kernel Customizer

Thank you for your interest in contributing to the Android Kernel Customizer project! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your feature or bug fix

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/android-kernel-customizer.git
cd android-kernel-customizer

# Install dependencies
npm install

# Set up the database
npm run db:push

# Start development server
npm run dev
```

## Project Structure

- `client/` - React frontend with TypeScript
- `server/` - Express backend API
- `shared/` - Shared types and schemas
- `kernel_customizer.py` - Python kernel builder script

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Format code with Prettier

## Adding Device Support

To add a new device to the library:

1. Add device entry to `shared/schema.ts` in `devicePresets`
2. Include device specifications (codename, kernel repo, etc.)
3. Test device configuration with known working settings
4. Update documentation

Example device entry:
```typescript
new_device: {
  name: "Device Name",
  codename: "device_codename",
  kernelRepo: "https://github.com/manufacturer/kernel.git",
  kernelBranch: "android-version",
  kernelArch: "arm64",
  kernelCrossCompile: "aarch64-linux-gnu-",
  defconfigPath: "arch/arm64/configs/device_defconfig"
}
```

## Adding NetHunter Features

1. Add feature toggle to `FeatureToggles` component
2. Include corresponding kernel config options
3. Document feature requirements and compatibility
4. Test with target devices

## Testing

Before submitting:

1. Test all affected functionality
2. Verify database operations work correctly
3. Check API endpoints respond properly
4. Ensure WebSocket connections function
5. Test build configuration generation

## Submitting Changes

1. Create a descriptive commit message
2. Push changes to your fork
3. Open a pull request with:
   - Clear description of changes
   - List of tested devices/features
   - Screenshots if UI changes
   - Breaking changes noted

## Pull Request Guidelines

- Keep changes focused and atomic
- Include tests for new functionality
- Update documentation as needed
- Respond to review feedback promptly
- Ensure CI checks pass

## Reporting Issues

When reporting bugs:

1. Use GitHub issue templates
2. Include system information
3. Provide reproduction steps
4. Attach relevant logs or screenshots
5. Specify affected devices

## Feature Requests

For new features:

1. Check existing issues first
2. Describe the use case clearly
3. Explain expected behavior
4. Consider implementation complexity
5. Discuss with maintainers first for major changes

## Code Review Process

1. All changes require review
2. Maintainers will provide feedback
3. Address comments and suggestions
4. Changes merged after approval
5. Follow up on any issues

## Community

- Be respectful and inclusive
- Help others learn and contribute
- Share knowledge and experiences
- Participate in discussions constructively

## License

By contributing, you agree that your contributions will be licensed under the MIT License.