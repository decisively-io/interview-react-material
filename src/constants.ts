export const DISPLAY_NAME_PREFIX = 'Decisively/Interview';

export const getUnsupportedControlErr = (id: string, control: unknown) : Error => (
  new Error(`interview-react-material | ${ id } | unsupported control: ${ JSON.stringify(control) }`)
);
