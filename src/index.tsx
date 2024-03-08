import { Root, type RootProps } from "./parts";

/*** @deprecated */
export * as Parts from "./parts";

export const Interview = Root;
export type InterviewProps = RootProps;
export { default as Content, ContentProps } from "./parts/Content";
export { default as Menu, MenuProps } from "./parts/Menu";
export { default as Frame, FrameProps } from "./parts/Frame";

export * as types from "./util";
export { default as Controls } from "./parts/controls";
