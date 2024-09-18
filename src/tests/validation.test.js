//import { generateValidator } from "../util/Validation";

describe("Validation", () => {
  xit("1. check control validation", async () => {
    const controls = [
      {
        id: "957bd85f-dce3-40f5-bcb0-cdb191bc8e07",
        type: "typography",
        text: "value: 12",
        style: "body1",
        templateText: "value: {{numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/c817df3b-5674-4d72-9340-417c38789728}}",
        dynamicAttributes: ["numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/c817df3b-5674-4d72-9340-417c38789728"],
      },
      {
        id: "e9907189-cf83-4362-b68c-c715f4729257",
        type: "text",
        required: true,
        attribute: "numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/c817df3b-5674-4d72-9340-417c38789728",
        label: "the number's value",
        showExplanation: false,
        value: "12",
      },
      {
        id: "16d77cfc-e842-4b5f-a5f6-bf3d27ff8817",
        createdAt: 1709905106272,
        type: "switch_container",
        attribute: "numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/07712027-6266-422f-a74f-1fca0dab2d13",
        kind: "dynamic",
        condition: {
          type: "equals",
          elements: [
            {
              type: "attribute",
              attributeId: "07712027-6266-422f-a74f-1fca0dab2d13",
            },
            {
              type: "value",
              value: null,
            },
          ],
        },
        outcome_true: [
          {
            id: "394c56bd-fc0b-48cb-a972-bfd31ffdf55a",
            createdAt: 1709905218073,
            type: "switch_container",
            attribute: "numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/00d22f36-31db-49d7-ad00-95840e40f55b",
            kind: "dynamic",
            condition: {
              type: "equals",
              elements: [
                {
                  type: "attribute",
                  attributeId: null,
                },
                {
                  type: "value",
                  value: null,
                },
              ],
            },
            outcome_true: [
              {
                id: "8e4dfd8e-55fb-40de-ade5-433f94a1201a",
                type: "typography",
                text: "I'll let you have this number be above 5, for now.",
                style: "banner-yellow",
              },
            ],
            outcome_false: [
              {
                id: "5380278c-e3dc-42ec-84b0-cd3d705f1155",
                type: "typography",
                text: "You've been warned about this. Number's over 5 DO NOT exist.",
                style: "banner-red",
              },
            ],
            dynamicAttributes: ["numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/00d22f36-31db-49d7-ad00-95840e40f55b"],
            branch: "false",
          },
          {
            id: "90514a6f-66c3-438b-8450-bfc20d2614ce",
            type: "text",
            required: true,
            attribute: "numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/e0bddd71-d294-49bd-b760-c1381233cdad",
            label: "Explain yourself",
            showExplanation: false,
          },
        ],
        dynamicAttributes: ["numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/07712027-6266-422f-a74f-1fca0dab2d13"],
        branch: "true",
      },
      {
        id: "957bd85f-dce3-40f5-bcb0-cdb191bc8e07",
        type: "typography",
        text: "value: 5",
        style: "body1",
        templateText: "value: {{numbers/fcbede94-59c1-438e-9c49-20963ac03095/c817df3b-5674-4d72-9340-417c38789728}}",
        dynamicAttributes: ["numbers/fcbede94-59c1-438e-9c49-20963ac03095/c817df3b-5674-4d72-9340-417c38789728"],
      },
      {
        id: "e9907189-cf83-4362-b68c-c715f4729257",
        type: "text",
        required: true,
        attribute: "numbers/fcbede94-59c1-438e-9c49-20963ac03095/c817df3b-5674-4d72-9340-417c38789728",
        label: "the number's value",
        showExplanation: false,
        value: "5",
      },
      {
        id: "16d77cfc-e842-4b5f-a5f6-bf3d27ff8817",
        createdAt: 1709905106272,
        type: "switch_container",
        attribute: "numbers/fcbede94-59c1-438e-9c49-20963ac03095/07712027-6266-422f-a74f-1fca0dab2d13",
        kind: "dynamic",
        condition: {
          type: "equals",
          elements: [
            {
              type: "attribute",
              attributeId: "07712027-6266-422f-a74f-1fca0dab2d13",
            },
            {
              type: "value",
              value: null,
            },
          ],
        },
        outcome_true: [
          {
            id: "394c56bd-fc0b-48cb-a972-bfd31ffdf55a",
            createdAt: 1709905218073,
            type: "switch_container",
            attribute: "numbers/fcbede94-59c1-438e-9c49-20963ac03095/00d22f36-31db-49d7-ad00-95840e40f55b",
            kind: "dynamic",
            condition: {
              type: "equals",
              elements: [
                {
                  type: "attribute",
                  attributeId: null,
                },
                {
                  type: "value",
                  value: null,
                },
              ],
            },
            outcome_true: [
              {
                id: "8e4dfd8e-55fb-40de-ade5-433f94a1201a",
                type: "typography",
                text: "I'll let you have this number be above 5, for now.",
                style: "banner-yellow",
              },
            ],
            outcome_false: [
              {
                id: "5380278c-e3dc-42ec-84b0-cd3d705f1155",
                type: "typography",
                text: "You've been warned about this. Number's over 5 DO NOT exist.",
                style: "banner-red",
              },
            ],
            dynamicAttributes: ["numbers/fcbede94-59c1-438e-9c49-20963ac03095/00d22f36-31db-49d7-ad00-95840e40f55b"],
            branch: "false",
          },
          {
            id: "90514a6f-66c3-438b-8450-bfc20d2614ce",
            type: "text",
            required: true,
            attribute: "numbers/fcbede94-59c1-438e-9c49-20963ac03095/e0bddd71-d294-49bd-b760-c1381233cdad",
            label: "Explain yourself",
            showExplanation: false,
          },
        ],
        dynamicAttributes: ["numbers/fcbede94-59c1-438e-9c49-20963ac03095/07712027-6266-422f-a74f-1fca0dab2d13"],
        branch: "false",
      },
      {
        id: "507241f4-48a2-456e-85b5-341b31a09ab7",
        type: "typography",
        text: "=",
        style: "body1",
      },
      {
        id: "624545be-81dd-4ace-a0f7-6b517ccf1bad",
        type: "typography",
        text: "the answer is 17",
        style: "banner-green",
        templateText: "the answer is {{5cb42d4e-486e-4e87-8136-b8ca49e30702}}",
        dynamicAttributes: ["5cb42d4e-486e-4e87-8136-b8ca49e30702"],
      },
      {
        id: "9ac9937b-6e8c-440e-959f-160871d67c29",
        createdAt: 1709732102358,
        type: "switch_container",
        condition: {
          type: "greater-than",
          elements: [
            {
              type: "attribute",
              attributeId: "5cb42d4e-486e-4e87-8136-b8ca49e30702",
            },
            {
              type: "value",
              value: "12",
            },
          ],
        },
        outcome_true: [
          {
            id: "e78cf4a1-eb9c-4c4b-afea-9a3ba00787cb",
            type: "typography",
            text: "bigger than 18",
            style: "body1",
          },
        ],
        outcome_false: [
          {
            id: "316ad423-9b2e-4372-9de6-59a28b3dd1a7",
            type: "typography",
            text: "less than 18",
            style: "body1",
          },
        ],
        kind: "dynamic",
        attribute: "86159399-996a-49e9-89d1-d3214dc71594",
        dynamicAttributes: ["86159399-996a-49e9-89d1-d3214dc71594"],
        branch: "false",
      },
    ];
    const validator = generateValidator(controls);
    const result = await validator({});
    expect(result).toEqual({
      values: {},
      errors: {
        "numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/c817df3b-5674-4d72-9340-417c38789728": {
          message: "Please fill out this field",
          type: "withRequired",
          ref: undefined,
        },
        "numbers/1900d1f2-ccf7-41fb-8209-310a789c4413/e0bddd71-d294-49bd-b760-c1381233cdad": {
          message: "Please fill out this field",
          type: "withRequired",
          ref: undefined,
        },
        "numbers/fcbede94-59c1-438e-9c49-20963ac03095/c817df3b-5674-4d72-9340-417c38789728": {
          message: "Please fill out this field",
          type: "withRequired",
          ref: undefined,
        },
      },
    });
  });
});
