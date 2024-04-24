import type { RenderableControl } from "@decisively-io/interview-sdk";
import { describe, expect, test } from "@jest/globals";
import { deriveDefaultControlsValue } from "../../core";

describe("repeating_container", () => {
  test("properly derives default values", () => {
    const controls: RenderableControl[] = [
      {
        id: "id1",
        type: "typography",
        text: "TextId1",
        style: "h5",
      },
      {
        id: "id2",
        version: 2,
        type: "repeating_container",
        entity: "EntityId2",
        controls: [
          {
            id: "id3",
            version: 2,
            kind: "dynamic",
            type: "switch_container",
            attribute: "AttributeId3",
            outcome_true: [
              {
                id: "id4",
                type: "typography",
                text: "TextId4",
                style: "body1",
              },
              {
                id: "id5",
                attribute: "AttributeId5",
                label: "LabelId5",
                default: "Weekly",
                type: "options",
                value: "Weekly",
                options: [
                  {
                    label: "Weekly",
                    value: "Weekly",
                  },
                  {
                    label: "Fortnightly",
                    value: "Fortnightly",
                  },
                  {
                    label: "Monthly",
                    value: "Monthly",
                  },
                ],
              },
              {
                id: "id6",
                type: "currency",
                attribute: "AttributeId6",
                label: "LabelId6",
                default: 509.62,
                showExplanation: false,
                value: 509.62,
              },
            ],
            outcome_false: [],
            dynamicAttributes: ["id3"],
            branch: "true",
          },
        ],
        isFirst: true,
      },
    ];

    const value = deriveDefaultControlsValue(controls);
    expect(value).toStrictEqual({ AttributeId5: "Weekly", AttributeId6: 509.62 });
  });
});
