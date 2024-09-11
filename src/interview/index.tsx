export { default as Frame, type FrameProps } from "./Frame";
export { default as Interview, type InterviewProps, InterviewContext } from "./Interview";
export { default as Menu, type MenuProps } from "./Menu";
export * as Font from "../font";
export { default as Content, type ContentProps } from "./Content";
export * as Themes from "../themes";
export { default as Controls } from "./controls";

/**
 * @deprecated - use `Interview` instead
 */
export { default as Root, type InterviewProps as RootProps } from "./Interview";

// these are needed because when we use this lib in project with
// module not set to cjs, it starts importing other entities, and
// breaks references. So useFormContext inported in consumer project !== useFormContext
// that is compatible wth this repo
// that's why we reexport same exact functions that are referentially equal to
// react-hook-form build used in this repo
export {
  useFormContext,
  useFieldArray,
  useForm,
  useController,
  useWatch,
  useFormState,
  FormProvider,
  Controller,
  appendErrors,
  get,
  set,
} from "react-hook-form";

export * from "./chat";
