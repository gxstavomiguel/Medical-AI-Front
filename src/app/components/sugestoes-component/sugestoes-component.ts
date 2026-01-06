import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sugestoes-component',
  imports: [],
  templateUrl: './sugestoes-component.html'
})
export class SugestoesComponent {
  titulo = input<string>('O que deseja estudar?');
  opcoes = input<string[]>(['Casos clínicos', 'Estudar por questões', 'Tirar dúvidas']);
  eventoClick = output<string>();

  emitir(opcao: string) {
    this.eventoClick.emit(opcao);
  }
}
