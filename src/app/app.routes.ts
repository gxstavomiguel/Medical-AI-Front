import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { NovaSenhaComponent } from './pages/nova-senha-component/nova-senha-component';
import { LoginGuard } from './guards/login.guard';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { HomeComponent } from './pages/home-component/home-component';
import { LayoutHomeComponent } from './components/layout-home-component/layout-home-component';
import { PainelControleComponent } from './components/painel-controle-component/painel-controle-component';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: LoginComponent,
    canActivate: [publicGuard],
  },

  {
    path: 'nova-senha',
    component: NovaSenhaComponent,
  },

  {
    path: '',
    component: LayoutHomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
    ],
  },

  {
    path: 'painel-controle',
    component: PainelControleComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard-component/dashboard-component')
            .then(m => m.DashboardComponent),
      },

      {
        path: 'cadastro-prompts',
        loadComponent: () =>
          import('./pages/cadastro-prompts-component/cadastro-prompts-component')
            .then(m => m.CadastroPromptsComponent),
      },

      {
        path: 'gerenciamento-usuarios',
        loadComponent: () =>
          import('./pages/gerenciamento-usuarios-component/gerenciamento-usuarios-component')
            .then(m => m.GerenciamentoUsuariosComponent),
      },

      {
        path: 'gerar-relatorios',
        loadComponent: () =>
          import('./pages/gerar-relatorios-component/gerar-relatorios-component')
            .then(m => m.GerarRelatoriosComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
