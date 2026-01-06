import { Injectable, signal } from '@angular/core';

export interface Chat {
  id: number;
  nome: string;
  criadoEm: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatsSignal = signal<Chat[]>([]);
  chats = this.chatsSignal.asReadonly();

  private chatAtualSignal = signal<Chat | null>(null);
  chatAtual = this.chatAtualSignal.asReadonly();

  private contador = 1;

  novoChat() {
    const novo = {
      id: this.contador++,
      nome: `Chat ${this.contador - 1}`,
      criadoEm: new Date(),
    };
    this.chatsSignal.update((chats) => [...chats, novo]);

    this.selecionarChat(novo);
  }

  selecionarChat(chat: Chat) {
    this.chatAtualSignal.set(chat);
  }

  limparChatAtual() {
    this.chatAtualSignal.set(null);
  }

  renomearChat(id: number, novoNome: string) {
    this.chatsSignal.update((chats) =>
      chats.map((chat) => (chat.id === id ? { ...chat, nome: novoNome } : chat)),
    );
  }
}
