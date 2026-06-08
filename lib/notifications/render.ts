import type { RenderVariables } from "./types";

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;

export function renderNotificationContent(
  template: string,
  variables: RenderVariables,
): string {
  return template.replace(VARIABLE_PATTERN, (_match, key: string) => {
    const value = variables[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function renderNotificationSubject(
  subject: string | undefined,
  variables: RenderVariables,
): string | undefined {
  if (!subject) {
    return undefined;
  }
  return renderNotificationContent(subject, variables);
}
