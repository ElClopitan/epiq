import {describe, expect, it} from 'vitest';
import {failed, succeeded} from '../../lib/model/result-types.js';
import {resultJson, withoutEcho} from '../server.js';

describe('mcp server helpers', () => {
	it('answers a success with its message and value, compactly', () => {
		const result = resultJson(
			succeeded('Listed issues', [{id: 'issue-1', title: 'Fix bug'}]),
		);

		expect(result.isError).toBe(false);
		expect(result.content).toHaveLength(1);
		expect(result.content[0]?.type).toBe('text');
		expect(result.content[0]?.text).toBe(
			'{"message":"Listed issues","value":[{"id":"issue-1","title":"Fix bug"}]}',
		);
	});

	it('answers a failure with its message, as an MCP error', () => {
		const result = resultJson(failed('Unable to locate issue'));

		expect(result.isError).toBe(true);
		expect(JSON.parse(result.content[0]?.text ?? '{}')).toEqual({
			message: 'Unable to locate issue',
		});
	});
});

describe('withoutEcho', () => {
	it('replaces description with length on success', async () => {
		const fn = async () =>
			succeeded('Edited', {
				id: 'issue-1',
				description: 'A long description here',
			});
		const wrapped = withoutEcho(fn, 'description');
		const result = await wrapped({} as any);
		expect(result.value).toEqual({id: 'issue-1', length: 23});
	});

	it('replaces body with length on success', async () => {
		const fn = async () =>
			succeeded('Commented', {id: 'comment-1', body: 'Hello world'});
		const wrapped = withoutEcho(fn, 'body');
		const result = await wrapped({} as any);
		expect(result.value).toEqual({id: 'comment-1', length: 11});
	});

	it('passes through failures unchanged', async () => {
		const fn = async () => failed('Not found');
		const wrapped = withoutEcho(fn, 'body');
		const result = await wrapped({} as any);
		expect(result).toEqual(failed('Not found'));
	});
});
