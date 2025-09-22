import type { NodeTypes } from "@xyflow/react";
import GetTextNode from "./GetTextNode";

export const getTextNodeTypeKey = "get-text";

export const workflowNodeTypes: NodeTypes = {
  [getTextNodeTypeKey]: GetTextNode,
};


