import type { AttributeValues, InterviewProvider, RenderableInterviewContainerControl, RenderableRepeatingContainerControl, SessionInstance } from "@decisively-io/interview-sdk";
import clsx from "clsx";
import React from "react";
import { NestedInterviewContainer, StyledControlsWrap } from "../Content";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import type { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import type { ControlComponents } from "./index";
import Controls from "./index";
import { CLASS_NAMES } from "../../Constants";

export interface InterviewContainerControlWidgetProps extends ControlWidgetProps<RenderableInterviewContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

const InterviewContainerWidget = React.memo((props: InterviewContainerControlWidgetProps) => {

  const { control, chOnScreenData, controlComponents, className, interviewProvider } = props;
  const { interviewRef } = control;

  const [ session, setSession ] = React.useState<SessionInstance | null>(null);

  console.log("====> interview_container control", control);

  React.useEffect(() => {

    if (interviewProvider && interviewRef) {
      (async () => {
        try {
          const res = await interviewProvider.create(
            interviewRef.projectId,
            {
              interview: interviewRef.interviewId,
              initialData: {},
              // release: TODO,
              // debug: false,
            },
            () => {console.log("198: interviewProvider.create callback")}
          );

          console.log("====> interviewProvider.create", res);
          setSession(res);
        } catch (e) {
          console.error("====> interview_container Error creating interview", e);
        }
      })();
    } else {
      console.log("====> interview_container control: no interviewProvider or interviewRef");
      console.log("====> interview_container control: interviewProvider", interviewProvider);
      console.log("====> interview_container control: interviewRef", interviewRef);
    }
  }, [interviewProvider, interviewRef]);

  // -- session mgmt

  const onDataChange = (data: AttributeValues, name: string | undefined) => {
    console.log("asdasdads");
  }

  // -- rendering

  return (
    <NestedInterviewContainer
      data-id={control.id}
      data-loading={(control as any).loading ? "true" : undefined}
    >
      <StyledControlsWrap
        className={CLASS_NAMES.CONTENT.FORM_CONTROLS}
      >
        interview goes here!
        <Controls
          interviewProvider={null as any} // need to catch if we're self-referencing as that'll cause an infinite nest
          // interviewProvider={interviewProvider}
          controlComponents={controlComponents}
          controls={session?.screen?.controls || []}
          chOnScreenData={onDataChange}
        />
      </StyledControlsWrap>
    </NestedInterviewContainer>
  );
});

InterviewContainerWidget.displayName = `${DISPLAY_NAME_PREFIX}/InterviewContainer`;

export default InterviewContainerWidget;
