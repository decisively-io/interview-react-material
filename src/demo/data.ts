import type { Session } from "@decisively-io/interview-sdk";
import { defaultStep } from "../parts";

const controls: Session[ 'screen' ][ 'controls' ] = [
  {
      id: "c30b7058-a5e8-4a4c-a79f-b654d8f8b639",
      type: "typography",
      text: "Income collection",
      style: "h5"
  },
  {
      id: "099c3e87-371f-4e63-a6de-e16367ac955c",
      createdAt: 1713152587723,
      version: 2,
      kind: "static",
      type: "repeating_container",
      entity: "entity_name",
      controls: [
          {
              id: "d6aeff69-0259-4a86-8f29-b5fecdd776a4",
              createdAt: 1713153007079,
              version: 2,
              kind: "dynamic",
              type: "switch_container",
              attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/c233b7f5-2d55-4493-a973-57384aee57b6",
              outcome_true: [
                  {
                      id: "c906d2a8-6833-440c-8d22-46bbc0f09578",
                      type: "typography",
                      text: "Text:",
                      style: "body1"
                  },
                  {
                      attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/adfac4ea-cc01-4ccd-83f3-0b7e837c4be3",
                      label: "LLabel",
                      default: "Weekly",
                      id: "5bbbcd69-6ffc-44e4-bc64-90e17e093929",
                      type: "options",
                      value: "Weekly",
                      options: [
                          {
                              label: "Weekly",
                              value: "Weekly"
                          },
                          {
                              label: "Fortnightly",
                              value: "Fortnightly"
                          },
                          {
                              label: "Monthly",
                              value: "Monthly"
                          }
                      ]
                  },
                  {
                      id: "18276ecf-b26e-4862-9818-ae9918fb39f0",
                      type: "currency",
                      attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/ff661699-7843-4625-afcb-504a8e733481",
                      label: "Amount",
                      default: 509.62,
                      showExplanation: false,
                      value: 509.62
                  }
              ],
              dynamicAttributes: [
                  "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/c233b7f5-2d55-4493-a973-57384aee57b6"
              ],
              branch: "true"
          },
          {
              id: "6dda8b56-4af0-46c5-ad71-d9b44878a52c",
              createdAt: 1713153007079,
              version: 2,
              kind: "dynamic",
              type: "switch_container",
              outcome_true: [
                  {
                      id: "c4e00981-ccbf-4578-b23f-2a43dcdbc475",
                      type: "typography",
                      text: "For Income:",
                      style: "body1"
                  },
                  {
                      attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/4d312149-2ae6-422b-9128-060e95974701",
                      label: "For income fr",
                      default: "",
                      id: "67365225-0035-407b-9db2-b4b834b0cd3a",
                      type: "options",
                      value: "",
                      options: [
                          {
                              label: "Weekly",
                              value: "Weekly"
                          },
                          {
                              label: "Fortnightly",
                              value: "Fortnightly"
                          },
                          {
                              label: "Monthly",
                              value: "Monthly"
                          }
                      ]
                  },
                  {
                      id: "4baf5955-46c2-4c29-bfb9-94777974639a",
                      type: "currency",
                      attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/e49bd62d-ffd5-4cd6-99b0-d17639a9fdf8",
                      label: "For income a",
                      default: 0,
                      symbol: "AUD",
                      showExplanation: false,
                      value: 0
                  }
              ],
              attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/ffd3f0ef-48b0-4db1-a239-9439f6d16ffd",
              dynamicAttributes: [
                  "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/ffd3f0ef-48b0-4db1-a239-9439f6d16ffd"
              ],
              branch: "false"
          },
          {
              id: "76393203-6b4a-4809-b010-310c71a0d763",
              createdAt: 1713153007079,
              version: 2,
              kind: "dynamic",
              type: "switch_container",
              outcome_true: [
                  {
                      id: "a042b3ef-27f4-40ef-aafa-7e543d2ca1a2",
                      type: "typography",
                      text: "Real:",
                      style: "body1"
                  },
                  {
                      attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/f53af0af-aad0-4aca-9327-5dad875e2953",
                      label: "Real fr",
                      default: "weekly",
                      id: "07d815b7-702c-42e2-a8e5-0bd0368b9601",
                      type: "options",
                      value: "weekly",
                      options: [
                          {
                              label: "Weekly",
                              value: "Weekly"
                          },
                          {
                              label: "Fortnightly",
                              value: "Fortnightly"
                          },
                          {
                              label: "Monthly",
                              value: "Monthly"
                          }
                      ]
                  },
                  {
                      id: "8d4bffe4-c055-421b-b17a-da90318d25c2",
                      type: "currency",
                      attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/e3bfc319-4229-476b-8c6d-47fac7eb143e",
                      label: "Real a",
                      default: 0,
                      symbol: "AUD",
                      showExplanation: false,
                      value: 0
                  }
              ],
              attribute: "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/ca05a1e4-5cad-41bc-8b2a-121dc8675692",
              dynamicAttributes: [
                  "individual/1/entity_name/99417e72-b985-4fd7-bc67-6df842da0af1/ca05a1e4-5cad-41bc-8b2a-121dc8675692"
              ],
              branch: "false"
          },
      ],
      isFirst: true
  }
];

export const session: Session = {
  data: { "@parent": "" } as any,
  explanations: {
    textEmailOrNumberAttr21: "hi",
  },
  screen: {
    id: "screen1",
    title: "Screen 1",
    controls,
  },
  context: { entity: "" },
  sessionId: "",
  status: "in-progress",
  steps: [
    {
      ...defaultStep,
      visited: true,
      id: "1",
      title: "Flight details",
      steps: [
        {
          ...defaultStep,
          id: "1.1",
          title: "Welcome",
          visited: true,
        },
        {
          ...defaultStep,
          id: "1.2",
          title: "Itinerary",
          current: true,
        },
        {
          ...defaultStep,
          id: "1.3",
          title: "Grievance",
        },
        {
          ...defaultStep,
          id: "1.4",
          title: "Airline",
        },
        {
          ...defaultStep,
          id: "1.5",
          title: "Distance",
        },
      ],
    },
    {
      ...defaultStep,
      id: "2",
      title: "What happened?",
      steps: [
        {
          ...defaultStep,
          id: "2.2",
          title: "What happened 2?",
        },
        {
          ...defaultStep,
          id: "2.3",
          title: "What happened 3?",
        },
        {
          ...defaultStep,
          id: "2.4",
          title: "What happened 4?",
        },
      ],
    },
    {
      ...defaultStep,
      id: "3",
      title: "Outcome?",
    },
  ],
};
