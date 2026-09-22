# Pull Request Template

## Description

Please include a summary of the changes and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes # (issue)

## Type of Change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Design / Style Alignment (updates views to match the Dashboard design system)
- [ ] Refactoring / Housekeeping (code cleanup and refactoring)

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration.

- [ ] **Docker Composer Test**: `docker compose exec workspace composer test`
- [ ] **Linter Check**: `npm run lint` inside the workspace container
- [ ] **Build Check**: `npm run build` inside the workspace container

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] My changes generate no new warnings / console errors
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have run tests locally and they pass
- [ ] My changes compile cleanly under production settings
