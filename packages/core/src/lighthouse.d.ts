declare module 'lighthouse' {
  type NotYetTyped = any; // Anything that has not been defined yet.

  type AuditId =
    | 'is-on-https'
    | 'redirects-http'
    | 'service-worker'
    | 'works-offline'
    | 'viewport'
    | 'without-javascript'
    | 'first-contentful-paint'
    | 'first-meaningful-paint'
    | 'load-fast-enough-for-pwa'
    | 'speed-index'
    | 'screenshot-thumbnails'
    | 'final-screenshot'
    | 'estimated-input-latency'
    | 'errors-in-console'
    | 'time-to-first-byte'
    | 'first-cpu-idle'
    | 'interactive'
    | 'user-timings'
    | 'critical-request-chains'
    | 'redirects'
    | 'webapp-install-banner'
    | 'splash-screen'
    | 'themed-omnibox'
    | 'manifest-short-name-length'
    | 'content-width'
    | 'image-aspect-ratio'
    | 'deprecations'
    | 'mainthread-work-breakdown'
    | 'bootup-time'
    | 'uses-rel-preload'
    | 'uses-rel-preconnect'
    | 'font-display'
    | 'network-requests'
    | 'metrics'
    | 'pwa-cross-browser'
    | 'pwa-page-transitions'
    | 'pwa-each-page-has-url'
    | 'accesskeys'
    | 'aria-allowed-attr'
    | 'aria-required-attr'
    | 'aria-required-children'
    | 'aria-required-parent'
    | 'aria-roles'
    | 'aria-valid-attr-value'
    | 'aria-valid-attr'
    | 'audio-caption'
    | 'button-name'
    | 'bypass'
    | 'color-contrast'
    | 'definition-list'
    | 'dlitem'
    | 'document-title'
    | 'duplicate-id'
    | 'frame-title'
    | 'html-has-lang'
    | 'html-lang-valid'
    | 'image-alt'
    | 'input-image-alt'
    | 'label'
    | 'layout-table'
    | 'link-name'
    | 'list'
    | 'listitem'
    | 'meta-refresh'
    | 'meta-viewport'
    | 'object-alt'
    | 'tabindex'
    | 'td-headers-attr'
    | 'th-has-data-cells'
    | 'valid-lang'
    | 'video-caption'
    | 'video-description'
    | 'custom-controls-labels'
    | 'custom-controls-roles'
    | 'focus-traps'
    | 'focusable-controls'
    | 'heading-levels'
    | 'interactive-element-affordance'
    | 'logical-tab-order'
    | 'managed-focus'
    | 'offscreen-content-hidden'
    | 'use-landmarks'
    | 'visual-order-follows-dom'
    | 'uses-long-cache-ttl'
    | 'total-byte-weight'
    | 'offscreen-images'
    | 'render-blocking-resources'
    | 'unminified-css'
    | 'unminified-javascript'
    | 'unused-css-rules'
    | 'uses-webp-images'
    | 'uses-optimized-images'
    | 'uses-text-compression'
    | 'uses-responsive-images'
    | 'efficient-animated-content'
    | 'appcache-manifest'
    | 'doctype'
    | 'dom-size'
    | 'external-anchors-use-rel-noopener'
    | 'geolocation-on-start'
    | 'no-document-write'
    | 'no-vulnerable-libraries'
    | 'js-libraries'
    | 'no-websql'
    | 'notification-on-start'
    | 'password-inputs-can-be-pasted-into'
    | 'uses-http2'
    | 'uses-passive-event-listeners'
    | 'meta-description'
    | 'http-status-code'
    | 'font-size'
    | 'link-text'
    | 'is-crawlable'
    | 'robots-txt'
    | 'hreflang'
    | 'plugins'
    | 'canonical'
    | 'mobile-friendly'
    | 'structured-data';

  type ScoreDisplayMode =
    | 'binary'
    | 'numeric'
    | 'informative'
    | 'manual'
    | 'not-applicable';

  interface AuditResult {
    id: AuditId;
    title: string;
    description: string;
    score: number;
    scoreDisplayMode: ScoreDisplayMode;
    rawValue: boolean;
    displayValue?: string;
    explanation?: NotYetTyped;
    errorMessage?: NotYetTyped;
    warnings?: NotYetTyped[];
    details?: { [k: string]: NotYetTyped };
    numericValue: number;
  }

  interface TitleIdScore {
    title: string;
    id: string;
    score: number;
    auditRefs: NotYetTyped[];
    manualDescription?: string;
  }

  interface LighthouseReport {
    userAgent: string;
    environment: {
      networkUserAgent: string;
      hostUserAgent: string;
      benchmarkIndex: number;
    };
    lighthouseVersion: string;
    fetchTime: string;
    requestedUrl: string;
    finalUrl: string;
    runWarnings: NotYetTyped[];
    runtimeError: {
      code: string;
      message: string;
    };

    audits: { [name: string]: AuditResult };

    timing: { total: number };

    categories: {
      performance: TitleIdScore;
      pwa: TitleIdScore;
      accessibility: TitleIdScore;
      'best-practices': TitleIdScore;
      seo: TitleIdScore;
      // Our custom categories
      customAccessibility: TitleIdScore;
    };

    // Other misc fields that are not used yet
    configSettings: NotYetTyped;
    categoryGroups: NotYetTyped;
    i18n: {
      rendererFormattedStrings: NotYetTyped;
      icuMessagePaths: NotYetTyped;
    };
  }

  interface LighthouseResult {
    lhr: LighthouseReport;
    artifacts: NotYetTyped;
    report: string;
  }

  const lighthouse: {
    // Signature for the main function
    (
      url: string,
      flags: any,
      perfConfig?: NotYetTyped
    ): Promise<LighthouseResult>;

    // Additional fields on the lighthouse function (unused)
    getAuditList: NotYetTyped;
    traceCategories: NotYetTyped;
    Audit: NotYetTyped;
    Gatherer: NotYetTyped;
  };

  export = lighthouse;
}
