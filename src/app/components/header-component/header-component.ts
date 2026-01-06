import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuStateService } from '../../services/menu.service';
import { menuConfig, MenuItem } from '../../interfaces/item-menu.interface';
import { UserRole } from '../../interfaces/user-role.interface';

interface MenuButton {
  nome: string;
  icone: string;
  rota: string;
  classe?: string;
  classeAberta?: string;
  classeFechada?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="h-screen w-full flex relative overflow-hidden">
      @if (sidebarAberta && isMobile()) {
        <div class="fixed inset-0 bg-black/40 z-40 lg:hidden" (click)="fecharSidebar($event)"></div>
      }

      <div
        id="sidebar"
        class="fixed lg:relative left-0 top-0 h-full z-50 bg-white border-r border-gray-200 text-black p-4 flex flex-col gap-5 transition-all duration-300"
        [ngClass]="{
          '-translate-x-full': !sidebarAberta && isMobile(),
          'translate-x-0': sidebarAberta && isMobile(),
          'w-0': !sidebarAberta && isMobile(),
          'w-64': sidebarAberta && isMobile(),
          'w-24': !sidebarAberta && !isMobile(),
          'w-58': sidebarAberta && !isMobile(),
        }"
        (click)="manterSidebarAberta($event)"
      >
        <div class="flex items-center justify-center h-8 mt-1.5 lg:mt-0">
          <img
            [src]="sidebarAberta ? 'assets/logo2.png' : 'assets/logo3.png'"
            (click)="toggleSidebar($event)"
            class="cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-3 mt-3">
          @for (btn of botoes; track btn.nome) {
            <button
              (click)="navegar(btn)"
              class="flex items-center gap-3 p-2 rounded transition-colors w-full h-12"
              [ngClass]="itemAtivo === btn.nome ? 'bg-gray-300' : 'hover:bg-gray-200'"
            >
              <img
                [src]="btn.icone"
                [ngClass]="[
                  sidebarAberta ? btn.classeAberta || 'w-8 h-8' : btn.classeFechada || 'w-8 h-8',
                  btn.classe || '',
                ]"
                class="shrink-0 object-contain"
              />

              @if (sidebarAberta) {
                <span class="text-sm font-medium flex-1 text-left block">
                  {{ btn.nome }}
                </span>
              }
            </button>
          }
        </div>
      </div>

      <div class="flex-1 flex flex-col min-h-screen bg-slate-50">
        <header
          class="w-full bg-linear-to-r from-[#19AA79] to-[#148b63] text-white h-18 flex items-center justify-between px-6 shadow-sm z-20"
        >
          <button
            class="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center"
            (click)="toggleSidebar($event)"
          >
            <img src="assets/menu.png" class="w-6 h-6 brightness-0 invert" alt="Menu" />
          </button>

          <div class="hidden lg:block"></div>

          <button
            (click)="toggleUserMenu()"
            class="ml-auto group flex items-center gap-3 focus:outline-none"
          >
            <div
              class="w-10 h-10 rounded-full border-2 border-white/30 group-hover:border-white transition-all p-0.5 shadow-sm"
            >
              <img
                [src]="userInfo.avatar || 'assets/user.png'"
                class="w-full h-full rounded-full object-cover"
                [alt]="userInfo.name || 'User'"
              />
            </div>
          </button>
        </header>

        <div
          class="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center px-8"
        >
          <h1 class="font-montserrat text-2xl font-bold text-gray-800 tracking-tight">
            {{ itemAtivo }}
          </h1>
        </div>

        <main class="flex-1 bg-white overflow-auto">
          <div class="p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>

    @if (menuStateService.isUserMenuOpen()) {
      <div
        class="fixed inset-0 z-9998"
        (click)="closeUserMenu()"
        style="background: transparent"
      ></div>

      <div
        class="fixed top-[60px] right-6 w-60 sm:w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-9999 overflow-hidden"
      >
        <div
          class="px-4 py-3 bg-linear-to-r from-[#19AA79]/10 to-[#148b63]/10 border-b border-gray-200"
        >
          <div class="flex items-center gap-3">
            <img
              [src]="userInfo.avatar || 'assets/user.png'"
              class="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
              [alt]="userInfo.name"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ userInfo.name || 'Usuário' }}
              </p>
              <p class="text-xs text-gray-600 truncate">{{ userInfo.email }}</p>
            </div>
          </div>
          <div class="mt-2">
            <span
              [class]="getRoleBadgeColor()"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
            >
              {{ getRoleBadge() }}
            </span>
          </div>
        </div>

        <div class="py-1 max-h-[70vh] overflow-y-auto">
          @for (item of userMenuItems; track item.path) {
            <button
              (click)="navigateTo(item.path)"
              class="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[#19AA79]/5 active:bg-gray-100 transition-colors"
            >
              {{ item.label }}
            </button>
            @if (item.divider) {
              <hr class="my-1 border-gray-200" />
            }
          }

          <hr class="my-1 border-gray-200" />
          <button
            (click)="logout()"
            class="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50/50 active:bg-red-100 transition-colors font-medium"
          >
            Sair
          </button>
        </div>
      </div>
    }
  `,
  styles: [],
})
export class HeaderComponent {
  sidebarAberta = true;
  itemAtivo = 'Dashboard';
  screenWidth = 0;

  botoes: MenuButton[] = [
    { nome: 'Dashboard', icone: 'assets/dashboard.svg', rota: '/painel-controle/dashboard' },
    {
      nome: 'Cadastro de Prompts',
      icone: 'assets/prompt-colored.png',
      rota: '/painel-controle/cadastro-prompts',
    },
    {
      nome: 'Gerenciamento de Usuários',
      icone: 'assets/users-sidebar.svg',
      rota: '/painel-controle/gerenciamento-usuarios',
      classeAberta: 'w-11 h-11',
      classeFechada: 'w-14 h-14',
    },
    {
      nome: 'Gerar Relatórios',
      icone: 'assets/reports-sidebar.svg',
      rota: '/painel-controle/gerar-relatorios',
      classeAberta: 'w-12 h-12',
      classeFechada: 'w-[72px] h-[72px]',
    },
  ];

  constructor(
    public auth: AuthService,
    private router: Router,
    public menuStateService: MenuStateService,
  ) {
    this.updateScreenWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateScreenWidth();
  }

  updateScreenWidth() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 1024) {
      this.sidebarAberta = true;
    } else {
      this.sidebarAberta = false;
    }
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }

  toggleSidebar(event?: Event) {
    event?.stopPropagation();
    this.sidebarAberta = !this.sidebarAberta;
  }

  fecharSidebar(event?: Event) {
    event?.stopPropagation();
    if (this.isMobile()) {
      this.sidebarAberta = false;
    }
  }

  manterSidebarAberta(event?: Event) {
    event?.stopPropagation();
  }

  navegar(btn: MenuButton) {
    this.itemAtivo = btn.nome;
    this.router.navigate([btn.rota]);
    if (this.isMobile()) {
      this.sidebarAberta = false;
    }
  }

  get userInfo() {
    return this.auth.getUserInfo();
  }

  get userRole(): UserRole | null {
    return this.auth.getUserInfo().role as UserRole | null;
  }

  get userMenuItems(): MenuItem[] {
    const role = this.userRole;
    if (!role) return [];
    return menuConfig.filter((item) => item.roles.includes(role));
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

  getRoleBadge(): string {
    const role = this.userRole;
    if (role === 'admin') return 'Admin';
    if (role === 'student') return 'Aluno';
    return '';
  }

  getRoleBadgeColor(): string {
    const role = this.userRole;
    if (role === 'admin') return 'bg-red-500';
    if (role === 'student') return 'bg-[#148b63]';
    return 'bg-gray-500';
  }
}
