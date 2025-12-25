export interface Webhook {
  id: string;
  url: string;
  events: ("publish" | "update" | "delete")[];
  secret: string;
  active: boolean;
  createdAt: number;
}
