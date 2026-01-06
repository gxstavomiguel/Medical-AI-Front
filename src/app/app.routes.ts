import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { NovaSenhaComponent } from './components/nova-senha-component/nova-senha-component';
import { HomeComponent } from './components/home-component/home-component';
import { PainelControleComponent } from './components/painel-controle-component/painel-controle-component';
import { HeaderComponent } from './components/header-component/header-component';
import { authGuard, publicGuard } from './guards/auth.guard';
import { changePasswordGuard } from './guards/change-password.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'nova-senha',
    component: NovaSenhaComponent,
    canActivate: [changePasswordGuard],
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },

  {
    path: 'painel-controle',
    component: HeaderComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['professor', 'admin'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard-component/dashboard-component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'cadastro-prompts',
        loadComponent: () =>
          import('./components/cadastro-prompts-component/cadastro-prompts-component').then(
            (m) => m.CadastroPromptsComponent,
          ),
      },
      {
        path: 'gerenciamento-usuarios',
        loadComponent: () =>
          import(
            './components/gerenciamento-usuarios-component/gerenciamento-usuarios-component'
          ).then((m) => m.GerenciamentoUsuariosComponent),
      },
      {
        path: 'gerar-relatorios',
        loadComponent: () =>
          import('./components/gerar-relatorios-component/gerar-relatorios-component').then(
            (m) => m.GerarRelatoriosComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
