// Clipboard utilities with fallback for plain-http contexts.
// navigator.clipboard requires a secure context (https or localhost);
// on plain-http LAN hosts it is unavailable, so we fall back to
// the deprecated execCommand('copy') path.

export const copyToClipboard = async (value: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		// navigator.clipboard is missing or writeText threw (plain http).
	}

	// Fallback: hidden textarea + execCommand('copy'). Works on plain http.
	try {
		const textarea = document.createElement('textarea');
		textarea.value = value;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(textarea);
		return ok;
	} catch {
		return false;
	}
};
