import {useEffect, useRef, useState} from 'react';
import {GUI_THEME} from '../lib/gui-theme';
import {copyToClipboard} from '../lib/clipboard';

export const CopyRef = ({refValue}: {refValue: string}) => {
	const [copied, setCopied] = useState(false);
	const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	useEffect(() => () => clearTimeout(resetTimer.current), []);

	return (
		<button
			type="button"
			data-testid="copy-ref"
			title={`Copy ${refValue}`}
			onClick={async event => {
				event.stopPropagation();

				if (await copyToClipboard(refValue)) {
					setCopied(true);
					clearTimeout(resetTimer.current);
					resetTimer.current = setTimeout(() => setCopied(false), 1_200);
				}
			}}
			style={{
				fontFamily: 'monospace',
				fontSize: 'inherit',
				color: copied ? GUI_THEME.green : GUI_THEME.dim,
				background: 'transparent',
				border: 'none',
				padding: 0,
				cursor: 'pointer',
				transition: 'color 120ms ease',
				userSelect: 'text',
			}}
			onMouseEnter={event => {
				if (!copied) event.currentTarget.style.color = GUI_THEME.accent;
			}}
			onMouseLeave={event => {
				event.currentTarget.style.color = copied
					? GUI_THEME.green
					: GUI_THEME.dim;
			}}
		>
			{copied ? 'Copied!' : refValue}
		</button>
	);
};
