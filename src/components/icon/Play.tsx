import { FunctionalComponent } from "preact";
import { FeatherProps } from "./types";

export const Play: FunctionalComponent<FeatherProps> = (
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
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    );
};