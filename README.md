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

