import { FunctionalComponent } from "preact";
import { FeatherProps } from "./types";

export const Move: FunctionalComponent<FeatherProps> = (
	props: FeatherProps
) => {
	const color = props.color || 'currentColor';
	const size = props.size || 24;
	delete props.color;
	delete props.size;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			{...props}
		>
			<polyline points="5 9 2 12 5 15"></polyline>
			<polyline points="9 5 12 2 15 5"></polyline>
			<polyline points="15 19 12 22 9 19"></polyline>
			<polyline points="19 9 22 12 19 15"></polyline>
			<line x1="2" y1="12" x2="22" y2="12"></line>
			<line x1="12" y1="2" x2="12" y2="22"></line>
		</svg>
	);
};