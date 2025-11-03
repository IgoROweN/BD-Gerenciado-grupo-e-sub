# Projeto: Read/Write Splitting com Node.js e MySQL

Este é um projeto acadêmico para a disciplina de **Computação em Nuvem** da **Fatec Franca - Dr. Thomaz Novelino**, do curso de Desenvolvimento de Software Multiplataforma.

O objetivo é implementar e demonstrar o padrão de arquitetura de **Read/Write Splitting** (Separação de Leitura/Escrita), direcionando operações de `INSERT` para um banco de dados primário (escrita) e operações de `SELECT` para uma réplica (leitura).

**Grupo:** `grupo-e-sub`
**Integrantes:** Igor Owen Silva de Paula, Pedro Goncalves Moreira, Samuel Santos Souza e Vinicius Baldochi Cardoso

---

## 🚀 Funcionalidades

Este repositório contém duas implementações da mesma lógica:

1.  **`app.js`**: Um script de console que roda em loop. A cada segundo, ele:
    * **Escreve (Write)**: Insere um novo produto no banco primário.
    * **Lê (Read)**: Realiza 10 `SELECTs` individuais no banco de réplica.

2.  **`api.js`**: Um servidor de API (usando Express.js) que expõe dois endpoints:
    * `POST /produtos`: **Escreve (Write)** um novo produto no banco primário.
    * `GET /produto/:id`: **Lê (Read)** um produto específico do banco de réplica.

3.  **`db.js`**: Módulo de configuração de conexão com o banco de dados:
    * Cria dois pools de conexão separados: um para o banco primário (escrita) e outro para a réplica (leitura).
    * Permite alternar entre modo de teste local (Docker) e modo de apresentação (banco oficial).
    * Exporta os pools `primaryPool` e `replicaPool` para serem utilizados nos outros módulos.

## 🛠️ Pré-requisitos

* [Node.js](https://nodejs.org/) (v20.9.0 ou superior)
* [Docker](https://www.docker.com/)

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
Dentro do prompt mysql>, cole:
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


