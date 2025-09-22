export interface ExtensionStatus {
  installed: boolean;
  version: string | null;
}

export interface NotionWorkspace {
  elementText: string;
  elementXPath: string;
}

export interface NotionMember {
  email: string;
  status: "active";
  joinDate: null;
}