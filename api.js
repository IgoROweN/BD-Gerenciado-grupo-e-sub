const express = require('express');
// Importa os pools de conexão do nosso módulo 'db.js'
const { primaryPool, replicaPool } = require('./db.js');

// --- 1. CONFIGURAÇÕES ---
const NOME_DO_GRUPO = "grupo-e-sub";
const PORTA = 3000;

// --- 3. INICIALIZAÇÃO DA API ---
const app = express();
app.use(express.json());

// --- 4. DEFINIÇÃO DAS ROTAS (ENDPOINTS) ---

/**
 * Rota POST /produtos
 * Esta rota usa o POOL PRIMÁRIO para inserir dados.
 */
app.post('/produtos', async (req, res) => {
    try {
        const { descricao, categoria, valor } = req.body;
        if (!descricao || !categoria || !valor) {
            return res.status(400).json({ error: 'Campos descricao, categoria e valor são obrigatórios.' });
        }

        const sql = `
            INSERT INTO produto (descricao, categoria, valor, criado_por) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await primaryPool.execute(sql, [
            descricao,
            categoria,
            valor,
            NOME_DO_GRUPO
        ]);

        const insertId = result.insertId;
        const produtoCriado = {
            id: insertId,
            descricao,
            categoria,
            valor,
            criado_por: NOME_DO_GRUPO
        };
        
        console.log(`[PRIMÁRIO] Produto inserido via API: ID ${insertId}`);
        res.status(201).json(produtoCriado);

    } catch (error) {
        console.error("[PRIMÁRIO] Erro ao inserir:", error);
        res.status(500).json({ error: 'Erro interno no servidor ao tentar inserir produto.' });
    }
});

/**
 * Rota GET /produto/:id
 * Esta rota usa o POOL DE RÉPLICA para ler dados.
 */
app.get('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM produto WHERE id = ?";

        const [rows] = await replicaPool.execute(sql, [id]);
        
        if (rows.length === 0) {
            console.log(`[RÉPLICA] Busca por ID ${id}: Não encontrado.`);
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        const produtoEncontrado = rows[0];
        console.log(`[RÉPLICA] Produto consultado via API: ID ${produtoEncontrado.id}`);
        res.status(200).json(produtoEncontrado);

    } catch (error) {
        console.error("[RÉPLICA] Erro ao selecionar:", error);
        res.status(500).json({ error: 'Erro interno no servidor ao tentar buscar produto.' });
    }
});

// --- 5. INÍCIO DO SERVIDOR ---
app.listen(PORTA, () => {
    console.log(`Servidor da API rodando na porta ${PORTA}`);
    console.log(`- POST http://localhost:${PORTA}/produtos`);
    console.log(`- GET http://localhost:${PORTA}/produto/:id`);
});