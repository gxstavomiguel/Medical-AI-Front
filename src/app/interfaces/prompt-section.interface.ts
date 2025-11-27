export interface RAGDocument {
  id: number;
  name: string;
}

export interface PromptSection {
  id: number;
  name: string;
  level: number; // 0 para Tema, 1 para Subtema, etc.
  promptContent: string;
  ragDocuments: RAGDocument[];
  children: PromptSection[];

  // Propriedades de estado da UI (para o componente)
  isExpanded: boolean;
  isEditingName: boolean;
  isAddingChild: boolean;
  isConfiguringPrompt: boolean;
  isConfiguringRAG: boolean;
  newChildName: string;
  newPromptContent: string;
}
