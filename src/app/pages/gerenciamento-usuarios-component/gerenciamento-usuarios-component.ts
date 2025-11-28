import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces de dados simulados
interface Usuario {
  codigo: string;
  nome: string;
  email: string;
  senha: string;
  situacao: 'Ativo' | 'Inativo';
  acoes: string; // Ações como editar, excluir, etc.
}

interface Turma {
  id: number;
  nome: string;
  usuarios: Usuario[];
  expandida: boolean;
  editandoNome: boolean;
  novoUsuario: boolean;
}

@Component({
  selector: 'app-gerenciamento-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './gerenciamento-usuarios.component.css',
  templateUrl: './gerenciamento-usuarios-component.html',
})
export class GerenciamentoUsuariosComponent implements OnInit {
  turmas: Turma[] = [
    {
      id: 1,
      nome: 'Turma 1',
      expandida: true,
      editandoNome: false,
      novoUsuario: false,
      usuarios: [
        { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', senha: '*****', situacao: 'Ativo', acoes: '' },
        { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', senha: '*****', situacao: 'Ativo', acoes: '' },
        { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', senha: '*****', situacao: 'Ativo', acoes: '' },
        { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', senha: '*****', situacao: 'Ativo', acoes: '' },
      ]
    },
    {
      id: 2,
      nome: 'Turma 2',
      expandida: true,
      editandoNome: false,
      novoUsuario: false,
      usuarios: [
        { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', senha: '*****', situacao: 'Ativo', acoes: '' },
        { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', senha: '*****', situacao: 'Ativo', acoes: '' },
      ]
    }
  ];

  termoBusca: string = '';
  filtroTurma: string = '';
  filtroSituacao: string = '';
  turmaParaAdicionar: string = '';
  turmaParaEditar: Turma | null = null;
  turmaParaExcluir: Turma | null = null;

  modalNovaTurmaAberto: boolean = false;
  modalNovoUsuarioAberto: boolean = false;
  modalImportarUsuariosAberto: boolean = false;
  modalPreVisualizacaoImportacaoAberto: boolean = false;

  novaTurmaNome: string = '';
  novoUsuarioForm = {
    codigo: '',
    nome: '',
    email: '',
    situacao: 'Ativo',
    turmaId: 0
  };
  dadosImportacao: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.novoUsuarioForm.turmaId = this.turmas[0]?.id || 0;
  }

  abrirModalNovaTurma(): void {
    this.novaTurmaNome = '';
    this.modalNovaTurmaAberto = true;
  }

  fecharModalNovaTurma(): void {
    this.modalNovaTurmaAberto = false;
  }

  salvarNovaTurma(): void {
    if (this.novaTurmaNome.trim()) {
      const novaTurma: Turma = {
        id: Date.now(),
        nome: this.novaTurmaNome.trim(),
        usuarios: [],
        expandida: true,
        editandoNome: false,
        novoUsuario: false
      };
      this.turmas.push(novaTurma);
      this.fecharModalNovaTurma();
    }
  }

  abrirModalNovoUsuario(turmaId: number): void {
    this.novoUsuarioForm = {
      codigo: '',
      nome: '',
      email: '',
      situacao: 'Ativo',
      turmaId: turmaId
    };
    this.modalNovoUsuarioAberto = true;
  }

  fecharModalNovoUsuario(): void {
    this.modalNovoUsuarioAberto = false;
  }

  salvarNovoUsuario(): void {
    const turma = this.turmas.find(t => t.id === this.novoUsuarioForm.turmaId);
    if (turma && this.novoUsuarioForm.codigo && this.novoUsuarioForm.nome && this.novoUsuarioForm.email) {
      const novoUsuario: Usuario = {
        codigo: this.novoUsuarioForm.codigo,
        nome: this.novoUsuarioForm.nome,
        email: this.novoUsuarioForm.email,
        senha: '*****',
        situacao: this.novoUsuarioForm.situacao as 'Ativo' | 'Inativo',
        acoes: ''
      };
      turma.usuarios.push(novoUsuario);
      this.fecharModalNovoUsuario();
    }
  }

  abrirModalImportarUsuarios(): void {
    this.modalImportarUsuariosAberto = true;
  }

  fecharModalImportarUsuarios(): void {
    this.modalImportarUsuariosAberto = false;
    this.dadosImportacao = [];
  }

  simularUpload(event: Event): void {
    this.dadosImportacao = [
      { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', turma: 1, situacao: 'Ativo' },
      { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', turma: 1, situacao: 'Ativo' },
      { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', turma: 1, situacao: 'Ativo' },
      { codigo: '123456', nome: 'Teste', email: 'teste@teste.com', turma: 1, situacao: 'Ativo' },
    ];
    this.modalImportarUsuariosAberto = false;
    this.modalPreVisualizacaoImportacaoAberto = true;
  }

  fecharModalPreVisualizacao(): void {
    this.modalPreVisualizacaoImportacaoAberto = false;
    this.dadosImportacao = [];
  }

  salvarImportacao(): void {
    console.log('Usuários importados salvos:', this.dadosImportacao);
    this.fecharModalPreVisualizacao();
  }

  toggleExpandirTurma(turma: Turma): void {
    turma.expandida = !turma.expandida;
  }

  iniciarEdicaoTurma(turma: Turma): void {
    turma.editandoNome = true;
    this.turmaParaEditar = { ...turma };
  }

  salvarEdicaoTurma(turma: Turma): void {
    if (this.turmaParaEditar && this.turmaParaEditar.nome.trim()) {
      turma.nome = this.turmaParaEditar.nome.trim();
      turma.editandoNome = false;
      this.turmaParaEditar = null;
    }
  }

  cancelarEdicaoTurma(turma: Turma): void {
    turma.editandoNome = false;
    this.turmaParaEditar = null;
  }

  excluirTurma(turmaId: number): void {
    this.turmas = this.turmas.filter(t => t.id !== turmaId);
  }

  // Lógica de Filtragem e Busca
  get turmasFiltradas(): Turma[] {
    let turmas = this.turmas;

    // Filtro por turma (se o selectbox de turma for usado)
    if (this.filtroTurma) {
      turmas = turmas.filter(t => t.nome === this.filtroTurma);
    }

    // Filtro por situação
    if (this.filtroSituacao) {
      turmas = turmas.map(turma => ({
        ...turma,
        usuarios: turma.usuarios.filter(u => u.situacao === this.filtroSituacao)
      })).filter(t => t.usuarios.length > 0);
    }

    // Busca por nome ou código de matrícula
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.trim().toLowerCase();
      turmas = turmas.map(turma => ({
        ...turma,
        usuarios: turma.usuarios.filter(u =>
          u.nome.toLowerCase().includes(termo) || u.codigo.includes(termo)
        )
      })).filter(t => t.usuarios.length > 0);
    }

    return turmas;
  }

  // Ações de usuário (simuladas)
  editarUsuario(usuario: Usuario): void {
    console.log('Editar usuário:', usuario);
    // Lógica para abrir modal de edição de usuário
  }

  excluirUsuario(turma: Turma, usuario: Usuario): void {
    turma.usuarios = turma.usuarios.filter(u => u !== usuario);
    console.log('Excluir usuário:', usuario);
  }

  // Utilitários para o template
  get todasTurmas(): string[] {
    return this.turmas.map(t => t.nome);
  }
}
