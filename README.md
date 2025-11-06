# Projeto: Read/Write Splitting com Node.js e MySQL

Este é um projeto acadêmico para a disciplina de **Computação em Nuvem** da **Fatec Franca - Dr. Thomaz Novelino**, do curso de Desenvolvimento de Software Multiplataforma.

O objetivo é implementar e demonstrar o padrão de arquitetura de **Read/Write Splitting** (Separação de Leitura/Escrita), direcionando operações de `INSERT` para um banco de dados primário (escrita) e operações de `SELECT` para uma réplica (leitura).

**Grupo:** `grupo-e-sub`  
**Integrantes:** Igor Owen Silva de Paula, Pedro Goncalves Moreira, Samuel Santos Souza e Vinicius Baldochi Cardoso

---

## 🚀 Funcionalidades

Este repositório contém duas implementações da mesma lógica:

1. **`app.js`**: Um script de console que roda em loop. A cada segundo, ele:

   - **Escreve (Write)**: Insere um novo produto no banco primário.
   - **Lê (Read)**: Realiza 10 `SELECTs` individuais no banco de réplica.

2. **`api.js`**: Um servidor de API (usando Express.js) que expõe dois endpoints:

   - `POST /produtos`: **Escreve (Write)** um novo produto no banco primário.
   - `GET /produto/:id`: **Lê (Read)** um produto específico do banco de réplica.

3. **`db.js`**: Módulo de configuração de conexão com o banco de dados:
   - Cria dois pools de conexão separados: um para o banco primário (escrita) e outro para a réplica (leitura).
   - Permite alternar entre modo de teste local (Docker) e modo de apresentação (banco oficial).
   - Exporta os pools `primaryPool` e `replicaPool` para serem utilizados nos outros módulos.

---

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) (v20.9.0 ou superior)
- [Docker](https://www.docker.com/)

---

## ⚙️ Configuração do Banco de Dados (Local)

Para testar o projeto, usaremos um container Docker com MySQL.

**a. Iniciar o container:**

```bash
docker run --name mysql-local -p 3306:3306 -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=aula-db -d mysql:8
```

**b. Criar a tabela produto:**

```bash
docker exec -it mysql-local mysql -u root -padmin aula-db
```

Dentro do prompt `mysql>`, cole:

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
```

```bash
exit;
```

```bash
git pull origin main
git add db.js README.md
git commit -m "refactor(db): Adiciona config de teste local e documenta setup"
git push origin main
```

---

## ▶️ Rodando a Aplicação (Versão 1: Script em Loop)

Esta é a implementação principal da atividade.

Execute o `app.js` e observe o console. Você verá os logs de `[PRIMÁRIO]` (escrita) e `[RÉPLICA]` (leituras) sendo gerados a cada segundo.

```bash
npm install
node app.js
```

```bash
git pull origin main
git add app.js README.md
git commit -m "feat(app): Implementa lógica de loop read/write no app.js"
git push origin main
```

---

## ▶️ Rodando a Aplicação (Versão 2: Servidor de API)

Esta é a implementação alternativa da atividade.

Execute o `api.js` para iniciar o servidor web.

```bash
npm install
node api.js
```

### Testando os Endpoints

**POST (Escrita no Primário):**

```bash
curl -X POST http://localhost:3000/produtos -H "Content-Type: application/json" -d "{\"descricao\":\"Teste API\", \"categoria\":\"API\", \"valor\":199.99}"
```

**GET (Leitura da Réplica):**  
(Use o ID retornado pelo comando POST)

```bash
curl http://localhost:3000/produto/1
```

```bash
git pull origin main
git add api.js README.md
git commit -m "feat(api): Implementa API alternativa e finaliza documentação"
git push origin main
```

---
