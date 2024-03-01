import { ConditionExpression, ConditionValue, ConditionalContainerControl } from "@decisively-io/interview-sdk";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { resolveCondition } from "../../util/Conditions";
import { DISPLAY_NAME_PREFIX } from "./ControlConstants";
import { ControlWidgetProps } from "./ControlWidgetTypes";
import RenderControl from "./RenderControl";
import { ControlComponents } from "./index";

export interface ConditionalContainerControlWidgetProps extends ControlWidgetProps<ConditionalContainerControl> {
  controlComponents: ControlComponents;
  className?: string;
}

const ConditionalContainerControlWidget = React.memo((props: ConditionalContainerControlWidgetProps) => {
  const { control, chOnScreenData, controlComponents, className } = props;
  const { controls, condition } = control;
  const [visible, setVisible] = useState(false);

  const { watch, getValues } = useFormContext();
  useEffect(() => {
    const updateVisibility = (values: any) => {
      const visible = condition && resolveCondition(condition, values);
      setVisible(Boolean(visible));
    };
    const subscription = watch(updateVisibility);
    updateVisibility(getValues());
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {visible
        ? controls.map((value, controlIndex) => {
            return <RenderControl chOnScreenData={chOnScreenData} key={controlIndex} control={value} controlComponents={controlComponents} />;
          })
        : null}
    </>
  );
});

ConditionalContainerControlWidget.displayName = `${DISPLAY_NAME_PREFIX}/ConditionalContainer`;

export default ConditionalContainerControlWidget;
