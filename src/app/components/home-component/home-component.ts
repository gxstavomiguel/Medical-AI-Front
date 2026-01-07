import { MensagemService } from '../../services/mensagem.service';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SugestoesComponent } from '../../components/sugestoes-component/sugestoes-component';
import { MarkdownModule } from 'ngx-markdown';
import { Chat, ChatService } from '../../services/chat.service';
import { SidebarService } from '../../services/sidebar.service';
import { NgClass, NgIf, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { menuConfig, MenuItem } from '../../interfaces/item-menu.interface';
import { UserRole } from '../../interfaces/user-role.interface';
import { MenuStateService } from '../../services/menu.service';
import { HttpClient } from '@angular/common/http';

interface Message {
  id?: string;
  foi_usuario: boolean;
  text: string;
}

@Component({
  selector: 'app-dashboard-component',
  imports: [FormsModule, MarkdownModule, SugestoesComponent, NgClass, CommonModule, RouterModule],
  templateUrl: './home-component.html',
  styles: [
    `
      :host ::ng-deep .prose {
        color: inherit;
      }
      textarea.chat-input::-webkit-scrollbar {
        width: 4px;
      }

      textarea.chat-input::-webkit-scrollbar-track {
        background: transparent;
      }

      textarea.chat-input::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }

      textarea.chat-input::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      button[type='button'] {
        transition: all 0.2s ease;
      }

      button[type='button']:active {
        transform: scale(0.95);
      }

      .sidebar-scroll::-webkit-scrollbar {
        width: 6px;
      }

      .sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .sidebar-scroll::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 10px;
      }

      .sidebar-scroll::-webkit-scrollbar-thumb:hover {
        background: #d1d5db;
      }

      button[type='button'] {
        transition: all 0.2s ease;
      }

      button[type='button']:active {
        transform: scale(0.95);
      }
    `,
  ],
})
export class HomeComponent implements AfterViewChecked, OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    public auth: AuthService,
    private mensagemService: MensagemService,
    private ngZone: NgZone,
    public chatService: ChatService,
    public sidebarService: SidebarService,
    private router: Router,
    public menuStateService: MenuStateService,
    private http: HttpClient,
  ) {}

  protected firstMessage = true;
  protected aiMode?: 'MODO 1' | 'MODO 2' | 'MODO 3';
  messages: Message[] = [];
  newMessage: string = '';
  newBotMessage: string = '';
  gravando = false;
  recognition: any;
  opcoesSugestao: string[] = ['Casos clínicos', 'Estudar por questões', 'Tirar dúvidas'];
  tituloSugestao: string = 'O que deseja estudar hoje?';
  sidebarAberta = false;
  screenSize = window.innerWidth;

  get userInfo() {
    return this.auth.getUserInfo();
  }

  get userRole(): UserRole | null {
    const role = this.auth.getUserInfo().role;
    return role as UserRole | null;
  }

  ngOnInit(): void {
    this.mensagemService.buscarMensagens().subscribe({
      next: (response) => {
        if (response) {
          response.forEach((mensagem) => {
            this.messages.push({
              id: mensagem.id,
              foi_usuario: mensagem.foi_usuario,
              text: this.sanitizeText(mensagem.texto),
            });
          });
        }
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = newHeight + 'px';
  }

  ngAfterViewInit() {
    if (this.textarea) {
      this.autoResize({ target: this.textarea.nativeElement } as any);
    }
  }

  enviarMensagem() {
    if (this.newMessage.trim() !== '') {
      const sanitized = this.sanitizeText(this.newMessage);
      this.messages.push({ foi_usuario: true, text: sanitized });

      this.mensagemService.enviarMensagem(sanitized, true, new Date().toISOString()).subscribe({
        next: (response) => {},
        error: (error) => {
          console.error('Erro ao salvar mensagem do usuário:', error);
        },
      });

      this.mensagemService.enviarPrompt(sanitized, this.aiMode).subscribe({
        next: async (response) => {
          this.newBotMessage = this.sanitizeText(response.output);
          this.messages.push({ foi_usuario: false, text: this.newBotMessage });

          this.mensagemService
            .enviarMensagem(this.newBotMessage, false, new Date().toISOString())
            .subscribe({
              next: (response) => {},
              error: (error) => {
                console.error('Erro ao salvar mensagem do bot:', error);
              },
            });
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Erro ao enviar prompt: ', err);
        },
      });

      this.newMessage = '';
      this.scrollToBottom();
      this.firstMessage = false;
      this.aiMode = undefined;

      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }

  private scrollToBottom(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        try {
          this.scrollContainer.nativeElement.scrollTo({
            top: this.scrollContainer.nativeElement.scrollHeight,
            behavior: 'smooth',
          });
        } catch {}
      });
    });
  }

  private sanitizeText(text: any): string {
    if (text === null || text === undefined) return '';
    let s = String(text).trim();

    try {
      const parsed = JSON.parse(s);
      if (typeof parsed === 'string') {
        s = parsed.trim();
      }
    } catch {}

    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      s = s.substring(1, s.length - 1).trim();
    }
    s = s.replace(/^[“”]+|[“”]+$/g, '').trim();
    return s;
  }

  logoutFunc() {
    this.auth.logout();
  }

  enviarSugestao(event: string) {
    this.newMessage = event;
    const option = this.newMessage.toLowerCase();

    if (option === 'casos clínicos') this.aiMode = 'MODO 1';
    else if (option === 'estudar por questões') this.aiMode = 'MODO 2';
    else this.aiMode = 'MODO 3';

    this.messages = [];
    this.enviarMensagem();
  }

  toggleGravacao() {
    if (this.gravando) {
      this.pararReconhecimento();
    } else {
      this.iniciarReconhecimento();
    }
  }

  iniciarReconhecimento() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não é suportado neste navegador.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    let ultimoTextoFinal = '';

    this.recognition.onresult = (event: any) => {
      let textoFinal = '';
      let textoParcial = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          textoFinal += transcript + ' ';
        } else {
          textoParcial += transcript;
        }
      }

      this.ngZone.run(() => {
        if (textoFinal && textoFinal.trim() !== ultimoTextoFinal.trim()) {
          this.newMessage = (this.newMessage + ' ' + textoFinal).trim();
          ultimoTextoFinal = textoFinal;
        }
        if (textoParcial) {
          const textoComParcial = (this.newMessage + ' ' + textoParcial).trim();
          this.newMessage = textoComParcial;
        }
      });
    };

    this.recognition.onstart = () => {
      this.ngZone.run(() => (this.gravando = true));
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => (this.gravando = false));
    };

    this.recognition.start();
  }

  pararReconhecimento() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  toggleSidebar(event?: Event) {
    event?.stopPropagation();
    this.sidebarAberta = !this.sidebarAberta;
  }

  closeSidebar() {
    this.sidebarAberta = false;
  }

  novoChat() {
    this.chatService.novoChat();
  }

  toggleUserMenu() {
    this.menuStateService.toggleMenu();
  }

  closeUserMenu() {
    this.menuStateService.closeMenu();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.menuStateService.closeMenu();
  }

  async logout() {
    await this.auth.logout();
    this.menuStateService.closeMenu();
  }

  get userMenuItems(): MenuItem[] {
    const role = this.userRole;
    if (!role) return [];
    return menuConfig.filter((item) => item.roles.includes(role));
  }

  getRoleBadge(): string {
    const role = this.userRole;
    if (role === 'admin') return 'Admin';
    if (role === 'student') return 'Aluno';
    return '';
  }

  getRoleBadgeColor(): string {
    const role = this.userInfo.role;
    if (role === 'admin') {
      return 'bg-[#1AB394]';
    }
    return 'bg-gray-500';
  }

  selecionarChat(chat: Chat) {
    this.chatService.selecionarChat(chat);
  }

  editarNomeChat(event: Event, chat: Chat) {
    event.stopPropagation();

    const novoNome = prompt('Digite o novo nome do chat:', chat.nome);

    if (novoNome && novoNome.trim() !== '') {
      this.chatService.renomearChat(chat.id, novoNome.trim());
    }
  }

  importarArquivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadArquivo(file);
      }
    };

    input.click();
  }

  uploadArquivo(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Substitua pela sua URL de API
    this.http.post('api/chat/upload', formData).subscribe({
      next: (response) => {
        console.log('Upload bem-sucedido', response);
        // Adicionar arquivo ao chat ou fazer outra ação
      },
      error: (error) => {
        console.error('Erro no upload', error);
        alert('Erro ao importar arquivo');
      },
    });
  }
}
