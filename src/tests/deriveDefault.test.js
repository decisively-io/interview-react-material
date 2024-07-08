import { deriveDefaultControlsValue } from "@decisively-io/interview-sdk";

describe("derive default", () => {
  it("1. works with multiple entities", () => {
    const defaults = deriveDefaultControlsValue([
      {
        id: "fe222c57-0fb8-448c-af1f-9d7dda1946bb",
        type: "entity",
        template: [
          {
            id: "52d3c995-447c-4f61-a710-89e590d6dbbc",
            type: "boolean",
            required: true,
            attribute: "ed884fd4-5558-4c08-869c-ec2ed26f7902",
            label: "the entity attribute",
            default: true,
            value: true,
          },
          {
            id: "7c53a0cd-0d70-44f7-b440-209fc9be9423",
            type: "boolean",
            required: true,
            attribute: "2413dd88-d1f4-4cb7-a013-bb71ea2b9415",
            label: "the entity other attribute",
            default: true,
            value: true,
          },
        ],
        label: "entities",
        display: "vertical",
        entity: "entities",
        value: [
          {
            "@id": "156bb4d6-ac89-4808-9154-bb1643883e31",
            "ed884fd4-5558-4c08-869c-ec2ed26f7902": false,
          },
        ],
      },
    ]);

    expect(defaults).toEqual({
      entities: [
        {
          "@id": "156bb4d6-ac89-4808-9154-bb1643883e31",
          "ed884fd4-5558-4c08-869c-ec2ed26f7902": false,
          "2413dd88-d1f4-4cb7-a013-bb71ea2b9415": true,
        },
      ],
    });
  });
});
