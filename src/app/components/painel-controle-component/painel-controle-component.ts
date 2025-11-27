import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-painel-controle-component',
  standalone: true,
  imports: [NgClass, RouterOutlet],
  templateUrl: './painel-controle-component.html',
})
export class PainelControleComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  sidebarAberta = false;
  itemAtivo = 'Dashboard';

  botoes = [
    { nome: 'Dashboard', icone: 'assets/grafico.png', rota: 'dashboard' },
    { nome: 'Cadastro de Prompts', icone: 'assets/prompt.png', rota: 'cadastro-prompts' },
    {
      nome: 'Gerenciamento de Usuários',
      icone: 'assets/usuarios.png',
      rota: 'gerenciamento-usuarios',
    },
    { nome: 'Gerar Relatórios', icone: 'assets/relatorio.png', rota: 'gerar-relatorios' },
  ];

  navegar(btn: any) {
    this.itemAtivo = btn.nome;
    this.router.navigate([btn.rota], { relativeTo: this.route });

    if (this.isMobile()) this.sidebarAberta = false; // fecha no mobile após clicar
  }

  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.sidebarAberta = !this.sidebarAberta;
  }

  manterSidebarAberta(event: Event) {
    event.stopPropagation();
  }

  fecharSidebar(event: Event) {
    if (this.isMobile()) {
      this.sidebarAberta = false;
    }
  }

  isMobile() {
    return window.innerWidth < 1024; // lg breakpoint do Tailwind
  }
}
