import {
  type FileAttributeValue,
  getNameFromFileAttributeRef,
  isFileAttributeValue,
} from "@decisively-io/interview-sdk";
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
      const normalizedValue: FileAttributeValue = isFileAttributeValue(value) ? value : { fileRefs: [] };

      const uploadFileHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        (async () => {
          const [file] = (e.currentTarget.files || []) as File[];
          if (!file) return;

          if (normalizedValue.fileRefs.some((it) => getNameFromFileAttributeRef(it) === file.name)) return;

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
            fileRefs: normalizedValue.fileRefs.concat(uploadRes.reference),
          };

          onChange(nextValue);
        })();
      };

      const deleteFile = (refValue: FileAttributeValue["fileRefs"][0]) => {
        (async function removeFileHandler() {
          await removeFile(refValue);

          const nextValue: FileAttributeValue = {
            ...normalizedValue,
            fileRefs: normalizedValue.fileRefs.filter((it) => it !== refValue),
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
            {normalizedValue.fileRefs.map((it) => (
              <FileRow key={it}>
                <SmallIconBtn onClick={() => deleteFile(it)}>
                  <DeleteIcon />
                </SmallIconBtn>

                <Typography>{getNameFromFileAttributeRef(it)}</Typography>
              </FileRow>
            ))}
          </FilesWrap>

          {max <= normalizedValue.fileRefs.length ? null : (
            <StyledIconButton onClick={triggerAddFile}>
              <AddIcon />
            </StyledIconButton>
          )}
        </Wrap>
      );
    },
  });
};
