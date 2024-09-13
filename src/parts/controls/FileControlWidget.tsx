import React from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";
import { FileAttributeValue, isFileAttributeValue } from '@decisively-io/interview-sdk'
import styled from "styled-components";
import { useFormControl } from "../../FormControl";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import type { FileControl } from "@decisively-io/interview-sdk";
import { useInterviewContext } from "../InterviewContext";
import { UploadFileArg } from "./FileControlWidget_types";


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

const toBase64 = (file: File): Promise< string > => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
  reader.onerror = reject;
});


export interface FileControlWidgetProps extends ControlWidgetProps< FileControl > {

};

export default (p: FileControlWidgetProps) => {
  const { control, chOnScreenData } = p;
  const { uploadFile } = useInterviewContext();

  const hiddenInputRef = React.useRef< HTMLInputElement >(null);
  const triggerAddFile = React.useCallback(() => {
    const { current } = hiddenInputRef;
    if(current === null) return;

    current.click();
  }, []);

  return useFormControl({
    control,
    // className: className,
    onScreenDataChange: chOnScreenData,
    render: ({ onChange, value, forId, error, inlineLabel, renderExplanation }) => {
      const normalizedValue: FileAttributeValue = isFileAttributeValue(value)
        ? value
        : { type: 'file', value: [] };

      const uploadFileHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        (async () => {
          const [file] = (e.currentTarget.files || []) as File[];
          if(!file) return;

          const result = await toBase64(file);
          const uploadaArg: UploadFileArg = {
            data: result,
            name: file.name,
          };

          const uploadRes = await uploadFile(uploadaArg);
          const newRefValue = `data:id=${ uploadRes.reference };base64,${btoa(file.name)}`;
          const nextValue: FileAttributeValue = {
            ...normalizedValue,
            value: normalizedValue.value.concat(newRefValue)
          };

          onChange(nextValue);
        })();
      };

      const deleteFile = (refValue: FileAttributeValue[ 'value' ][0]) => {
        const nextValue: FileAttributeValue = {
          ...normalizedValue,
          value: normalizedValue.value.filter(it => it !== refValue),
        };
        onChange(nextValue);
      }

      return (
        <Wrap>
          <HiddenInput
            type='file'
            ref={ hiddenInputRef }
            onChange={uploadFileHandler}
          />

          <FilesWrap>
            {normalizedValue.value.map(it => {
              const base64Indx = it.indexOf('base64,');
              const nameBase64 = it.slice(base64Indx + 7).trim();

              return (
                <FileRow key={it}>
                  <SmallIconBtn onClick={() => deleteFile(it)}>
                    <DeleteIcon />
                  </SmallIconBtn>

                  <Typography>
                    { atob(nameBase64) }
                  </Typography>
                </FileRow>
              )
            })}
          </FilesWrap>

          <StyledIconButton onClick={triggerAddFile}>
            <AddIcon />
          </StyledIconButton>
        </Wrap>
      );
    },
  });
};
