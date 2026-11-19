import {useEffect, useRef, useState} from 'react';
import {IconButton, ICON_SIZE} from './IconButton';
import {IconCheck} from './IconCheck';
import {IconCopy} from './IconCopy';
import {copyToClipboard} from '../lib/clipboard';

// Icon-only: what it copies lives in the tooltip, and the button stays lit for
// a moment with a tick once it has copied.
export const CopyButton = ({
	value,
	title = `Copy ${value}`,
	testId,
}: {
	value: string;
	title?: string;
	testId: string;
}) => {
	const [copied, setCopied] = useState(false);
	const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	useEffect(() => () => clearTimeout(resetTimer.current), []);

	return (
		<IconButton
			testId={testId}
			title={copied ? 'Copied!' : title}
			pressed={copied}
			onClick={async event => {
				event.stopPropagation();

				if (await copyToClipboard(value)) {
					setCopied(true);
					clearTimeout(resetTimer.current);
					resetTimer.current = setTimeout(() => setCopied(false), 1_200);
				}
			}}
		>
			{copied ? <IconCheck size={ICON_SIZE} /> : <IconCopy size={ICON_SIZE} />}
		</IconButton>
	);
};
