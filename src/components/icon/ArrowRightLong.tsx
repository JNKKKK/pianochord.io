import { FunctionalComponent } from "preact";
import { FeatherProps } from "./types";

export const ArrowRightLong: FunctionalComponent<FeatherProps> = (
    props: FeatherProps
) => {
    const color = props.color || 'currentColor';
    const size = props.size || 24;
    delete props.color;
    delete props.size;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size * 2}
            height={size}
            viewBox="0 0 48 24"
            fill="none"
            stroke={color}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...props}
        >
            <line x1="5" y1="12" x2="43" y2="12"></line>
            <polyline points="30 5 43 12 30 19"></polyline>
        </svg>
    );
};