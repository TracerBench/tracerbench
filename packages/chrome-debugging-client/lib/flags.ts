// reduce non determinism
export const REDUCE_NON_DETERMINISN_FLAGS = [
  // Disable several subsystems which run network requests in the background.
  "--disable-background-networking",
  // Enables the recording of metrics reports but disables reporting.
  "--metrics-recording-only",
  // Disable default component extensions with background pages
  "--disable-component-extensions-with-background-pages",
  // Disables syncing browser data to a Google Account.
  "--disable-sync",

  // Don't send hyperlink auditing pings
  "--no-pings",
  // Disables Domain Reliability Monitoring.
  "--disable-domain-reliability",
  // This feature allows chrome to prerequest resources it thinks you will request
  "--disable-features=NetworkPrediction",
  // Disables the client-side phishing detection feature.
  "--disable-client-side-phishing-detection",
  // Disable Google Translate
  "--disable-translate",
];

export const DISABLE_FIRST_RUN_FLAGS = [
  // Skip First Run tasks, whether or not it's actually the First Run.
  "--no-first-run",
  // Disables installation of default apps on first run.
  "--disable-default-apps",
  // Disables the default browser check.
  "--no-default-browser-check",
];

export const AUTOMATION_FLAGS = [
  // Enable indication that browser is controlled by automation.
  "--enable-automation",
  // Suppresses all error dialogs when present.
  "--noerrdialogs",
  // Prevent infobars from appearing.
  "--disable-infobars",
];

export const DEFAULT_FLAGS = [
  // Disable extensions.
  "--disable-extensions",
  // Disables all experiments set on about:flags.
  "--no-experiments",
  // Disables the sandbox for all process types that are normally sandboxed.
  "--no-sandbox",
  // Enables TLS/SSL errors on localhost to be ignored
  "--ignore-certificate-errors",
  // linux password store
  "--password-store=basic",
  // mac password store
  "--use-mock-keychain",
].concat(
  DISABLE_FIRST_RUN_FLAGS,
  REDUCE_NON_DETERMINISN_FLAGS,
  AUTOMATION_FLAGS,
);
