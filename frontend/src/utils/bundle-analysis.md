# Bundle Size Analysis & Optimization

## Current Bundle Structure

### With Code Splitting (Phase 8)
```
Initial Bundle (~150-200KB gzipped)
├── React & React DOM
├── React Router
├── Framer Motion (core)
├── Context Providers
├── Common Components (Navbar, Footer, LoadingSpinner)
└── App Shell

Lazy Loaded Chunks (loaded on demand)
├── Landing Page (~30-40KB)
├── Login/Signup (~20-30KB)
├── Search (~40-50KB)
├── Property Detail (~30-40KB)
├── Owner Dashboard (~50-60KB)
├── Renter Dashboard (~40-50KB)
├── Admin Dashboard (~60-70KB)
└── Other Routes (various sizes)
```

### Before Code Splitting
```
Single Bundle (~500-600KB gzipped)
└── Everything loaded upfront
```

**Improvement**: ~70% reduction in initial bundle size

## Analysis Tools

### 1. Webpack Bundle Analyzer
```bash
# Install
yarn add -D webpack-bundle-analyzer

# Add to package.json scripts
"analyze": "source-map-explorer 'build/static/js/*.js'"

# Run analysis
yarn build
yarn analyze
```

### 2. Source Map Explorer
```bash
# Install
yarn add -D source-map-explorer

# Run
yarn build
npx source-map-explorer 'build/static/js/*.js'
```

### 3. Chrome DevTools Coverage
1. Open DevTools (F12)
2. Go to Coverage tab (Cmd+Shift+P → "Show Coverage")
3. Reload page
4. View unused code percentage

## Optimization Strategies

### 1. Tree Shaking ✅
Automatically enabled with Create React App and ES6 modules.

```javascript
// Good - Named imports (tree-shakeable)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Avoid - Namespace imports (harder to tree-shake)
import * as React from 'react';
```

### 2. Dynamic Imports ✅
```javascript
// Route-level code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Component-level code splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// Library-level code splitting
button.addEventListener('click', async () => {
  const { default: lodash } = await import('lodash');
  lodash.debounce(fn, 300);
});
```

### 3. Remove Unused Dependencies
```bash
# Audit dependencies
npx depcheck

# Remove unused packages
yarn remove unused-package
```

### 4. Replace Heavy Libraries

#### Before
```javascript
import moment from 'moment'; // ~300KB
import _ from 'lodash'; // ~100KB
```

#### After
```javascript
import { format } from 'date-fns'; // ~30KB
import debounce from 'lodash/debounce'; // ~2KB
```

### 5. Optimize Images
- Use WebP format with fallbacks
- Implement lazy loading
- Use CDN for image optimization
- Add width/height attributes

### 6. Minimize Third-Party Scripts
```javascript
// Load non-critical scripts async
<script async src="analytics.js"></script>

// Defer non-essential scripts
<script defer src="chat-widget.js"></script>
```

## Current Dependencies Audit

### Large Dependencies
1. **Framer Motion** (~100KB)
   - Essential for animations
   - Well-optimized
   - Tree-shakeable
   - ✅ Keep

2. **React Chart.js** (~50KB)
   - Used in dashboards
   - Already lazy loaded
   - ✅ Keep

3. **React Router** (~30KB)
   - Essential for routing
   - Minimal overhead
   - ✅ Keep

4. **Axios** (~15KB)
   - Could be replaced with fetch
   - 🤔 Consider native fetch

5. **UUID** (~10KB)
   - Used for unique IDs
   - Could use crypto.randomUUID()
   - 🤔 Consider native API

### Optimization Opportunities

#### 1. Replace Axios with Fetch
```javascript
// Before (Axios - 15KB)
import axios from 'axios';
const response = await axios.get('/api/data');

// After (Fetch - native, 0KB)
const response = await fetch('/api/data');
const data = await response.json();
```

#### 2. Replace UUID with Native API
```javascript
// Before (UUID package - 10KB)
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

// After (Native - 0KB)
const id = crypto.randomUUID();
// Fallback for older browsers
const id = crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
```

#### 3. Optimize Framer Motion
```javascript
// Import only what you need
import { motion } from 'framer-motion';
// vs
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Use LazyMotion for smaller bundle
import { LazyMotion, domAnimation, m } from 'framer-motion';

<LazyMotion features={domAnimation}>
  <m.div animate={{ x: 100 }} />
</LazyMotion>
```

## Performance Budget

### Target Sizes
- **Initial JS Bundle**: < 200KB gzipped
- **Initial CSS Bundle**: < 50KB gzipped
- **Total Initial Load**: < 300KB gzipped
- **Lazy Chunks**: < 100KB each gzipped

### Current Status (Estimated)
- **Initial JS**: ~150-180KB ✅
- **Initial CSS**: ~30-40KB ✅
- **Lazy Chunks**: ~30-60KB each ✅

## Monitoring

### Setup Bundle Size Monitoring
```bash
# Add to CI/CD pipeline
yarn build
ls -lh build/static/js/*.js
```

### Alerts
Set up alerts for:
- Initial bundle > 200KB
- Any chunk > 100KB
- Total bundle > 1MB
- Unused code > 20%

## Testing Commands

```bash
# Build for production
yarn build

# Analyze bundle
yarn analyze

# Check gzipped sizes
ls -lh build/static/js/*.js
gzip -c build/static/js/main.*.js | wc -c

# Check coverage (manual)
# Open DevTools → Coverage tab

# Lighthouse audit
lighthouse http://localhost:3000 --view
```

## Best Practices Checklist

- [x] Code splitting by route
- [x] Lazy loading images
- [x] Tree shaking enabled
- [x] Dynamic imports for heavy components
- [ ] Bundle analyzer in CI/CD
- [ ] Performance budget enforced
- [ ] Regular dependency audits
- [x] Minimal third-party scripts
- [x] Optimized animations (GPU-accelerated)
- [x] Reduced motion support

## Next Steps

1. **Implement Bundle Analyzer**: Add to build process
2. **Set Performance Budget**: Fail builds that exceed limits
3. **Regular Audits**: Monthly dependency and bundle analysis
4. **Monitor in Production**: Track real user metrics
5. **Progressive Enhancement**: Build for slow connections first

## Resources

- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Source Map Explorer](https://github.com/danvk/source-map-explorer)
- [Import Cost VSCode Extension](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Bundlephobia](https://bundlephobia.com/) - Check package sizes before installing
