export function matchesCronExpression(
  expression: string,
  date: Date = new Date(),
): boolean {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return false;
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const values = {
    minute: date.getUTCMinutes(),
    hour: date.getUTCHours(),
    dayOfMonth: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    dayOfWeek: date.getUTCDay(),
  };

  return (
    matchesCronField(minute, values.minute, 0, 59) &&
    matchesCronField(hour, values.hour, 0, 23) &&
    matchesCronField(dayOfMonth, values.dayOfMonth, 1, 31) &&
    matchesCronField(month, values.month, 1, 12) &&
    matchesCronField(dayOfWeek, values.dayOfWeek, 0, 6)
  );
}

function matchesCronField(
  field: string,
  value: number,
  min: number,
  max: number,
): boolean {
  if (field === "*") {
    return true;
  }

  return field.split(",").some((part) => {
    if (part.includes("/")) {
      const [base, stepRaw] = part.split("/");
      const step = Number(stepRaw);
      if (!Number.isFinite(step) || step <= 0) {
        return false;
      }
      const start = base === "*" ? min : Number(base);
      return value >= start && (value - start) % step === 0;
    }

    if (part.includes("-")) {
      const [startRaw, endRaw] = part.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);
      return value >= start && value <= end;
    }

    return Number(part) === value;
  });
}
