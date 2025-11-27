import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptSectionItemComponent } from './prompt-section-item.component';
import { PromptSection, RAGDocument } from '../../interfaces/prompt-section.interface';

const MOCK_DATA: PromptSection[] = [
  {
    id: 1,
    name: 'Casos Clínicos',
    level: 0,
    promptContent: 'Lorem ipsum dolor sit amet consectetur. Facilisi elementum imperdiet elementum dolor. Tortor at integer sed duis nisl...',
    ragDocuments: [
      { id: 101, name: 'Documento 1' },
      { id: 102, name: 'Documento 2' },
      { id: 103, name: 'Documento 3' },
    ],
    children: [
      {
        id: 11,
        name: 'Resumo de Caso para Discussão',
        level: 1,
        promptContent: 'Lorem ipsum dolor sit amet consectetur. Facilisi elementum imperdiet elementum dolor. Tortor at integer sed duis nisl...',
        ragDocuments: [],
        children: [],
        isExpanded: false,
        isEditingName: false,
        isAddingChild: false,
        isConfiguringPrompt: false,
        isConfiguringRAG: false,
        newChildName: '',
        newPromptContent: '',
      },
      {
        id: 12,
        name: 'Resumo científico',
        level: 1,
        promptContent: 'Lorem ipsum dolor sit amet consectetur. Facilisi elementum imperdiet elementum dolor. Tortor at integer sed duis nisl...',
        ragDocuments: [],
        children: [],
        isExpanded: false,
        isEditingName: false,
        isAddingChild: false,
        isConfiguringPrompt: false,
        isConfiguringRAG: false,
        newChildName: '',
        newPromptContent: '',
      },
    ],
    isExpanded: true,
    isEditingName: false,
    isAddingChild: false,
    isConfiguringPrompt: false,
    isConfiguringRAG: false,
    newChildName: '',
    newPromptContent: '',
  },
];

@Component({
  selector: 'app-cadastro-prompts',
  standalone: true,
  imports: [CommonModule, FormsModule, PromptSectionItemComponent],
  templateUrl: './cadastro-prompts-component.html'

})
export class CadastroPromptsComponent implements OnInit {






  editablePrompt: string = '';
  promptFiles: File[] = [];













  promptSections: PromptSection[] = [];
  nextId = 100;

  isPromptModalOpen = false;
  isRAGModalOpen = false;
  isViewMoreModalOpen = false;
  currentSection: PromptSection | null = null;

  baseColor = 'bg-[#19AA79]';
  baseColorHover = 'hover:bg-[#158a62]';

  ngOnInit(): void {
    this.promptSections = MOCK_DATA.map(section => this.initializeSection(section));
  }

  private initializeSection(section: PromptSection): PromptSection {
    section.isExpanded = section.isExpanded ?? false;
    section.isEditingName = section.isEditingName ?? false;
    section.isAddingChild = section.isAddingChild ?? false;
    section.isConfiguringPrompt = section.isConfiguringPrompt ?? false;
    section.isConfiguringRAG = section.isConfiguringRAG ?? false;
    section.newChildName = section.newChildName ?? '';
    section.newPromptContent = section.newPromptContent ?? section.promptContent;
    section.children = section.children.map(child => this.initializeSection(child));
    return section;
  }

  toggleExpand(section: PromptSection): void {
    section.isExpanded = !section.isExpanded;
  }

  addNewTheme(): void {
    if (this.promptSections.some(s => s.isEditingName && s.id === 0)) {
      return;
    }

    const newTheme: PromptSection = {
      id: 0,
      name: '',
      level: 0,
      promptContent: '',
      ragDocuments: [],
      children: [],
      isExpanded: true,
      isEditingName: true,
      isAddingChild: false,
      isConfiguringPrompt: false,
      isConfiguringRAG: false,
      newChildName: '',
      newPromptContent: '',
    };
    this.promptSections.unshift(newTheme);
  }

  addChildSection(parent: PromptSection): void {
    parent.children.forEach(child => child.isAddingChild = false);

    const newChild: PromptSection = {
      id: 0, // ID temporário
      name: '',
      level: parent.level + 1,
      promptContent: '',
      ragDocuments: [],
      children: [],
      isExpanded: true,
      isEditingName: true,
      isAddingChild: false,
      isConfiguringPrompt: false,
      isConfiguringRAG: false,
      newChildName: '',
      newPromptContent: '',
    };

    parent.children.unshift(newChild);
    parent.isExpanded = true;
  }

  startEditName(section: PromptSection): void {
    section.isEditingName = true;
  }

  saveName(section: PromptSection): void {
    if (section.name.trim() === '') {
      return;
    }

    section.name = section.name.trim();
    section.isEditingName = false;

    if (section.id === 0) {
      this.openPromptModal(section);
    }
  }

  cancelEditName(event: { section: PromptSection, parent: PromptSection | null }): void {
    const { section, parent } = event;
    if (section.id === 0) {
      if (parent) {
        parent.children = parent.children.filter(c => c !== section);
      } else {
        this.promptSections = this.promptSections.filter(s => s !== section);
      }
    } else {
      section.isEditingName = false;
    }
  }

  deleteSection(event: { section: PromptSection, parent: PromptSection | null }): void {
    const { section, parent } = event;
    if (confirm(`Tem certeza que deseja excluir a seção "${section.name}" e todos os seus subtemas?`)) {
      if (parent) {
        parent.children = parent.children.filter(c => c.id !== section.id);
      } else {
        this.promptSections = this.promptSections.filter(s => s.id !== section.id);
      }
    }
  }

  openPromptModal(section: PromptSection): void {
    this.currentSection = section;
    this.isPromptModalOpen = true;
    this.currentSection.newPromptContent = this.currentSection.promptContent;
  }

  savePrompt(): void {
    if (this.currentSection) {
      this.currentSection.promptContent = this.currentSection.newPromptContent;
      if (this.currentSection.id === 0) {
        this.currentSection.id = this.nextId++;
      }
    }
    this.closePromptModal();
  }

  closePromptModal(): void {
    this.isPromptModalOpen = false;
    this.currentSection = null;
  }

  openRAGModal(section: PromptSection): void {
    this.currentSection = section;
    this.isRAGModalOpen = true;
  }

  closeRAGModal(): void {
    this.isRAGModalOpen = false;
    this.currentSection = null;
  }

  addRAGDocument(): void {
    if (this.currentSection) {
      const newDoc: RAGDocument = {
        id: this.nextId++,
        name: `Novo Documento ${this.currentSection.ragDocuments.length + 1}`,
      };
      this.currentSection.ragDocuments.push(newDoc);
    }
  }

  deleteRAGDocument(doc: RAGDocument): void {
    if (this.currentSection) {
      this.currentSection.ragDocuments = this.currentSection.ragDocuments.filter(d => d.id !== doc.id);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.currentSection) {
      Array.from(input.files).forEach(file => {
        const newDoc: RAGDocument = {
          id: this.nextId++,
          name: file.name,
        };
        this.currentSection!.ragDocuments.push(newDoc);
      });
      input.value = '';
    }
  }

  openViewMoreModal(section: PromptSection): void {
    this.currentSection = section;
    this.isViewMoreModalOpen = true;
  }

  closeViewMoreModal(): void {
    this.isViewMoreModalOpen = false;
    this.currentSection = null;
  }

  getPadding(level: number): string {
    return `pl-${level * 4}`;
  }

  // Método para salvar os arquivos RAG
  saveRAGFiles() {

  }
}
