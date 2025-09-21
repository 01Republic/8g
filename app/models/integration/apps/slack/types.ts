export interface ExtensionStatus {
  installed: boolean;
  version: string | null;
}

export interface SlackWorkspace {
  elementId: string;
  elementText: string;
  timestamp?: string;
}

export interface SlackMember {
  email: string;
  status: "active" | "inactive";
  joinDate: string;
}


