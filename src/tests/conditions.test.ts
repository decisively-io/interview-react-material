import { resolveCondition, resolveElement } from "../util/Conditions";

describe("Conditions", () => {
  it("1. dates", () => {
    {
      const result = resolveCondition(
        {
          type: "less-than-equals",
          elements: [
            {
              type: "value",
              value: "3",
            },
            {
              type: "value",
              value: "2000-01-01",
            },
          ],
        },
        {},
      );

      expect(result).toBe(false);
    }

    {
      const result = resolveCondition(
        {
          type: "less-than-equals",
          elements: [
            {
              type: "value",
              value: "",
            },
            {
              type: "value",
              value: "2000-01-01",
            },
          ],
        },
        {},
      );

      expect(result).toBe(false);
    }

    {
      const result = resolveElement(
        {
          type: "value",
          value: "AddYears(CurrentDate(), -18)",
        },
        {},
      );

      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      expect(result.toDateString()).toBe(date.toDateString());
    }

    {
      const result = resolveCondition(
        {
          type: "less-than-equals",
          elements: [
            {
              type: "value",
              value: "20",
            },
            {
              type: "value",
              value: "AddYears(CurrentDate(), -18)",
            },
          ],
        },
        {},
      );

      expect(result).toBe(false);
    }

    {
      const result = resolveCondition(
        {
          type: "less-than-equals",
          elements: [
            {
              type: "value",
              value: "2000-01-01",
            },
            {
              type: "value",
              value: "AddYears(CurrentDate(), -18)",
            },
          ],
        },
        {},
      );

      expect(result).toBe(true);
    }

    {
      const result = resolveCondition(
        {
          type: "less-than-equals",
          elements: [
            {
              type: "value",
              value: "2",
            },
            {
              type: "value",
              value: "AddYears(CurrentDate(), -18)",
            },
          ],
        },
        {},
      );

      expect(result).toBe(false);
    }

    {
      const result = resolveCondition(
        {
          type: "equals",
          elements: [
            {
              type: "attribute",
              attributeId: "a",
            },
            {
              type: "value",
              value: "true",
            },
          ],
        },
        { a: true },
      );

      expect(result).toBe(true);
    }
  });
});
