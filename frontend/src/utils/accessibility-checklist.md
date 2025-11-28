# Accessibility Checklist - WCAG 2.1 AA Compliance

## Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and follows visual flow
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps exist
- [ ] Skip links are provided for main content
- [ ] Escape key closes modals and dropdowns
- [ ] Arrow keys work for navigation where appropriate
- [ ] Enter and Space keys activate buttons/links

## Screen Reader Support
- [ ] All images have appropriate alt text
- [ ] Decorative images have empty alt="" attribute
- [ ] Form inputs have associated labels
- [ ] ARIA labels used where native labels aren't possible
- [ ] ARIA live regions for dynamic content
- [ ] Proper heading hierarchy (h1, h2, h3, etc.)
- [ ] Lists use proper semantic markup
- [ ] Tables have appropriate headers and captions

## Color and Contrast
- [ ] Text contrast ratio meets 4.5:1 (normal text)
- [ ] Large text contrast ratio meets 3:1 (18pt+ or 14pt+ bold)
- [ ] Non-text contrast ratio meets 3:1 (UI components, graphics)
- [ ] Color is not the only means of conveying information
- [ ] Links are distinguishable from surrounding text
- [ ] Focus indicators have sufficient contrast
- [ ] Dark mode maintains proper contrast ratios

## Forms and Input
- [ ] All form fields have labels
- [ ] Required fields are clearly indicated
- [ ] Error messages are descriptive and helpful
- [ ] Errors are announced to screen readers
- [ ] Form validation provides clear feedback
- [ ] Autocomplete attributes are used appropriately
- [ ] Input types match expected data (email, tel, etc.)
- [ ] Field instructions are associated with inputs

## Responsive and Mobile
- [ ] Touch targets are at least 44x44 pixels
- [ ] Content reflows without horizontal scrolling
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Orientation (portrait/landscape) doesn't restrict content
- [ ] Content is accessible at 320px viewport width
- [ ] Pinch-to-zoom is not disabled
- [ ] Mobile navigation is accessible

## Multimedia
- [ ] Videos have captions/subtitles
- [ ] Audio content has transcripts
- [ ] No auto-playing media (or provide controls)
- [ ] Media players are keyboard accessible
- [ ] Volume controls are available
- [ ] Alternative formats provided where necessary

## Motion and Animation
- [ ] Animations respect prefers-reduced-motion
- [ ] No content flashes more than 3 times per second
- [ ] Parallax effects have alternatives
- [ ] Auto-advancing content can be paused
- [ ] Animations don't cause motion sickness
- [ ] Essential motion is maintained in reduced motion mode

## Structure and Semantics
- [ ] HTML5 semantic elements used (nav, main, article, etc.)
- [ ] Landmarks are properly implemented
- [ ] Page has a unique, descriptive title
- [ ] Language is specified (lang attribute)
- [ ] Proper document structure (doctype, head, body)
- [ ] No duplicate IDs on the page
- [ ] Valid HTML (no parsing errors)

## Interactive Components
- [ ] Modals trap focus properly
- [ ] Modals can be closed with Escape key
- [ ] Dropdowns are keyboard navigable
- [ ] Tooltips are accessible
- [ ] Accordions indicate expanded/collapsed state
- [ ] Tabs have proper ARIA roles and states
- [ ] Custom components have appropriate ARIA

## Content and Readability
- [ ] Text is readable and clear
- [ ] Font size is appropriate (minimum 16px body text)
- [ ] Line height is sufficient (1.5 for body text)
- [ ] Line length is optimal (50-75 characters)
- [ ] Justified text is avoided
- [ ] Content is written in plain language
- [ ] Abbreviations and acronyms are explained

## Links and Navigation
- [ ] Link text is descriptive (not "click here")
- [ ] Links open in same tab (or warn if new tab)
- [ ] Navigation is consistent across pages
- [ ] Breadcrumbs provided for deep navigation
- [ ] Current page is indicated in navigation
- [ ] Site map or search functionality available

## Error Handling
- [ ] Error messages are clear and specific
- [ ] Errors suggest how to fix the problem
- [ ] Form errors are associated with fields
- [ ] 404 pages provide helpful navigation
- [ ] Timeout warnings are provided
- [ ] Data loss is prevented or warned about

## Testing Methods
- [ ] Keyboard-only navigation tested
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Contrast checking tools used
- [ ] Automated testing (axe, Lighthouse, WAVE)
- [ ] Browser zoom tested up to 200%
- [ ] Mobile device testing
- [ ] Cross-browser testing

## Browser Support
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance (Impacts Accessibility)
- [ ] Page load time under 3 seconds
- [ ] No layout shifts (CLS < 0.1)
- [ ] Interactive quickly (TTI < 3.5s)
- [ ] Smooth animations (60fps)
- [ ] Images are optimized
- [ ] Lazy loading implemented

## Documentation
- [ ] Accessibility statement provided
- [ ] Known issues documented
- [ ] Contact method for accessibility feedback
- [ ] VPAT or ACR provided (if required)

## Notes
- This checklist is based on WCAG 2.1 Level AA standards
- All items should be checked and verified
- Regular audits should be conducted
- User feedback should be incorporated
- Accessibility is an ongoing process, not a one-time task
