import { type FileAttributeValue, isFileAttributeValue } from "@decisively-io/interview-sdk";
import type { FileControl } from "@decisively-io/interview-sdk";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import { useInterviewContext } from "../InterviewContext";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import type { UploadFileArg, UploadFileRtrn } from "./FileControlWidget_types";

//# region base64Utils

/**
 * taken from https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem \
 *
 * original examples from mdn:
 *    __bytesToBase64(new TextEncoder().encode("a Ā 𐀀 文 🦄")); // "YSDEgCDwkICAIOaWhyDwn6aE"
 *    new TextDecoder().decode(__base64ToBytes("YSDEgCDwkICAIOaWhyDwn6aE")); // "a Ā 𐀀 文 🦄"
 */
function __base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
}

// function __bytesToBase64(bytes: Uint8Array) {
//   const binString = Array.from(bytes, b => String.fromCodePoint(b) ).join("");
//   return btoa(binString);
// }

// slightly tweaked and more usable encode/decode methods

// const encodeToBase64 = (jsStr: string) => __bytesToBase64(new TextEncoder().encode(jsStr));
const decodeFromBase64 = (base64Str: string) => new TextDecoder().decode(__base64ToBytes(base64Str));

//# endregion

const getNameFromRef = (ref: UploadFileRtrn["reference"]) => {
  const base64Indx = ref.indexOf("base64,");
  const nameBase64 = ref.slice(base64Indx + 7).trim();

  return decodeFromBase64(nameBase64);
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilesWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FileRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const StyledIconButton = styled(IconButton)`
  align-self: flex-start;
`;
const SmallIconBtn = styled(IconButton)`
  &, svg {
    width: 1rem;
    height: 1rem;
  }
`;

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = reject;
  });

export type FileControlWidgetProps = ControlWidgetProps<FileControl>;

export default (p: FileControlWidgetProps) => {
  const { control, chOnScreenData } = p;
  const { file_type, max = 1, max_size } = control;
  const { uploadFile, onFileTooBig, removeFile } = useInterviewContext();

  const hiddenInputRef = React.useRef<HTMLInputElement>(null);
  const triggerAddFile = React.useCallback(() => {
    const { current } = hiddenInputRef;
    if (current === null) return;

    current.click();
  }, []);

  return useFormControl({
    control,
    // className: className,
    onScreenDataChange: chOnScreenData,
    render: ({ onChange, value, forId, error, inlineLabel, renderExplanation }) => {
      const normalizedValue: FileAttributeValue = isFileAttributeValue(value) ? value : { type: "file", value: [] };

      const uploadFileHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        (async () => {
          const [file] = (e.currentTarget.files || []) as File[];
          if (!file) return;

          if (normalizedValue.value.some((it) => getNameFromRef(it) === file.name)) return;

          if (max_size !== undefined && max_size * 1_000_000 < file.size) {
            return void onFileTooBig(file);
          }

          const result = await toBase64(file);
          const uploadaArg: UploadFileArg = {
            data: result,
            name: file.name,
          };

          const uploadRes = await uploadFile(uploadaArg);
          const nextValue: FileAttributeValue = {
            ...normalizedValue,
            value: normalizedValue.value.concat(uploadRes.reference),
          };

          onChange(nextValue);
        })();
      };

      const deleteFile = (refValue: FileAttributeValue["value"][0]) => {
        (async function removeFileHandler() {
          await removeFile(refValue);

          const nextValue: FileAttributeValue = {
            ...normalizedValue,
            value: normalizedValue.value.filter((it) => it !== refValue),
          };
          onChange(nextValue);
        })();
      };

      return (
        <Wrap>
          <HiddenInput
            type="file"
            ref={hiddenInputRef}
            onChange={uploadFileHandler}
            accept={file_type === undefined || file_type.length === 0 ? undefined : file_type.join(", ")}
          />

          <FilesWrap>
            {normalizedValue.value.map((it) => (
              <FileRow key={it}>
                <SmallIconBtn onClick={() => deleteFile(it)}>
                  <DeleteIcon />
                </SmallIconBtn>

                <Typography>{getNameFromRef(it)}</Typography>
              </FileRow>
            ))}
          </FilesWrap>

          {max <= normalizedValue.value.length ? null : (
            <StyledIconButton onClick={triggerAddFile}>
              <AddIcon />
            </StyledIconButton>
          )}
        </Wrap>
      );
    },
  });
};
