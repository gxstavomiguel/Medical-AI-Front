import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptSection } from '../../interfaces/prompt-section.interface';

@Component({
  selector: 'app-prompt-section-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-section-item.component.html',
})
export class PromptSectionItemComponent {
  @Input({ required: true }) section!: PromptSection;
  @Input() parent: PromptSection | null = null;
  @Input({ required: true }) baseColor!: string;
  @Input({ required: true }) baseColorHover!: string;

  @Output() addChild = new EventEmitter<PromptSection>();
  @Output() startEditName = new EventEmitter<PromptSection>();
  @Output() saveName = new EventEmitter<PromptSection>();
  @Output() cancelEditName = new EventEmitter<{ section: PromptSection, parent: PromptSection | null }>();
  @Output() deleteSection = new EventEmitter<{ section: PromptSection, parent: PromptSection | null }>();
  @Output() openPromptModal = new EventEmitter<PromptSection>();
  @Output() openRAGModal = new EventEmitter<PromptSection>();
  @Output() openViewMoreModal = new EventEmitter<PromptSection>();

  toggleExpand(): void {
    this.section.isExpanded = !this.section.isExpanded;
  }

  onAddChild(): void {
    this.addChild.emit(this.section);
  }

  onStartEditName(): void {
    this.startEditName.emit(this.section);
  }

  onSaveName(): void {
    this.saveName.emit(this.section);
  }

  onCancelEditName(): void {
    this.cancelEditName.emit({ section: this.section, parent: this.parent });
  }

  onDeleteSection(): void {
    this.deleteSection.emit({ section: this.section, parent: this.parent });
  }

  onOpenPromptModal(): void {
    this.openPromptModal.emit(this.section);
  }

  onOpenRAGModal(): void {
    this.openRAGModal.emit(this.section);
  }

  onOpenViewMoreModal(): void {
    this.openViewMoreModal.emit(this.section);
  }

  getPadding(): string {
    const paddingMap: { [key: number]: string } = {
      0: 'pl-0',
      1: 'pl-8',
      2: 'pl-16',
      3: 'pl-24',
    };
    return paddingMap[this.section.level] || `pl-${this.section.level * 8}`;
  }

  get isTheme(): boolean {
    return this.section.level === 0;
  }
}
