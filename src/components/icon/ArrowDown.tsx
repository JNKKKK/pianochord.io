import { FunctionalComponent } from "preact";
import { FeatherProps } from "./types";

export const ArrowDown: FunctionalComponent<FeatherProps> = (
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
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<polyline points="19 12 12 19 5 12"></polyline>
		</svg>
	);
};