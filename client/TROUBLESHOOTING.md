# Troubleshooting Tailwind CSS Not Showing

## Issue
Tailwind CSS styles are not appearing in the browser.

## Quick Fixes

### 1. **Restart the Dev Server** (MOST IMPORTANT)
The dev server MUST be restarted after installing Tailwind CSS:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd client
npm start
```

### 2. **Clear All Caches**
```bash
cd client
rm -rf node_modules/.cache
rm -rf .cache
```

### 3. **Hard Refresh Browser**
- **Chrome/Edge**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Firefox**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Safari**: Cmd+Option+R

### 4. **Verify Tailwind is Processing**

Open browser DevTools (F12) and check:

1. **Network Tab**: Look for `main.css` or `main.*.css` file
2. **Elements Tab**: Inspect an element and check if Tailwind classes are in the computed styles
3. **Console**: Check for any CSS errors

### 5. **Test Tailwind is Working**

Add this test div to any component temporarily:
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Tailwind Test - If you see blue background, Tailwind is working!
</div>
```

If this shows a blue background, Tailwind is working. If not, continue troubleshooting.

### 6. **Check PostCSS Processing**

Verify PostCSS is processing Tailwind:
- Open DevTools → Sources → Look for `index.css`
- Check if `@tailwind` directives are replaced with actual CSS

### 7. **Reinstall Dependencies** (Last Resort)
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

## Common Issues

### Issue: Styles show in build but not dev
**Solution**: Restart dev server and clear cache

### Issue: Some Tailwind classes work but custom classes don't
**Solution**: Check `tailwind.config.js` content paths include all your files

### Issue: Styles work but animations don't
**Solution**: Verify `keyframes` are defined in `tailwind.config.js`

## Verification Checklist

- [ ] Dev server restarted after installing Tailwind
- [ ] Browser cache cleared (hard refresh)
- [ ] `postcss.config.js` exists in `client/` directory
- [ ] `tailwind.config.js` exists in `client/` directory
- [ ] `src/index.css` contains `@tailwind` directives
- [ ] `src/index.js` imports `index.css`
- [ ] No console errors in browser
- [ ] Network tab shows CSS file loading

## Still Not Working?

1. Check browser console for errors
2. Verify Tailwind version: `npm list tailwindcss`
3. Check if PostCSS is installed: `npm list postcss autoprefixer`
4. Try building for production: `npm run build` and check if styles appear


