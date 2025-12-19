# Melhorias no Frontend - Medical AI

Este documento detalha as melhorias necessárias no frontend do projeto Medical-AI-Front, com base na Especificação de Requisitos de Software. O foco está em substituir dados simulados (mock) por integrações reais com a API backend, além de adicionar funcionalidades ausentes. As sugestões incluem nomes de arquivos, métodos/chamadas de API e locais específicos no código onde implementar as mudanças.

## 1. Dashboard Component (`dashboard-component.ts` e `dashboard-component.html`)

### Melhorias/Adições

- **Dados Dinâmicos para KPIs**: Substituir valores hardcoded (ex.: "530" usuários) por dados da API.
- **Atualização Automática de Gráficos**: Conectar gráficos a APIs para dados reais.
- **Filtros por Período**: Implementar lógica para atualizar dados com base no filtro selecionado.
- **Painel Analítico**: Adicionar seção para resumo de variações (não implementada).

### Chamadas de API (em vez de dados simulados)

- **Método para KPIs**: No `ngOnInit()` ou método de carregamento, chamar API para obter indicadores.
  - Exemplo: `this.dashboardService.getKPIs(periodo).subscribe(data => { this.totalUsers = data.totalUsers; ... });`
  - API Endpoint Sugerido: `GET /api/dashboard/kpis?period={period}`
- **Método para Gráficos**: Para cada gráfico (ex.: `app-grafico-line`), substituir arrays hardcoded por chamadas.
  - Exemplo: `this.dashboardService.getChartData('evolucao-solicitacoes', periodo).subscribe(data => { this.labels = data.labels; this.data = data.values; });`
  - API Endpoints: `GET /api/dashboard/chart/evolucao-solicitacoes?period={period}`, `GET /api/dashboard/chart/crescimento-usuarios`, etc.
- **Filtro de Período**: No evento `change` do select, recarregar dados.
  - Local: Adicionar `(change)="onPeriodChange($event)"` no HTML e implementar no TS.

## 2. Cadastro de Prompts Component (`cadastro-prompts-component.ts`)

### Melhorias/Adições

- **Integração com Backend**: Substituir `MOCK_DATA` por dados da API.
- **Upload de Arquivos RAG**: Implementar upload real de documentos.
- **Persistência de Mudanças**: Salvar edições, adições e exclusões via API.

### Chamadas de API (em vez de dados simulados)

- **Carregar Prompts**: No `ngOnInit()`, chamar API para obter a árvore de prompts.
  - Exemplo: `this.promptService.getPromptSections().subscribe(sections => { this.promptSections = sections; });`
  - API Endpoint: `GET /api/prompts/sections`
- **Adicionar Tema/Subtema**: No método `addNewTheme()` ou `addChildSection()`, chamar API para criar.
  - Exemplo: `this.promptService.createSection({ name, level, parentId }).subscribe(newSection => { ... });`
  - API Endpoint: `POST /api/prompts/sections`
- **Editar/Excluir**: Nos métodos `saveName()`, `deleteSection()`, etc.
  - Exemplo: `this.promptService.updateSection(id, { name }).subscribe();`
  - API Endpoints: `PUT /api/prompts/sections/{id}`, `DELETE /api/prompts/sections/{id}`
- **Configurar RAG**: No modal RAG, implementar upload.
  - Exemplo: `this.promptService.uploadRAGDocument(sectionId, file).subscribe();`
  - API Endpoint: `POST /api/prompts/sections/{id}/rag-documents`

## 3. Gerenciamento de Usuários Component (`gerenciamento-usuarios-component.ts`)

### Melhorias/Adições

- **Integração com Backend**: Substituir dados mock por API.
- **Validação de Excel**: Processar upload real e validar dados.
- **CRUD Completo**: Para turmas e usuários.

### Chamadas de API (em vez de dados simulados)

- **Carregar Usuários/Turmas**: No `ngOnInit()`, chamar API.
  - Exemplo: `this.userService.getUsers().subscribe(users => { this.usuarios = users; });`
  - API Endpoint: `GET /api/users`
- **Importar Excel**: No método `abrirModalImportarUsuarios()`, após upload, enviar arquivo.
  - Exemplo: `this.userService.importUsers(file).subscribe(result => { ... });`
  - API Endpoint: `POST /api/users/import`
- **Cadastrar/Editar/Excluir Turma**: Nos métodos correspondentes.
  - Exemplo: `this.userService.createTurma({ name }).subscribe();`
  - API Endpoints: `POST /api/turmas`, `PUT /api/turmas/{id}`, `DELETE /api/turmas/{id}`
- **Cadastrar Usuário**: Similar para usuários.
  - API Endpoints: `POST /api/users`, etc.

## 4. Gerar Relatórios Component (`gerar-relatorios-component.ts`)

### Melhorias/Adições

- **Geração Dinâmica**: Processar filtros e gerar relatório via API.
- **Histórico de Relatórios**: Adicionar seção para listar relatórios salvos.
- **Exportação**: Implementar download de PDF/Excel.

### Chamadas de API (em vez de dados simulados)

- **Gerar Relatório**: No botão "Gerar Relatório", enviar filtros e obter dados.
  - Exemplo: `this.reportService.generateReport(filters).subscribe(reportData => { this.displayReport(reportData); });`
  - API Endpoint: `POST /api/reports/generate`
- **Histórico**: Carregar lista de relatórios gerados.
  - Exemplo: `this.reportService.getReportHistory().subscribe(history => { this.reports = history; });`
  - API Endpoint: `GET /api/reports/history`
- **Exportar**: Após geração, chamar endpoint para download.
  - Exemplo: `this.reportService.exportReport(reportId, format).subscribe(blob => { download(blob); });`
  - API Endpoints: `GET /api/reports/{id}/export?format=pdf`, etc.

## 5. Serviços Gerais (ex.: `auth.service.ts`, `supabase.client.ts`)

### Melhorias/Adições

- **Integração Completa com Supabase**: Garantir que todos os serviços usem o cliente Supabase para autenticação e dados.
- **Guards e Interceptors**: Verificar se `auth.guard.ts` e `auth.interceptor.ts` estão conectados corretamente.

### Chamadas de API

- **Autenticação**: Já parcialmente implementado; garantir uso de `supabase.auth.signIn()`.
- **Outros**: Para chat, mensagens, etc., se aplicável (ex.: `chat.service.ts`).

## 6. Aplicativo Mobile (Ausente)

- **Criação do App**: Desenvolver app mobile separado usando Ionic/Angular.
- **Funcionalidades**: Implementar chat, login, etc., com chamadas similares às acima, adaptadas para mobile.
- **Arquivo Sugerido**: Criar novo projeto `Medical-AI-Mobile` com componentes para chat, etc.

## 7. Boas Práticas de Programação e Recursos Modernos

### Angular 21

- **Signals**: Migrar para signals em vez de BehaviorSubjects para reatividade mais eficiente. Ex.: Substituir `BehaviorSubject` em services por `signal()` e `computed()`.
- **Control Flow**: Usar `@if`, `@for` e `@switch` no HTML em vez de `*ngIf` e `*ngFor` para melhor performance e legibilidade.
- **Standalone Components**: Garantir que todos os componentes sejam standalone (já parecem ser, conforme `standalone: true`).
- **Lazy Loading**: Implementar lazy loading para rotas em `app.routes.ts` usando `loadComponent` ou `loadChildren`.
- **OnPush Change Detection**: Adicionar `changeDetection: ChangeDetectionStrategy.OnPush` em componentes para otimizar re-renders.
- **Injector e Dependency Injection**: Usar `inject()` em vez de constructor injection onde possível.

### TypeScript

- **Tipagem Estrita**: Habilitar `strict: true` em `tsconfig.json` e adicionar tipos explícitos para todas as variáveis, parâmetros e retornos.
- **Interfaces e Types**: Criar interfaces robustas para dados (ex.: `PromptSection`, `User`) e usar `Partial<>` ou `Omit<>` para variações.
- **Enums**: Usar enums para valores fixos (ex.: status de usuário).
- **Utility Types**: Aplicar `Readonly<>` para imutabilidade e `NonNullable<>` para evitar nulls.

### Tailwind CSS

- **Classes Dinâmicas**: Usar `[ngClass]` com objetos para condicionais em vez de strings concatenadas.
- **Custom Variants**: Criar variants personalizados em `tailwind.config.js` para temas (ex.: cores da marca).
- **Purge/Optimize**: Configurar `content` em `tailwind.config.js` para incluir apenas arquivos usados, reduzindo bundle.
- **Responsividade**: Usar breakpoints consistentes (sm:, md:, lg:) e testar em dispositivos.

### Segurança

- **Validação de Inputs**: Usar Angular Forms com Validators e ReactiveForms para prevenir injeções.
- **Sanitização**: Aplicar `DomSanitizer` para conteúdo dinâmico (ex.: HTML de prompts).
- **Proteção contra XSS**: Evitar `innerHTML` direto; usar `[innerHTML]` com sanitização.
- **Autenticação Segura**: Garantir que tokens sejam armazenados em HttpOnly cookies via Supabase, não localStorage.
- **Rate Limiting**: Implementar no backend, mas validar no frontend (ex.: debouncing em buscas).

### Performance

- **Bundle Optimization**: Usar `ng build --prod` com tree-shaking; remover dead code.
- **Lazy Loading de Imagens**: Usar `loading="lazy"` em `<img>`.
- **Virtual Scrolling**: Para listas grandes (ex.: usuários), usar `CdkVirtualScrollViewport`.
- **Memoization**: Usar `computed()` para cálculos caros.
- **Service Workers**: Adicionar PWA com `@angular/pwa` para cache offline.
- **Profiling**: Usar Angular DevTools para identificar bottlenecks.

## 8. Código Não Utilizado ou Desnecessário

- **Imports Não Usados**: Verificar e remover imports como `JsonPipe` em `cadastro-prompts-component.ts` se não usado.
- **Código Comentado**: Remover blocos comentados no `dashboard-component.html` (ex.: KPIs comentados).
- **Componentes Inativos**: `nova-senha-component` pode não estar em uso; verificar rotas.
- **Dependências**: No `package.json`, remover libs não usadas (ex.: verificar com `npm audit` e `depcheck`).
- **Arquivos Mock**: Remover `MOCK_DATA` após integração.
- **Console Logs**: Remover `console.log` de produção.
- **Estilos Não Usados**: Em Tailwind, classes não aplicadas serão purged, mas revisar manualmente.

## Considerações Finais

- **Prioridade**: Começar pela substituição de mocks no dashboard e prompts, pois são centrais.
- **Testes**: Após mudanças, executar `npm test` e validar com `ng build`.
- **Dependências**: Adicionar libs como `@angular/common/http` se necessário para chamadas HTTP.
- **Segurança**: Usar interceptors para tokens JWT via Supabase.

Este documento deve ser atualizado conforme o desenvolvimento avança.</content>
<parameter name="filePath">c:\dev\Medical-AI-Front\Melhorias_Frontend_Medical_AI.md
