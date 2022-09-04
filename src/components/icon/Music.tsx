import { FunctionalComponent } from "preact";
import { FeatherProps } from "./types";

export const Music: FunctionalComponent<FeatherProps> = (
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
			<path d="M9 18V5l12-2v13"></path>
			<circle cx="6" cy="18" r="3"></circle>
			<circle cx="18" cy="16" r="3"></circle>
		</svg>
	);
};