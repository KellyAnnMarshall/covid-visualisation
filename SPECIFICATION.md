# AI Application Specification: Vue.js Upgrade, Dependency Modernisation, Datepicker Bug Fix, and Code Quality Refactoring

## 1. Role and Responsibilities

Act as a senior software engineer, Vue.js specialist, JavaScript/TypeScript engineer, CSS/Sass architect, UI/UX designer, and accessibility expert.

You are responsible for upgrading an existing Vue.js application to the latest stable, production-ready version of Vue.js, updating its dependencies to the latest compatible versions, correcting a datepicker boundary-validation bug, and refactoring the existing codebase to adhere to modern software engineering, web standards, accessibility requirements, and established best practices.

Work directly within the existing repository as an autonomous coding agent. Inspect the application, formulate an implementation plan, make the necessary changes, execute the available validation and testing procedures, and document the results.

Prioritise:

- Preservation of existing application functionality and intended behaviour.
- Correctness, reliability, maintainability, and readability.
- Compatibility between Vue.js, its ecosystem, and all dependencies.
- Accessibility and usability across devices and input methods.
- Secure dependency management and reproducible builds.
- Automated regression testing and meaningful verification.
- Minimal unnecessary complexity and avoidance of gratuitous rewrites.

Do not merely produce recommendations or example code. Implement the required changes in the existing application.

## 2. Project Context

The target is an existing Vue.js application with an established codebase, dependency configuration, user interface, build process, and application behaviour.

The application includes a datepicker that allows users to select dates or reporting periods based on data available in a file named `download.json`.

The latest available reporting period is represented by the following JSON property:

`"year_week": "2022-43"`

The datepicker currently contains a bug that allows users to select a date or reporting period later than the latest available period.

The application must prevent invalid future selections, derive its maximum permitted date from the authoritative data, and remain correct if the underlying dataset changes.

The existing application structure, framework version, package manager, build tooling, testing infrastructure, and component architecture must be discovered through repository inspection rather than assumed.

## 3. Initial Repository Assessment

Before modifying any files, perform a structured assessment of the existing application.

### 3.1 Inspect the project

Identify and examine:

- `package.json` and the applicable lockfile.
- The installed Vue.js version and current upgrade path.
- The package manager and its version requirements.
- The build tool, such as Vite or Vue CLI.
- JavaScript and TypeScript configuration.
- Application entry points and component registration.
- Vue Router, state management, and other framework integrations.
- Existing datepicker components and date-handling libraries.
- The location, structure, and loading mechanism of `download.json`.
- JavaScript, TypeScript, CSS, Sass/SCSS, HTML, and Vue single-file components.
- Existing linting, formatting, unit-testing, integration-testing, and end-to-end testing tools.
- CI workflows, deployment configuration, environment variables, and build scripts.
- Existing accessibility patterns and any known defects.
- Browser support requirements and documented runtime constraints.

Use repository search tools to identify all references to the datepicker, maximum-date logic, `year_week`, date parsing, date formatting, and dataset loading.

### 3.2 Establish a baseline

Before making changes:

1. Record the current framework and dependency versions.
2. Inspect the existing build and test commands.
3. Run the existing tests, lint checks, and production build where feasible.
4. Record pre-existing failures separately from failures introduced by the upgrade.
5. Identify functionality that must remain unchanged.
6. Inspect version-control status and preserve unrelated user modifications.
7. Establish the current datepicker behaviour, including how dates are selected, displayed, stored, and submitted.

Do not overwrite unrelated work, discard local changes, or perform destructive Git operations.

Produce a concise implementation plan identifying major changes, compatibility risks, testing requirements, and expected file modifications.

## 4. Upgrade Vue.js and Its Ecosystem

### 4.1 Target framework version

Upgrade Vue.js to the latest stable, non-prerelease release available at implementation time, subject to compatibility with the application and its supported runtime environment.

Prefer the latest stable Vue 3 release where an upgrade from Vue 2 is required and the application can reasonably support it.

Do not blindly replace version numbers or assume that every package can be upgraded independently.

If a direct upgrade is blocked by an incompatible dependency, investigate supported replacements, migration steps, and alternative upgrade paths. Resolve the incompatibility where feasible without sacrificing existing functionality.

If full migration is blocked by a material architectural or compatibility constraint, implement the safest viable upgrade, clearly document the limitation, and identify the remaining work. Do not claim that the latest version has been reached unless verified.

### 4.2 Dependency modernisation

Review every direct and transitive dependency, including:

- Vue.js and Vue ecosystem packages.
- Vue Router and state-management libraries.
- Datepicker and date-handling packages.
- Build tools and bundlers.
- CSS frameworks, Sass implementations, and PostCSS plugins.
- Linters, formatters, and static-analysis tools.
- Testing frameworks and browser automation tools.
- Accessibility testing utilities.
- Development servers, compiler tooling, and type definitions.

For every dependency:

1. Determine the installed version.
2. Identify the latest stable release.
3. Check framework, Node.js, browser, and peer-dependency compatibility.
4. Review relevant breaking changes and migration instructions.
5. Update to the latest compatible stable version.
6. Apply required configuration and source-code changes.
7. Verify the dependency is actually used and remove it if it is demonstrably unnecessary.

Distinguish production dependencies from development-only dependencies.

Do not introduce prerelease, deprecated, abandoned, or unnecessary dependencies.

Avoid unnecessary dependency substitutions where the existing library remains well supported and compatible.

### 4.3 Toolchain compatibility

Update related tooling only as needed to support the upgraded application.

Check compatibility between:

- Node.js and the package manager.
- Vue.js and the compiler.
- Build tooling and its plugins.
- TypeScript and Vue type tooling, if applicable.
- Sass and any Sass-dependent frameworks.
- ESLint and its Vue configuration.
- Testing frameworks and the upgraded runtime.

Preserve the project's established package manager. Update the lockfile using that package manager rather than generating a competing lockfile.

Specify any necessary Node.js engine constraints and update repository documentation accordingly.

### 4.4 Dependency security and integrity

Review dependency advisories, known vulnerabilities, deprecated packages, and installation scripts where appropriate.

Resolve relevant security issues through compatible upgrades or supported alternatives.

Do not use indiscriminate force flags, bypass peer-dependency checks, or suppress compatibility errors merely to achieve a successful installation.

Retain reproducible dependency installation and ensure that a clean installation can build and test the application.

## 5. Fix the Datepicker Maximum-Date Bug

### 5.1 Required behaviour

The datepicker must never permit a user to select a date or reporting period later than the latest valid period in `download.json`.

The currently known latest reporting period is:

`"year_week": "2022-43"`

Interpret this value as ISO-style week 43 of 2022, subject to verification of the application's existing reporting-period conventions.

The application must use the latest available period derived from the actual dataset as the authoritative boundary. The hard-coded value above is the expected regression-test fixture, not a permanent replacement for dynamic data loading.

### 5.2 Inspect the existing data model

Determine:

- Whether `download.json` is bundled with the application or fetched at runtime.
- Whether it contains one record per reporting period or multiple records.
- Whether `year_week` is stored as a string, array entry, or nested property.
- Whether reporting periods are sorted chronologically.
- Whether dates are interpreted as calendar dates, ISO weeks, or custom reporting periods.
- Whether the datepicker uses a native HTML input or a third-party component.
- Whether the datepicker supports a configurable `max` or equivalent property.
- Whether maximum-date logic is duplicated in other components or utilities.

Do not assume that the final JSON record is necessarily the latest period unless the data contract guarantees chronological ordering.

### 5.3 Derive the maximum valid period

Implement a reusable, testable utility or composable that derives the latest valid reporting period from `download.json`.

Requirements:

1. Validate the dataset before using it.
2. Parse `year_week` values strictly according to the established data format.
3. Determine the chronologically latest valid reporting period.
4. Handle unsorted records correctly.
5. Reject malformed values, impossible week numbers, and invalid calendar-week combinations.
6. Avoid locale-dependent date parsing.
7. Avoid ambiguous string comparisons when determining chronological order.
8. Handle empty datasets and missing or invalid values explicitly.
9. Return a consistent, documented representation suitable for the datepicker.
10. Avoid silently substituting the current date or an arbitrary future date when the dataset cannot establish a valid maximum.

Use a date-handling library already present in the project if it is suitable. Otherwise, consider native JavaScript or a well-supported library only if the additional dependency is justified.

If the data contains no valid reporting periods, disable date selection or present a clear, accessible error state. Do not permit unrestricted date selection as a fallback.

### 5.4 Convert ISO week values correctly

Treat `YYYY-Www` reporting periods according to ISO week-date rules where applicable.

The implementation must account for:

- ISO weeks beginning on Monday.
- ISO week-years differing from calendar years around New Year.
- Years containing 52 or 53 ISO weeks.
- The difference between a reporting week's identifier and the calendar date represented by that week.
- The datepicker's expected maximum-date semantics.

If the application selects individual calendar dates within reporting weeks, explicitly define whether the maximum permitted date is:

- The first day of the latest reporting week;
- The last day of the latest reporting week; or
- A separately defined reporting cutoff date.

Inspect existing application behaviour and data semantics to determine the correct interpretation. Do not silently change the reporting-period meaning.

For example, if the intended rule is that all dates within the latest available reporting week are selectable, then ISO week `2022-43` spans Monday 24 October through Sunday 30 October 2022. The permitted maximum calendar date would therefore be 30 October 2022.

If the application instead selects reporting weeks as discrete values, prevent selecting any week later than `2022-43`.

### 5.5 Apply the maximum to the UI

Bind the datepicker's maximum permitted value to the dynamically derived latest reporting period.

Depending on the component architecture:

- Set the native date input's `max` attribute.
- Configure the third-party datepicker's documented maximum-date option.
- Disable unavailable dates in custom calendar components.
- Update the displayed reporting-period choices.
- Prevent keyboard interaction from selecting invalid dates.
- Keep validation state synchronised when the dataset changes.

Ensure the displayed selection, internal application state, and submitted or downloaded query parameters remain consistent.

If the data is loaded asynchronously, do not initialise the datepicker with an unrestricted maximum while the dataset is loading.

Provide a clear loading state and disable selection until the maximum valid period is known.

### 5.6 Enforce validation independently of the UI

The datepicker's visual restrictions are not sufficient on their own.

Implement domain-level validation that rejects invalid dates or reporting periods whenever a selection is:

- Entered manually.
- Restored from persisted state.
- Loaded from a URL or query parameter.
- Supplied programmatically.
- Submitted through a form.
- Changed after a dataset refresh.

If an invalid value is encountered, follow the existing application's error-handling conventions. Either reset it to a clearly valid default or reject it with an accessible explanation. Do not silently retain an invalid selection.

Ensure that all date comparisons use consistent representations and do not introduce timezone-related off-by-one-day errors.

### 5.7 Dataset updates

The maximum date must not be permanently hard-coded.

When `download.json` changes, the application must derive the new latest period automatically on the next successful data load or application build, as appropriate to the current architecture.

If the dataset is refreshed while the application is running, ensure that a previously selected date cannot remain invalid without being detected.

Document the expected data contract and the handling of malformed or empty data.

## 6. Refactor JavaScript and TypeScript

Review and refactor the existing JavaScript and TypeScript code for clarity, correctness, maintainability, and consistency.

### 6.1 General engineering practices

- Prefer small, cohesive functions with clear responsibilities.
- Use descriptive, consistent names.
- Remove dead code, unused variables, redundant branches, and obsolete compatibility workarounds.
- Eliminate duplicated logic and consolidate shared behaviour into reusable utilities or composables.
- Replace unexplained magic values with named constants.
- Keep functions focused and avoid unnecessary nesting.
- Use explicit error handling for asynchronous operations.
- Avoid unnecessary global state and hidden side effects.
- Avoid mutating shared data unexpectedly.
- Prefer immutable transformations where they improve clarity and correctness.
- Avoid overengineering or introducing abstractions without a clear benefit.

### 6.2 Vue-specific practices

Follow current Vue.js recommendations appropriate to the upgraded version.

- Use the Composition API and `<script setup>` where suitable for the existing architecture.
- Prefer computed properties for derived state.
- Use watchers only where a side effect or synchronisation is genuinely required.
- Keep component responsibilities focused.
- Extract reusable domain logic into composables or utility modules.
- Declare component props, emitted events, and exposed interfaces explicitly.
- Avoid unnecessary prop mutation.
- Use stable, meaningful keys in list rendering.
- Clean up subscriptions, listeners, timers, and other resources when components are destroyed.
- Avoid unnecessary watchers and reactive state duplication.
- Preserve established routing and state-management behaviour.

Do not rewrite every component solely to adopt a stylistic preference. Prioritise changes that improve reliability, maintainability, accessibility, or compatibility.

### 6.3 Type safety

If the project already uses TypeScript, preserve and strengthen its type safety.

If it uses JavaScript, introduce TypeScript only when the benefits justify the migration effort. A wholesale language migration is not required for this task.

Where appropriate, define explicit types for reporting-period data, validated dates, application state, and component interfaces.

Avoid `any`, unchecked type assertions, and non-null assertions when safer alternatives are practical.

### 6.4 Asynchronous behaviour

Review data loading and asynchronous operations for:

- Loading, success, empty, and error states.
- Race conditions and stale responses.
- Duplicate requests.
- Proper cancellation or cleanup where applicable.
- Consistent error reporting.
- Safe state updates following component unmounting.

Ensure that the datepicker cannot become usable before its maximum permitted period has been established.

## 7. Refactor CSS and Sass/SCSS

Review all existing stylesheets, scoped component styles, Sass files, and styling-related build configuration.

### 7.1 Maintainable styling

- Consolidate duplicate declarations and redundant selectors.
- Remove unused styles where their lack of use can be verified.
- Use consistent formatting, naming, and indentation.
- Establish a coherent approach to global styles, component styles, and layout styles.
- Prefer simple, maintainable selectors.
- Avoid unnecessary specificity and excessive `!important` declarations.
- Replace repeated design values with CSS custom properties or Sass variables where appropriate.
- Use responsive layout techniques suited to the actual interface.
- Avoid unnecessary framework or styling-library replacements.
- Preserve the existing visual identity unless a change is required for usability, accessibility, or correctness.

### 7.2 Modern CSS practices

Use semantic, standards-compliant CSS.

Prefer Flexbox, Grid, logical properties, responsive sizing, and other established CSS capabilities where appropriate.

Ensure that focus indicators, validation messages, disabled states, loading states, and interactive controls have clear visual presentation.

Support browser zoom and text resizing without loss of functionality.

Respect `prefers-reduced-motion` for non-essential animations and transitions.

Avoid layout changes that introduce horizontal scrolling or obscure essential content at narrow viewport widths.

### 7.3 Sass practices

Where Sass or SCSS is used:

- Use the modern Sass module system with `@use` and `@forward` where appropriate.
- Replace deprecated Sass patterns and legacy `@import` usage when safe.
- Remove unused mixins, functions, variables, and partials.
- Reduce unnecessary nesting.
- Avoid generating overly complex selectors.
- Keep shared design tokens and utilities organised.
- Verify compatibility with the selected Sass compiler and build tooling.

Do not undertake a disruptive styling rewrite when a targeted refactor is sufficient.

## 8. Refactor HTML and Vue Templates

Review the application's HTML and Vue templates for semantic correctness, accessibility, maintainability, and modern standards.

Requirements:

- Use semantic HTML elements appropriately.
- Use native buttons for actions and anchors for navigation.
- Associate form controls with meaningful labels.
- Use fieldsets and legends for logically grouped form inputs where appropriate.
- Provide accessible names for icon-only controls.
- Ensure interactive elements are keyboard accessible.
- Avoid invalid nesting and duplicated element identifiers.
- Keep templates readable and avoid unnecessary conditional complexity.
- Use Vue directives appropriately and avoid direct DOM manipulation when reactive rendering is sufficient.
- Ensure status messages and validation errors are communicated clearly.
- Use appropriate language attributes and page metadata.
- Avoid non-semantic clickable containers when a native interactive element is suitable.

Review generated HTML for standards compliance and ensure that any structured data or JSON embedded in markup remains valid and correctly escaped.

Do not alter existing content or interaction patterns unnecessarily.

## 9. Accessibility Requirements

Target WCAG 2.2 Level AA as the accessibility benchmark, applying relevant W3C/WAI recommendations to the actual interface.

Use automated checks alongside manual testing. Automated tools alone cannot establish complete conformance.

### 9.1 Keyboard accessibility

Verify that:

- Every interactive control is keyboard accessible.
- Focus order is logical and predictable.
- Focus indicators are visible.
- No keyboard traps exist.
- Focus is managed appropriately when dialogs, popovers, or calendar overlays open and close.
- Calendar navigation and date selection work with the keyboard if a custom datepicker is used.
- Disabled and unavailable dates cannot accidentally receive a valid selection.

If using a third-party datepicker, verify its actual keyboard and screen-reader behaviour instead of assuming that accessibility is provided automatically.

### 9.2 Screen readers and semantics

Verify that:

- Interactive elements have meaningful accessible names.
- Form labels and instructions are programmatically associated.
- Selected dates and reporting periods are announced correctly.
- Unavailable dates are communicated appropriately.
- Errors and loading states are announced when necessary.
- Dynamic status messages use suitable live-region semantics without excessive announcements.
- Heading structure and page landmarks are meaningful.

### 9.3 Visual accessibility

Check:

- Text and interface-element contrast.
- Visible focus states.
- Colour-independent status communication.
- Text resizing and browser zoom.
- Responsive layouts.
- Reduced-motion preferences.
- Touch target sizes and spacing.
- Error messages that remain understandable without relying solely on colour.

### 9.4 Datepicker accessibility

The datepicker must communicate:

- The currently selected date or reporting period.
- The earliest and latest permitted values, where useful.
- Why a date or period is unavailable, where that is not self-evident.
- Validation failures and the action required to correct them.
- Loading or error states when valid date limits cannot be determined.

Ensure that manually entered dates are validated accessibly and that invalid input does not disappear without explanation.

## 10. Automated Testing Strategy

Create or extend a comprehensive test suite covering existing functionality, framework upgrades, dependency changes, datepicker behaviour, and accessibility.

Use the repository's established testing framework when it remains compatible. Introduce or replace testing tools only when necessary.

### 10.1 Unit tests for reporting-period logic

Test the reusable utility that derives the latest valid reporting period.

Include cases for:

1. A single valid reporting period.
2. Multiple valid periods.
3. Unsorted dataset entries.
4. Duplicate periods.
5. The known maximum period `2022-43`.
6. A dataset with a later valid period.
7. Valid ISO week 53 where applicable.
8. Invalid week numbers.
9. Invalid year/week combinations.
10. Malformed strings and unexpected data types.
11. Missing `year_week` properties.
12. An empty dataset.
13. A dataset containing no valid periods.
14. Leap-year and year-boundary cases.
15. Consistent results regardless of browser locale and timezone.

Verify that the maximum is derived from the data rather than a permanent hard-coded constant.

### 10.2 Datepicker regression tests

Add explicit tests reproducing the existing bug.

At a minimum, verify that:

- With the latest period set to `2022-43`, the datepicker cannot select a later reporting period.
- If the application uses calendar dates within a reporting week, the final permitted date matches the documented week-boundary semantics.
- Dates beyond the maximum are disabled or otherwise unselectable in the interface.
- The underlying validation rejects manually entered dates beyond the maximum.
- Invalid URL parameters and restored state are rejected.
- Form submission cannot proceed with an invalid date.
- An updated dataset advances the maximum automatically.
- A previously selected date is revalidated if the maximum changes.
- The datepicker remains unavailable while the maximum is unresolved.
- Missing or invalid data produces a safe, accessible error state.
- Timezone differences do not cause off-by-one-day errors.

Use the datepicker component's actual public interface and behaviour in integration tests rather than testing only a helper function.

### 10.3 Component and integration tests

Test relevant application workflows, including:

- Application initialisation.
- Loading `download.json`.
- Datepicker initialisation and selection.
- Filtering or retrieving data using the selected period.
- Validation messages and recovery.
- Loading and error states.
- Component lifecycle and reactive updates.
- Router and state-management integrations.
- Any affected download, export, or submission workflows.

### 10.4 End-to-end regression tests

Where an end-to-end framework exists, add tests for critical user journeys.

Cover:

1. Loading the application.
2. Displaying the latest available reporting period.
3. Selecting a valid period.
4. Attempting to select a period beyond the maximum.
5. Attempting to submit an invalid manually entered value.
6. Confirming that valid selections continue to produce the expected results.
7. Verifying relevant keyboard interactions.
8. Confirming sensible behaviour when the dataset cannot be loaded.

Use deterministic fixtures and controlled test data. Avoid relying on production data or network availability for ordinary automated regression tests.

### 10.5 Accessibility tests

Run automated accessibility checks on representative application states, including the datepicker open, valid selection, validation error, loading state, and empty-data state.

Use a suitable tool such as axe-core if compatible with the existing testing setup.

Test keyboard navigation manually and perform a screen-reader review where the environment allows.

Document any known accessibility limitations rather than claiming full WCAG conformance solely because automated tests pass.

## 11. Code Quality and Static Analysis

Configure or update the project's existing linting, formatting, and type-checking tools.

Enforce appropriate rules for:

- Vue component structure.
- JavaScript or TypeScript correctness.
- Unused variables and imports.
- Error-prone patterns.
- Consistent code formatting.
- Template correctness.
- Accessibility-related markup where supported.
- Deprecated framework APIs and obsolete patterns.

Resolve warnings and errors introduced by the changes.

Avoid suppressing lint rules globally or adding broad exclusions to obtain a clean result. Any justified exception should be narrow, documented, and necessary.

Ensure that the project's checks can be executed consistently in local development and CI.

## 12. Performance and Build Quality

Review the application for avoidable performance regressions introduced by the upgrade or refactor.

Where relevant:

- Reduce unnecessary reactive computations.
- Avoid redundant dataset parsing.
- Reuse computed maximum-date values until the underlying dataset changes.
- Avoid unnecessary component re-renders.
- Remove unused dependencies and assets where safe.
- Review bundle-size changes.
- Ensure production builds do not include development-only tooling unnecessarily.
- Verify asset paths and static-file handling.
- Preserve the application's existing deployment model.

Do not introduce premature optimisation or additional caching that could make the maximum reporting period stale.

The production build must complete successfully using the documented build process.

## 13. Documentation and Developer Experience

Update project documentation to describe:

- The supported Vue.js version.
- Node.js and package-manager requirements.
- Installation and development commands.
- Build and test commands.
- Dependency upgrade decisions that require explanation.
- The structure and expected format of `download.json`.
- How the latest reporting period is derived.
- Whether the maximum refers to a reporting week or a calendar date.
- How invalid or missing dataset values are handled.
- How to update the reporting data safely.
- Any remaining compatibility limitations.

Keep documentation accurate and concise.

Do not expose credentials, private environment variables, or sensitive application configuration.

## 14. Implementation Workflow

Execute the work in the following order.

### Phase 1: Discovery and baseline

Inspect the repository, identify framework and dependency versions, run baseline checks, map the datepicker implementation, and establish the intended reporting-period semantics.

### Phase 2: Upgrade planning

Determine a supported upgrade path, check official migration documentation and package compatibility, identify breaking changes, and establish a dependency update sequence.

### Phase 3: Framework and dependency upgrade

Upgrade Vue.js and compatible ecosystem packages, update build tooling where necessary, apply migration changes, and maintain a reproducible lockfile.

### Phase 4: Datepicker correction

Implement dynamic maximum-period derivation, bind the result to the datepicker, add independent validation, and handle loading, invalid data, and dataset updates.

### Phase 5: Codebase refactoring

Refactor JavaScript/TypeScript, Vue components, CSS, Sass/SCSS, and HTML templates. Preserve existing behaviour and address identified accessibility issues.

### Phase 6: Testing and verification

Add regression tests, run unit and integration tests, execute end-to-end tests where available, check accessibility, run static analysis, and build the production application.

### Phase 7: Final review

Review the complete diff, check for accidental behavioural changes, confirm dependency and lockfile consistency, inspect generated output, update documentation, and prepare the final implementation report.

If an earlier phase exposes a blocking incompatibility, investigate and resolve it before proceeding with dependent changes.

## 15. Acceptance Criteria

The task is complete only when the following requirements have been addressed and their verification status documented.

### Framework and dependencies

- [ ] Vue.js is upgraded to the latest stable version supported by the completed migration.
- [ ] Dependencies are updated to their latest compatible stable versions where appropriate.
- [ ] Incompatible or obsolete dependencies are resolved or explicitly documented.
- [ ] The package lockfile is consistent with the package manifest.
- [ ] A clean dependency installation succeeds.

### Datepicker

- [ ] The maximum valid period is derived from `download.json`.
- [ ] The known `2022-43` regression case is covered by automated tests.
- [ ] Dates or reporting periods beyond the maximum cannot be selected.
- [ ] Manual input and programmatic selections are independently validated.
- [ ] ISO week and year-boundary semantics are handled correctly.
- [ ] Dataset loading failures do not enable unrestricted selection.
- [ ] Dataset updates cause the maximum to be recalculated.
- [ ] Valid existing selections and downstream application workflows continue to function.

### Code quality

- [ ] JavaScript/TypeScript is refactored where beneficial.
- [ ] CSS and Sass/SCSS follow maintainable, modern conventions.
- [ ] HTML and Vue templates use appropriate semantic markup.
- [ ] Redundant code and unnecessary dependencies are removed where safe.
- [ ] Error handling and reactive state management are reliable.

### Accessibility

- [ ] Keyboard accessibility and focus behaviour are verified.
- [ ] Labels, accessible names, and validation messages are correct.
- [ ] Relevant WCAG 2.2 AA requirements are assessed.
- [ ] Automated accessibility checks pass, or outstanding findings are documented.
- [ ] Responsive layouts and visible focus indicators are verified.

### Testing and delivery

- [ ] Existing tests pass, or pre-existing failures are documented.
- [ ] New datepicker regression tests pass.
- [ ] Relevant integration and end-to-end tests pass where available.
- [ ] Linting and type checking pass where configured.
- [ ] The production build succeeds.
- [ ] Documentation reflects the final implementation.
- [ ] The final report distinguishes verified results from uncompleted or blocked work.

## 16. Final Implementation Report

At completion, provide a concise but informative report containing:

1. **Summary:** What was upgraded, corrected, and refactored.
2. **Framework and dependency changes:** Previous and final versions, significant upgrades, and any remaining compatibility constraints.
3. **Datepicker fix:** Root cause, implementation approach, maximum-date semantics, and how the boundary is derived from `download.json`.
4. **Refactoring:** Important JavaScript, Vue, CSS, Sass, HTML, and accessibility improvements.
5. **Testing results:** Commands executed, test counts where available, pass/fail status, and any checks that could not be run.
6. **Files changed:** The major files and their purpose.
7. **Known limitations:** Outstanding issues, assumptions, or work blocked by external constraints.
8. **Recommended follow-up:** Only genuinely necessary additional work.

Be transparent about verification. Never report a successful build, passing test suite, completed accessibility audit, or fully updated dependency set unless the relevant checks have actually been performed.

The final deliverable must be a working, tested, maintainable upgrade of the existing application, with the datepicker maximum-date defect resolved and existing functionality preserved.
