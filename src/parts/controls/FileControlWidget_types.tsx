export type UploadFileArg = {
  /** file name, e.g. "test.txt" */
  name: string;
  /** file contents presented as data uri, e.g. "data:text/plain;base64,qweasdzxc" */
  data: string
};
export type UploadFileRtrn = {
  /**
   * @example 'd07f40fd-230f-416c-9e19-a70332a506df'
   */
  reference: string;
}
export type UploadFile = (arg: UploadFileArg) => Promise< UploadFileRtrn >;
