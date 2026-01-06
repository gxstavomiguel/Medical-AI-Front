import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PromptSection } from '../../interfaces/prompt-section.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prompt-section-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-section-item-component.html',
})
export class PromptSectionItemComponent implements OnInit, OnDestroy {
  @Input({ required: true }) section!: PromptSection;
  @Input() parent: PromptSection | null = null;
  @Input({ required: true }) baseColor!: string;
  @Input({ required: true }) baseColorHover!: string;
  @Input() isMobile: boolean = false;

  @Output() addChild = new EventEmitter<PromptSection>();
  @Output() startEditName = new EventEmitter<PromptSection>();
  @Output() saveName = new EventEmitter<PromptSection>();
  @Output() cancelEditName = new EventEmitter<{
    section: PromptSection;
    parent: PromptSection | null;
  }>();
  @Output() deleteSection = new EventEmitter<{
    section: PromptSection;
    parent: PromptSection | null;
  }>();
  @Output() openPromptModal = new EventEmitter<PromptSection>();
  @Output() openRAGModal = new EventEmitter<PromptSection>();

  ngOnInit(): void {
    this.checkIfMobile();
  }

  ngOnDestroy(): void {}

  @HostListener('window:resize')
  onResize(): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768;
    }
  }

  getTruncatedName(): string {
    const maxLength = this.isMobile ? 25 : 40;
    if (this.section.name.length <= maxLength) {
      return this.section.name;
    }
    return this.section.name.substring(0, maxLength) + '...';
  }

  toggleExpand(): void {
    this.section.isExpanded = !this.section.isExpanded;
  }

  toggleViewDetails(): void {
    this.section.isViewingDetails = !this.section.isViewingDetails;
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

  getPaddingValue(): number {
    if (this.isTheme) {
      return 0;
    }

    let depth = 0;
    let current = this.parent;
    while (current) {
      depth++;
      current = (current as any).parent;
    }

    return depth * 20;
  }

  get isTheme(): boolean {
    return this.section.level === 0;
  }
}
