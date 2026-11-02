import {afterEach, describe, expect, it, vi} from 'vitest';
import {placeholderId} from './placeholder-id';

describe('a placeholder id', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('carries its prefix', () => {
		expect(placeholderId('placeholder-comment')).toMatch(
			/^placeholder-comment-/,
		);
	});

	it('is made without crypto.randomUUID, as on a page served over plain HTTP', () => {
		vi.stubGlobal('crypto', {
			getRandomValues: globalThis.crypto.getRandomValues.bind(
				globalThis.crypto,
			),
		});
		const a = placeholderId('p');
		const b = placeholderId('p');
		expect(a).toMatch(/^p-[0-9a-f]{32}$/);
		expect(a).not.toBe(b);
	});

	it('is made with no crypto at all', () => {
		vi.stubGlobal('crypto', undefined);
		expect(placeholderId('p')).not.toBe(placeholderId('p'));
	});
});
