export interface RAGDocument {
  id: number;
  name: string;
}

export interface PromptSection {
  id: number;
  name: string;
  level: number;
  promptContent: string;
  ragDocuments: RAGDocument[];
  children: PromptSection[];
  isExpanded: boolean;
  isViewingDetails: boolean;
  isEditingName: boolean;
  isAddingChild: boolean;
  isConfiguringPrompt: boolean;
  isConfiguringRAG: boolean;
  newChildName: string;
  newPromptContent: string;
}
