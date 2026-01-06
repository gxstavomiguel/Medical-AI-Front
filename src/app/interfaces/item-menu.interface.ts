import { UserRole } from './user-role.interface';

export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  roles: UserRole[];
  divider?: boolean;
}

export const menuConfig: MenuItem[] = [
  {
    label: 'Home',
    path: '/home',
    icon: 'home',
    roles: ['student', 'admin'],
  },
  {
    label: 'Dashboard',
    path: '/painel-controle/dashboard',
    icon: 'dashboard',
    roles: ['admin'],
  },
  {
    label: 'Cadastro de Prompts',
    path: '/painel-controle/cadastro-prompts',
    icon: 'dashboard',
    roles: ['admin'],
  },
  {
    label: 'Gerenciamento de Usuários',
    path: '/painel-controle/gerenciamento-usuarios',
    icon: 'dashboard',
    roles: ['admin'],
  },
  {
    label: 'Gerar Relatórios',
    path: '/painel-controle/gerar-relatorios',
    icon: 'dashboard',
    roles: ['admin'],
  },
  // {
  //   label: 'Meu Perfil',
  //   path: '/perfil',
  //   icon: 'person',
  //   roles: ['student', 'admin'],
  // },
  {
    label: 'Trocar Senha',
    path: '/nova-senha',
    icon: 'lock',
    roles: ['student', 'admin'],
    divider: true,
  },
];
