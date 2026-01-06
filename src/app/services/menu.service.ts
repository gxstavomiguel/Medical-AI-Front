import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  isUserMenuOpen = signal(false);

  toggleMenu() {
    this.isUserMenuOpen.update((value) => !value);
  }

  openMenu() {
    this.isUserMenuOpen.set(true);
  }

  closeMenu() {
    this.isUserMenuOpen.set(false);
  }
}
