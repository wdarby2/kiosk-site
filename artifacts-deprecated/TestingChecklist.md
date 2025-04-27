# Testing Checklist for File Protocol Compatibility

This document provides a comprehensive testing checklist to ensure the application works correctly with the file:// protocol. Complete these tests after implementing each component and before proceeding to the next step.

## Basic File Protocol Testing

### Setup Tests
- [ ] Build the application with `npm run build`
- [ ] Navigate to the `/dist` directory in your file browser
- [ ] Open `index.html` directly in Chrome (not via a server)
- [ ] Verify the application loads without errors
- [ ] Check browser console for any error messages
- [ ] Confirm the protocol is `file://` in the address bar

### Resource Loading Tests
- [ ] Verify CSS loads correctly (check styling)
- [ ] Confirm JavaScript executes (check functionality)
- [ ] Test that images display properly
- [ ] Ensure videos load and play as expected
- [ ] Check that font resources render correctly

## Video Functionality Tests

### Grid View Video Tests
- [ ] All video thumbnails load in the grid
- [ ] Videos play automatically in the grid
- [ ] Videos are correctly muted in the grid view
- [ ] Video thumbnails display with proper dimensions
- [ ] Hover effects work on video thumbnails
- [ ] Error states display correctly for any missing videos

### Fullscreen Video Tests
- [ ] Selected video loads in fullscreen view
- [ ] Video sound is enabled in fullscreen view
- [ ] Video plays automatically when view changes
- [ ] Video metadata displays correctly
- [ ] Back button works to return to grid view
- [ ] Inactivity timer returns to home after 10 seconds

## Navigation Tests

- [ ] Clicking a thumbnail navigates to its fullscreen view
- [ ] Back button returns to the grid view
- [ ] Grid re-initializes correctly after returning
- [ ] All state is properly reset between views
- [ ] Video playback resumes correctly after navigation
- [ ] Multiple navigations in sequence work properly

## Performance Tests

- [ ] 20 videos can play simultaneously without stuttering
- [ ] Transitions between views are smooth
- [ ] No memory leaks occur during extended use
- [ ] Application responds quickly to user interactions
- [ ] Videos load quickly when accessed via file://

## Error Handling Tests

- [ ] Error messages display for missing videos
- [ ] Application degrades gracefully if a video fails to load
- [ ] Console provides meaningful error messages
- [ ] Application doesn't crash if resources are missing
- [ ] Navigation still works even with some failed resources

## Chrome Kiosk Mode Tests

- [ ] Application launches correctly in Chrome kiosk mode 
- [ ] All functionality works in kiosk mode
- [ ] Inactivity timer functions in kiosk mode
- [ ] Videos play properly in kiosk mode
- [ ] Navigation works in kiosk mode

## Different Hardware Tests

- [ ] Test on target 27" iMac
- [ ] Test on development machine
- [ ] Verify performance on different hardware
- [ ] Check video playback quality on target display
- [ ] Ensure responsiveness across different screen sizes

## Edge Case Tests

- [ ] Test with very large video files
- [ ] Test with malformed video files
- [ ] Verify behavior when rapidly switching between views
- [ ] Check performance after extended runtime
- [ ] Test after system sleep/wake cycles

## Testing Command for Chrome Kiosk Mode

```bash
# On macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk file:///full/path/to/your/dist/index.html

# On Windows
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk file:///C:/path/to/your/dist/index.html
```

## Debugging Techniques for File Protocol Issues

1. **Path Debugging**
   - Open browser developer tools (F12)
   - Check the Network tab for 404 errors
   - Look for resources with incorrect paths

2. **Console Logging**
   - Add console.log statements to track resource loading
   - Log the full paths being used to load resources
   - Check for errors related to resource loading

3. **Video Element Debugging**
   - Inspect video elements that fail to load
   - Check the 'error' property on video elements
   - Verify the 'src' attribute contains the correct path

4. **Test with Different Browsers**
   - Test in both Chrome and Firefox
   - Compare behavior between browsers
   - Note any browser-specific issues

## Documentation of Test Results

For each test run, document:

1. Date and time of testing
2. Chrome version used
3. Operating system and version
4. Test results (pass/fail)
5. Any issues encountered
6. Screenshots of errors if applicable
7. Notes on performance and behavior

This comprehensive testing approach will ensure the application works correctly with the file:// protocol as required by the project specifications.