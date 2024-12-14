# Chat System

## Descrição

Este projeto é uma aplicação de chat em tempo real desenvolvida utilizando **Spring** (para o backend) e **React** (para o frontend). Ele permite que usuários se conectem em tempo real e enviem mensagens uns aos outros de forma dinâmica. O sistema também exibe notificações informativas sempre que um novo usuário se conecta ao chat.

### Funcionalidades:
- Conexão em tempo real via **SignalR** (no backend).
- Envio e recebimento de mensagens entre os usuários.
- Exibição de mensagens informativas quando novos usuários entram no chat.
- Interface de chat com tema escuro e detalhes em vermelho.
- Lista de usuários com seus nomes exibidos em cores diferentes.
  
## Tecnologias Utilizadas

- **Backend**: 
  - Java com **Spring Boot**
  - **SignalR** para comunicação em tempo real
  - **Serilog** para logging
  - **Axios** para comunicação HTTP
  
- **Frontend**:
  - **React.js**
  - **Material-UI** para componentes de interface
  - **Axios** para chamadas HTTP

## Como Rodar o Projeto

### Backend (Spring Boot)

1. **Clone o repositório do backend**:
    ```bash
    git clone https://github.com/FelipeFeitosaBraga/Chat-System-Backend.git
    ```

2. **Acesse a pasta do backend**:
    ```bash
    cd Chat-System-Backend
    ```

3. **Configure o banco de dados** (se necessário):
   - Certifique-se de que o banco de dados esteja configurado corretamente no arquivo de configuração do `application.properties`.

4. **Execute o projeto**:
    ```bash
    mvn spring-boot:run
    ```
   O servidor será iniciado em `http://localhost:8080`.

### Frontend (React.js)

1. **Clone o repositório do frontend**:
    ```bash
    git clone https://github.com/FelipeFeitosaBraga/Chat-System-Frontend.git
    ```

2. **Acesse a pasta do frontend**:
    ```bash
    cd Chat-System-Frontend
    ```

3. **Instale as dependências**:
    ```bash
    npm install
    ```

4. **Inicie o servidor de desenvolvimento**:
    ```bash
    npm start
    ```

   O frontend será iniciado em `http://localhost:3000`.

### Conectando o Frontend ao Backend

- Certifique-se de que o backend esteja rodando em `localhost:8080` antes de iniciar o frontend.
- As requisições HTTP feitas no frontend serão direcionadas para o backend conforme configurado no código.

## Alterações Realizadas

1. **Mensagem de Boas-vindas**:
   - Uma mensagem é enviada automaticamente para todos os usuários no chat sempre que um novo usuário se conecta, com o texto: `"Usuário [NOME] se conectou ao chat"`.

2. **Estilização do Chat**:
   - O chat agora utiliza um tema **escuro** com detalhes **vermelhos**.
   - Os nomes dos usuários no chat são exibidos em **cores aleatórias** para uma melhor identificação visual.

## Como Testar

1. Acesse o **frontend** no navegador em `http://localhost:3000`.
2. Entre com um **nome de usuário** e observe a conexão do usuário no backend.
3. A partir desse momento, todos os usuários que estiverem na mesma sala de chat irão ver a mensagem informando que um novo usuário se conectou.

## Capturas de Tela

### Tela Inicial de Login

![Tela de Login](images/login.png)

### Chat em Tempo Real

![Tela de Chat](images/chat.png)

## Contribuindo

Sinta-se à vontade para contribuir para este projeto! Para isso:

1. Faça um **fork** do repositório.
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`).
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`).
4. **Push** para a branch (`git push origin feature/MinhaFeature`).
5. Abra um **Pull Request** para que suas mudanças sejam analisadas.

## Licença

Este projeto está licenciado sob a **MIT License** - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
Explicação do README.md:
Descrição:

Explica o que o projeto faz e suas principais funcionalidades, como o envio de mensagens em tempo real e a exibição de mensagens informativas sobre a entrada de novos usuários.
Tecnologias Utilizadas:

Especifica as tecnologias usadas tanto no backend (Spring Boot, SignalR) quanto no frontend (React, Material-UI).
Como Rodar o Projeto:

Detalha os passos para rodar tanto o backend quanto o frontend do projeto.
Alterações Realizadas:

Explica as funcionalidades novas implementadas, como a mensagem de boas-vindas para novos usuários e a estilização do chat.
Capturas de Tela:

Um espaço reservado para imagens ilustrativas do funcionamento da interface do usuário, para facilitar a compreensão de como a aplicação se apresenta visualmente.
Contribuindo:

Orientações para outras pessoas que queiram contribuir com o projeto, como realizar forks, criar branches e fazer pull requests.
Licença:

Informação sobre a licença do projeto (MIT License, por exemplo).
