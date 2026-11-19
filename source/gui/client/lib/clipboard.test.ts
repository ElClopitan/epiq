// @vitest-environment jsdom
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {copyToClipboard} from './clipboard';

describe('copyToClipboard', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('uses navigator.clipboard when available', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: {writeText},
			writable: true,
			configurable: true,
		});

		const ok = await copyToClipboard('test value');

		expect(ok).toBe(true);
		expect(writeText).toHaveBeenCalledWith('test value');
	});

	it('falls back to execCommand when navigator.clipboard is missing', async () => {
		// @ts-ignore
		delete navigator.clipboard;

		const execCommand = vi.fn().mockReturnValue(true);
		document.execCommand = execCommand;

		const ok = await copyToClipboard('test value');

		expect(ok).toBe(true);
		expect(execCommand).toHaveBeenCalledWith('copy');
	});

	it('falls back to execCommand when writeText throws', async () => {
		const writeText = vi.fn().mockRejectedValue(new Error('not secure'));
		Object.defineProperty(navigator, 'clipboard', {
			value: {writeText},
			writable: true,
			configurable: true,
		});

		const execCommand = vi.fn().mockReturnValue(true);
		document.execCommand = execCommand;

		const ok = await copyToClipboard('test value');

		expect(ok).toBe(true);
		expect(writeText).toHaveBeenCalledWith('test value');
		expect(execCommand).toHaveBeenCalledWith('copy');
	});

	it('returns false when both methods fail', async () => {
		// @ts-ignore
		delete navigator.clipboard;

		const execCommand = vi.fn().mockReturnValue(false);
		document.execCommand = execCommand;

		const ok = await copyToClipboard('test value');

		expect(ok).toBe(false);
		expect(execCommand).toHaveBeenCalledWith('copy');
	});
});
