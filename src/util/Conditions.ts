import { ConditionExpression, ConditionValue } from "@decisively-io/interview-sdk";

const ADD_TIME_REGEXS = {
  years: /add-?years\(([^,]+),\s*(-?\d+)\)/i,
  months: /add-?months\(([^,]+),\s*(-?\d+)\)/i,
  days: /add-?days\(([^,]+),\s*(-?\d+)\)/i,
};
const CURRENT_DATE_REGEX = /current-?date\(\)/i;
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

export const resolveElement = (element: ConditionExpression | ConditionValue, values: any): any => {
  if (element.type === "current-date") {
    return new Date();
  }

  if ("elements" in element) {
    const resolvedElements = element.elements.map((element: any) => resolveElement(element, values));
    if (element.type === "and") {
      return resolvedElements.every((condition: any) => Boolean(condition));
    }
    if (element.type === "or") {
      return resolvedElements.every((condition: any) => Boolean(condition));
    }
    if (element.type === "plus") {
      return resolvedElements.reduce((acc: any, value: any) => acc + value, 0);
    }
    if (element.type === "multiply") {
      return resolvedElements.reduce((acc: any, value: any) => acc * value, 0);
    }
    if (element.type === "divide") {
      return resolvedElements.reduce((acc: any, value: any) => acc / value, 0);
    }
    const [left, right] = resolvedElements;

    if (left instanceof Date || right instanceof Date) {
      // not both dates
      if (!(left instanceof Date && right instanceof Date)) {
        if (element.type === "not-equals") {
          return true;
        }
        return false;
      }
    }

    switch (element.type) {
      case "equals":
        return left?.toString() === right?.toString();
      case "not-equals":
        return left?.toString() !== right?.toString();
      case "greater-than":
        return left > right;
      case "greater-than-equals":
        return left >= right;
      case "less-than":
        return left < right;
      case "less-than-equals":
        return left <= right;
    }

    return false;
  }

  let resolvedValue = undefined;

  if (element.type === "attribute") {
    // @ts-ignore
    resolvedValue = values[element.attributeId];
  } else {
    resolvedValue = element.value;
  }
  if (typeof resolvedValue === "string") {
    // maybe date?
    const isDate = DATE_REGEX.test(resolvedValue);
    if (isDate) {
      resolvedValue = new Date(resolvedValue);
    } else {
      for (const [timeType, regex] of Object.entries(ADD_TIME_REGEXS)) {
        const match = regex.exec(resolvedValue as any);
        if (match) {
          const [, datePath, amount] = match as any;
          if (!Number.isNaN(amount)) {
            const resolvedDate: unknown = CURRENT_DATE_REGEX.test(datePath)
              ? new Date()
              : resolveElement(
                  {
                    type: "attribute",
                    attributeId: datePath,
                  },
                  values,
                );
            if (resolvedDate instanceof Date) {
              if (timeType === "days") {
                resolvedDate.setDate(resolvedDate.getDate() + parseInt(amount, 10));
              } else if (timeType === "months") {
                resolvedDate.setMonth(resolvedDate.getMonth() + parseInt(amount, 10));
              } else {
                resolvedDate.setFullYear(resolvedDate.getFullYear() + parseInt(amount, 10));
              }
              resolvedValue = resolvedDate;
            }
          }
        }
      }
    }
  }

  return resolvedValue;
};

export const resolveCondition = (condition: ConditionExpression, values: any): boolean => {
  return Boolean(resolveElement(condition, values));
};
