# Projeto: Read/Write Splitting com Node.js e MySQL

Este é um projeto acadêmico para a disciplina de **Computação em Nuvem** da **Fatec Franca - Dr. Thomaz Novelino**, do curso de Desenvolvimento de Software Multiplataforma.

O objetivo é implementar e demonstrar o padrão de arquitetura de **Read/Write Splitting** (Separação de Leitura/Escrita), direcionando operações de `INSERT` para um banco de dados primário (escrita) e operações de `SELECT` para uma réplica (leitura).

**Grupo:** `grupo-e-sub`  
**Integrantes:** Igor Owen Silva de Paula, Pedro Gonçalves Moreira, Samuel Santos Souza e Vinícius Baldochi Cardoso

---

## 🚀 Funcionalidades

Este repositório contém duas implementações da mesma lógica:

1. **`app.js`**: Um script de console que roda em loop. A cada segundo, ele:
   * **Escreve (Write)**: Insere um novo produto no banco primário.
   * **Lê (Read)**: Realiza 10 `SELECTs` individuais no banco de réplica.

2. **`api.js`**: Um servidor de API (usando Express.js) que expõe dois endpoints:
   * `POST /produtos`: **Escreve (Write)** um novo produto no banco primário.
   * `GET /produto/:id`: **Lê (Read)** um produto específico do banco de réplica.

---

## 🛠️ Pré-requisitos

* [Node.js](https://nodejs.org/) (v20.9.0 ou superior)  
* [Docker](https://www.docker.com/) (ou qualquer outro servidor MySQL local)

---

## ⚙️ Como Executar Localmente

Siga estes passos para configurar e testar o projeto no seu ambiente.

### 1. Clonar o Repositório

```bash
git clone https://github.com/IgoROweN/BD-Gerenciado-grupo-e-sub.git
cd BD-Gerenciado-grupo-e-sub
```

---

### 2. Instalar Dependências

Este projeto usa **mysql2** e **express**.

```bash
npm install mysql2 express
```

---

### 3. Configurar o Banco de Dados (Docker)

Para simular o ambiente localmente, usaremos um container Docker com MySQL.

**a. Iniciar o container:**

```bash
docker run --name mysql-local -p 3306:3306 -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=aula-db -d mysql:8
```

**b. Criar a tabela `produto`:**

Conecte-se ao container e execute o script SQL:

```bash
docker exec -it mysql-local mysql -u root -padmin aula-db
```

Dentro do prompt `mysql>`, cole o script abaixo:

```sql
CREATE TABLE produto (
  id INT AUTO_INCREMENT,
  descricao VARCHAR(50) NOT NULL,
  categoria VARCHAR(10) NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  criado_em DATETIME DEFAULT NOW(),
  criado_por VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (descricao, criado_por)
);
EXIT;
```

---

### 4. Configurar as Conexões

Nos arquivos `app.js` e `api.js`, certifique-se de que as configurações de conexão (`primaryConfig` e `replicaConfig`) estão apontando para o seu banco local:

```js
const primaryConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin', // Senha definida no comando Docker
  database: 'aula-db'
};

const replicaConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'aula-db'
};
```

---

## ▶️ Rodando a Aplicação

Você pode rodar qualquer uma das duas versões do projeto.

### **Versão 1: Script em Loop**

Execute o `app.js` e observe o console.  
Você verá os logs de `[PRIMÁRIO]` e `[RÉPLICA]` a cada segundo.

```bash
node app.js
```

---

### **Versão 2: Servidor de API**

Execute o `api.js` para iniciar o servidor:

```bash
node api.js
```

O servidor estará rodando em [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testando os Endpoints (exemplos com curl)

### **POST (Escrita no Primário)**

```bash
curl -X POST http://localhost:3000/produtos -H "Content-Type: application/json" -d '{"descricao":"Teste API","categoria":"API","valor":199.99}'
```

### **GET (Leitura da Réplica)**  
(Use o ID retornado pelo comando POST)

```bash
curl http://localhost:3000/produto/1
```

---

## 🧩 Observações

* Certifique-se de que o container MySQL está rodando antes de iniciar a aplicação.
* Caso deseje usar réplicas reais, basta alterar o `host` da `replicaConfig` para outro servidor MySQL.

---

📘 **Desenvolvido para fins acadêmicos — FATEC Franca - Computação em Nuvem.**
