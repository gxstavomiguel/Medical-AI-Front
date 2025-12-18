import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-painel-controle-component',
  standalone: true,
  imports: [NgClass, RouterOutlet],
  templateUrl: './painel-controle-component.html',
})
export class PainelControleComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log('PainelControleComponent initialized');
  }

  sidebarAberta = false;
  itemAtivo = 'Dashboard';

  botoes = [
    { nome: 'Dashboard', icone: 'assets/dashboard.svg', rota: 'dashboard', classe: 'icone-default' },
    { nome: 'Cadastro de Prompts', icone: 'assets/prompt-colored.png', rota: 'cadastro-prompts', classe: 'icone-default' },
    { nome: 'Gerenciamento de Usuários', icone: 'assets/users-sidebar.svg', rota: 'gerenciamento-usuarios', classe: 'icone-users' },
    { nome: 'Gerar Relatórios', icone: 'assets/reports-sidebar.svg', rota: 'gerar-relatorios', classe: 'icone-reports' }
  ];


  navegar(btn: any) {
    this.itemAtivo = btn.nome;
    this.router.navigate([btn.rota], { relativeTo: this.route });

    if (this.isMobile()) this.sidebarAberta = false;
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
    return window.innerWidth < 1024;
  }
}
