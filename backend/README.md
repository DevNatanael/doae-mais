Olá! Analisei todos os arquivos `backend` e cruzei com o seu `README.md`. Você fez um ótimo trabalho na estruturação inicial do projeto com NestJS e TypeORM.

Como você mencionou, a Etapa 1 (definição dos módulos e entidades) está robusta, e você iniciou a Etapa 3 (Endpoints da API).

Aqui está um diagnóstico detalhado do que foi feito e um cronograma adaptado focado **exclusivamente no back-end**, como solicitado, para tornar a aplicação funcional.

---

## O que já foi Concluído (Back-end)

Você implementou com sucesso a "camada pública" da sua API, ou seja, as rotas que um visitante ou doador usaria.

1.  **Estrutura de Módulos e Entidades (Etapa 1):** **Concluído.**
    * Você criou os módulos (`UsersModule`, `DonationsModule`, `NeedsModule`, `DonationCategoriesModule`).
    * Você definiu as entidades e seus relacionamentos com TypeORM (`User`, `Donation`, `Need`, `DonationCategory`).

2.  **Endpoints Públicos (Início da Etapa 3):** **Concluído.**
    * `GET /api/needs`: Retorna a lista de necessidades.
    * `GET /api/donation-categories`: Retorna os tipos de doação.
    * `POST /api/donations`: Permite que um doador registre uma nova doação. A lógica de serviço valida corretamente os IDs da categoria e da necessidade.
    * `GET /api/members`: Lista todos os membros registrados.
    * `GET /api/members/:id`: Retorna os detalhes de um membro específico.
    * **Setup:** `main.ts` está configurado com `ValidationPipe` global (ótimo para validar DTOs), CORS e prefixo `/api`.

3.  **Member CRUD (Novo):** **Concluído.**
    * `POST /api/members`: Cria um novo membro. Esta rota é protegida e só pode ser usada por um usuário autenticado.
    * `PUT /api/members/:id`: Atualiza os dados do membro. Também é protegida pelo `JwtAuthGuard`.
    * `DELETE /api/members/:id`: Remove um membro do sistema. Protegida pelo `JwtAuthGuard`.
    * Campos do membro: `firstName`, `lastName`, `email`, `address`, `dateOfBirth`.

---

## O que está Faltando (Back-end)

O "gap" principal é a **Área do Administrador**. Atualmente, a instituição (Igreja) não tem como gerenciar o sistema. Faltam todos os endpoints protegidos que permitem ao admin criar necessidades, atualizar o status das doações e ver relatórios.

Aqui está o detalhamento do que precisa ser feito:

1.  **Autenticação (A lacuna mais crítica):**
    * Não há um `AuthModule` ou lógica de login. O admin não consegue "entrar" no sistema.
    * O `UsersModule` só define a entidade, mas não tem um `UsersService` para buscar um usuário no banco e comparar a senha (o `user.entity.ts` já tem a lógica de hash, o que é excelente).

2.  **Gerenciamento de 'Needs' (Admin):**
    * O `NeedsController` só permite listar (`GET`). Faltam os métodos para o admin:
        * `POST /needs`: Criar uma nova necessidade.
        * `PUT /needs/:id`: Atualizar uma necessidade (ex: mudar a meta).
        * `DELETE /needs/:id`: Remover uma necessidade.

3.  **Gerenciamento de 'Donations' (Admin):**
    * O `DonationsController` só permite criar (`POST`). Faltam os métodos para o admin:
        * `GET /donations`: Listar *todas* as doações recebidas.
        * `PATCH /donations/:id/status`: Atualizar o status de uma doação (ex: de `PENDING` para `COLLECTED`). (Isso é essencial para a funcionalidade da instituição e não estava explícito no README).

4.  **Módulo de Dashboard (Relatórios):**
    * Não há um `DashboardModule` ou endpoints para alimentar os gráficos.
        * `GET /dashboard/admin-summary`: Para o gráfico do admin.
        * `GET /dashboard/public-summary`: Para o gráfico da homepage (Etapa 5 do README).

5.  **Geração de PIX (Etapa 5):**
    * Não há um `PaymentModule` ou o endpoint `POST /payment/pix`.

---

## Cronograma do Back-end Adaptado (Próximos Passos)

Aqui está o cronograma atualizado, focado em tornar o back-end funcional para *ambos* os usuários (doador e admin).

### Etapa 1: Estrutura e Modelos
**(Concluído!)**
* Módulos (`AppModule`, `UsersModule`, `NeedsModule`, `DonationsModule`, etc.)
* Entidades e Relacionamentos TypeORM (`User`, `Need`, `Donation`, `DonationCategory`).

### Etapa 2: Endpoints Públicos (Visão do Doador)
**(Concluído!)**
* `GET /api/needs` (Listar necessidades).
* `GET /api/donation-categories` (Listar tipos de doação).
* `POST /api/donations` (Registrar intenção de doação).

### Etapa 3: Autenticação de Admin (Próximo Passo Crítico)
**(A Fazer)**
1.  **Criar `AuthModule`:**
    * Importar `JwtModule` (do `@nestjs/jwt`) e `PassportModule` (do `@nestjs/passport`).
    * Configurar o `JwtModule` com um segredo (via `.env`).
2.  **Atualizar `UsersModule`:**
    * Criar `UsersService` com um método `findByEmail(email)` (para a lógica de login).
3.  **Criar `AuthService`:**
    * Criar um método `validateUser(email, password)` que usa o `UsersService` e `bcrypt` para comparar a senha.
    * Criar um método `login(user)` que gera e retorna um JWT (access token).
4.  **Criar `AuthController`:**
    * Criar o endpoint `POST /api/auth/login` que usa o `AuthService` para logar o admin.
5.  **Criar Guards de Rota:**
    * Implementar um `JwtAuthGuard` que protege endpoints verificando o token JWT no cabeçalho da requisição.
    * *(Opcional, mas recomendado)*: Criar um script ou um endpoint protegido `POST /api/auth/register` para criar o primeiro usuário admin.

### Etapa 4: Endpoints de Admin (Gerenciamento)
**(A Fazer)**
* *Todos os endpoints desta etapa devem ser protegidos pelo `JwtAuthGuard` criado na Etapa 3.*

1.  **Atualizar `NeedsModule`:**
    * No `NeedsController` e `NeedsService`, adicionar os métodos para:
        * `POST /api/needs` (Criar necessidade)
        * `PUT /api/needs/:id` (Atualizar necessidade)
        * `DELETE /api/needs/:id` (Remover necessidade)
2.  **Atualizar `DonationsModule`:**
    * No `DonationsController` e `DonationsService`, adicionar os métodos para:
        * `GET /api/donations` (Listar todas as doações)
        * `PATCH /api/donations/:id` (Atualizar o status da doação, ex: `PENDING` -> `COLLECTED`).

### Etapa 5: Endpoints de Relatórios (Dashboard)
**(A Fazer)**
1.  **Criar `DashboardModule`:**
    * O serviço deste módulo fará queries SQL mais complexas (com `GROUP BY`, `SUM`, etc.) usando o `Repository` do TypeORM.
2.  **Criar `DashboardController`:**
    * `GET /api/dashboard/admin-summary` (Protegido): Retorna dados agregados (ex: total por categoria) para o gráfico do admin.
    * `GET /api/dashboard/public-summary` (Público): Retorna dados agregados (ex: total de cestas básicas) para o gráfico da homepage.

### Etapa 6: Funcionalidade PIX (Etapa 5 do README)
**(A Fazer)**
1.  **Instalar biblioteca PIX:** (ex: `qrcode-pix`).
2.  **Criar `PaymentModule`:**
3.  **Criar `PaymentController`:**
    * `POST /api/payment/pix` (Protegido): Recebe `{ value, description }` e retorna a string "copia-e-cola" e o QR Code em base64.
