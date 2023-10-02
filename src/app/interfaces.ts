export interface INavigation {
  name: string;
  url: string;
}

export interface INotification {
  httpCode: number;
  internalCode: number;
  title: string;
  message: string;
  options?: {
    value: string;
    fn?: any;
    route?: string;
  }[];
}

export interface IServerResponse {
  httpCode: number;
  status: string;
  internalCode: string;
  userMessage: string;
  token?: string;
  data?: string;
  error?: string;
}
