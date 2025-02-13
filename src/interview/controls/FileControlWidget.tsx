import {
  type FileAttributeValue,
  getNameFromFileAttributeRef,
  isFileAttributeValue,
} from "@decisively-io/interview-sdk";
import type { FileControl, FileCtrlTypesNS } from "@decisively-io/interview-sdk";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import styled, { keyframes } from "styled-components";
import { useFormControl } from "../../FormControl";
import { useInterviewContext } from "../../providers/InterviewContext";
import { RotatingCachedIcon } from "../../util";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import { DownloadFileButton } from "./DownloadFileButton";

const StyledDownloadFileButton = styled(DownloadFileButton)`
  width: 1.25rem;
  height: 1.25rem;
  margin-top: -0.375rem;
  margin-left: 0.5rem;
`;
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

const AddIconButton = styled(IconButton)`
  &, svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
const SmallIconBtn = styled(IconButton)`
  &, svg {
    width: 1rem;
    height: 1rem;
  }
`;

const BottomWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
const SelectFileTypography = styled(Typography)`
  font-size: 0.875rem;
`;
const AddIconAndTextsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = reject;
  });

export type FileControlWidgetProps = ControlWidgetProps<FileControl>;

type LoadingState = { type: "idle" } | { type: "add" } | { type: "remove"; ref: FileAttributeValue["fileRefs"][0] };

export default (p: FileControlWidgetProps) => {
  const { control, chOnScreenData } = p;
  const { file_type, max = 1, max_size } = control;
  const { session, enclosedSetState } = useInterviewContext();

  const [isLoading, setIsLoadingRaw] = React.useState<LoadingState>({ type: "idle" });
  const setIsLoading = React.useCallback(
    (v: LoadingState) => {
      setIsLoadingRaw(v);

      const btnDisabled = v.type !== "idle";
      enclosedSetState({ backDisabled: btnDisabled, nextDisabled: btnDisabled });
    },
    [setIsLoadingRaw, enclosedSetState],
  );

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
      console.log("FILE CONTROL", value);

      const uploadFileHandler: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
        (async () => {
          try {
            const [file] = (currentTarget.files || []) as File[];
            if (!file) return;

            if (normalizedValue.fileRefs.some((it) => getNameFromFileAttributeRef(it) === file.name)) return;

            if (max_size !== undefined && max_size * 1_000_000 < file.size) {
              return void session.onFileTooBig(file);
            }

            setIsLoading({ type: "add" });
            const result = await toBase64(file);
            const uploadaArg: FileCtrlTypesNS.UploadFileArg = {
              data: result,
              name: file.name,
            };

            const uploadRes = await session.uploadFile(uploadaArg);
            const nextValue: FileAttributeValue = {
              ...normalizedValue,
              fileRefs: normalizedValue.fileRefs.concat(uploadRes.reference),
            };

            onChange(nextValue);
            // clear file input so that we can select the same file again (if necessary)
            currentTarget.value = "";
          } catch (e) {
            console.error("B63GW6NYcM | interview-react-material error, FileControlWidget, uploadFileHandler:", e);
          } finally {
            setIsLoading({ type: "idle" });
          }
        })();
      };

      const deleteFile = (refValue: FileAttributeValue["fileRefs"][0]) => {
        (async function removeFileHandler() {
          try {
            setIsLoading({ type: "remove", ref: refValue });

            await session.removeFile(refValue);

            const nextValue: FileAttributeValue = {
              ...normalizedValue,
              fileRefs: normalizedValue.fileRefs.filter((it) => it !== refValue),
            };
            onChange(nextValue);
          } catch (e) {
            console.error("IIZXKueFeb | interview-react-material error, FileControlWidget, deleteFile:", e);
          } finally {
            setIsLoading({ type: "idle" });
          }
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
                {!control.readOnly && (
                  <SmallIconBtn onClick={() => deleteFile(it)}>
                    {isLoading.type === "remove" && isLoading.ref === it ? <RotatingCachedIcon /> : <DeleteIcon />}
                  </SmallIconBtn>
                )}
                <Typography>{getNameFromFileAttributeRef(it)}</Typography>
                <StyledDownloadFileButton
                  reference={it}
                  hideName={true}
                />
              </FileRow>
            ))}
          </FilesWrap>

          {!control.readOnly && (
            <BottomWrap>
              {max <= normalizedValue.fileRefs.length ? null : (
                <AddIconAndTextsWrap>
                  <SelectFileTypography>Select a file to upload</SelectFileTypography>

                  <AddIconButton onClick={triggerAddFile}>
                    {isLoading.type === "add" ? <RotatingCachedIcon /> : <AttachFileIcon />}
                  </AddIconButton>
                </AddIconAndTextsWrap>
              )}
              {max <= 1 ? null : (
                <Typography variant="caption">
                  {normalizedValue.fileRefs.length} of {max} files (maximum)
                </Typography>
              )}

              {error === undefined || error.message === undefined ? null : (
                <FormHelperText error>{error.message}</FormHelperText>
              )}
            </BottomWrap>
          )}
        </Wrap>
      );
    },
  });
};
