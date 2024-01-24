# Style Guide

## Code Formatting

We use [Prettier](https://prettier.io/) for code formatting. Prettier is configured to automatically format code on pre-commit, ensuring consistent and clean code across the project.

### Default Prettier Settings

Prettier settings are predefined in the project's configuration files, and the default settings are used. Refer to the `.prettierrc` file for specific configuration details.

### Import Sorting

Import sorting is handled by the "@trivago/prettier-plugin-sort-imports" plugin. It ensures a consistent order for import statements in your code. The sorting rules are defined in the Prettier configuration.

## Pre-commit Hook

To maintain code quality, a pre-commit hook is set up to run Prettier automatically before each commit. This ensures that your changes are formatted correctly before being added to the repository.

## Editor Integration

Consider integrating Prettier with your code editor for real-time formatting as you work. Most code editors have extensions or plugins available for Prettier integration.

## Contributing

When contributing to the project, ensure that your code adheres to the formatting rules enforced by Prettier. If you encounter any formatting issues during the pre-commit check, please fix them before submitting your changes.

---

**Note:** Always check the project's specific Prettier configuration files for any project-specific rules or modifications.
