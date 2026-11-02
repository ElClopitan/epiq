// crypto.randomUUID only exists in a secure context (HTTPS or localhost).
// The GUI is often opened over plain HTTP on the LAN (e.g. http://pi5.local),
// where calling it throws "crypto.randomUUID is not a function". These ids
// only key optimistic placeholders until the server state replaces them, so
// they just need to be unique within the page.
let counter = 0;

export const placeholderId = (prefix: string): string => {
	const c = globalThis.crypto;
	if (typeof c?.randomUUID === 'function') return `${prefix}-${c.randomUUID()}`;
	if (typeof c?.getRandomValues === 'function') {
		const bytes = c.getRandomValues(new Uint8Array(16));
		const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(
			'',
		);
		return `${prefix}-${hex}`;
	}

	counter += 1;
	return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random()
		.toString(36)
		.slice(2)}`;
};
