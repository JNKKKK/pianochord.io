import { JSX } from 'preact';

export interface FeatherProps extends JSX.SVGAttributes<SVGSVGElement> {
    color?: string;
    size?: number;
}