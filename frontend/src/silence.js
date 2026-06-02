// silence.js - Pre-import console filter to clean browser developer consoles
const suppressKeywords = [
  'Download the React DevTools', 
  'Video element not found', 
  'content.js', 
  'Content Security Policy', 
  'violates the following Content Security Policy'
];

const overrideConsole = (method) => {
  const original = console[method];
  console[method] = (...args) => {
    const message = args.map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg && typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return '';
        }
      }
      return '';
    }).join(' ');

    if (suppressKeywords.some(keyword => message.includes(keyword))) {
      return; // Suppress output
    }
    original.apply(console, args);
  };
};

// Apply early to catch React DOM initialization
['log', 'warn', 'info', 'error'].forEach(overrideConsole);

// Catch and suppress browser-extension asynchronous message channel failures
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason || '');
    if (
      msg.includes('message channel closed') || 
      msg.includes('A listener indicated an asynchronous response') ||
      msg.includes('returning true')
    ) {
      event.preventDefault(); // Prevents the error from printing in console log traces
    }
  });
}
