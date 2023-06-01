import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

interface NavigatorConnection {
	effectiveType: string;
	// Add other properties if needed
}

function getConnectionSpeed() {
	return 'connection' in navigator &&
		navigator['connection'] &&
		'effectiveType' in (navigator['connection'] as NavigatorConnection)
		? (navigator['connection'] as NavigatorConnection)['effectiveType']
		: '';
}

interface AnalyticsOptions {
	params: { [s: string]: string } | ArrayLike<string>;
	path: string;
	analyticsId: string;
	debug: boolean;
}

function sendToAnalytics(metric: Metric, options: AnalyticsOptions): void {
	const page = Object.entries(options.params).reduce(
		(acc, [key, value]) => acc.replace(value, `[${key}]`),
		options.path
	);

	const body = {
		dsn: options.analyticsId,
		id: metric.id,
		page,
		href: location.href,
		event_name: metric.name,
		value: metric.value.toString(),
		speed: getConnectionSpeed()
	};

	if (options.debug) {
		console.log('[Web Vitals]', metric.name, JSON.stringify(body, null, 2));
	}

	const blob = new Blob([new URLSearchParams(body).toString()], {
		// This content type is necessary for `sendBeacon`
		type: 'application/x-www-form-urlencoded'
	});
	if (navigator.sendBeacon) {
		navigator.sendBeacon(vitalsUrl, blob);
	} else {
		fetch(vitalsUrl, {
			body: blob,
			method: 'POST',
			credentials: 'omit',
			keepalive: true
		});
	}
}

export function webVitals(options: AnalyticsOptions): void {
	try {
		onFID((metric: Metric) => sendToAnalytics(metric, options));
		onTTFB((metric: Metric) => sendToAnalytics(metric, options));
		onLCP((metric: Metric) => sendToAnalytics(metric, options));
		onCLS((metric: Metric) => sendToAnalytics(metric, options));
		onFCP((metric: Metric) => sendToAnalytics(metric, options));
	} catch (err) {
		console.error('[Web Vitals]', err);
	}
}
