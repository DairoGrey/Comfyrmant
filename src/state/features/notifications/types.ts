export enum Severity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export type Notification = {
  id: string;
  severity: Severity;
  text: string;
};
