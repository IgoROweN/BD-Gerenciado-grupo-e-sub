// Importa os pools de conexão do nosso módulo 'db.js'
const { primaryPool, replicaPool } = require('./db.js');

// --- 1. CONFIGURAÇÕES ---
const NOME_DO_GRUPO = "grupo-e-sub";
const INTERVALO_MS = 1000;

/**
 * Função para inserir um produto.
 * Usa o POOL PRIMÁRIO (Escrita).
 */
async function inserirProduto(produto) {
    const sql = `
        INSERT INTO produto (descricao, categoria, valor, criado_por) 
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await primaryPool.execute(sql, [
        produto.descricao,
        produto.categoria,
        produto.valor,
        produto.criado_por
    ]);
    return result.insertId;
}

/**
 * Função para selecionar um produto por ID.
 * Usa o POOL DE RÉPLICA (Leitura).
 */
async function selecionarProdutoPorId(id) {
    const sql = "SELECT * FROM produto WHERE id = ?";
    const [rows] = await replicaPool.execute(sql, [id]);
    return rows[0];
}

/**
 * Função principal que executa o loop da atividade.
 */
async function mainLoop() {
    try {
        // --- 3. INSERÇÃO (REQUISITO 1) ---
        const agora = Date.now();
        const produtoNovo = {
            descricao: `Produto Teste ${agora}`,
            categoria: 'Geral',
            valor: (Math.random() * 100).toFixed(2),
            criado_por: NOME_DO_GRUPO
        };

        // Insere no banco PRIMÁRIO
        const novoId = await inserirProduto(produtoNovo);

        // --- 4. PRINT DO INSERT (REQUISITO 2) ---
        console.log("====================================================");
        console.log(`[PRIMÁRIO] Produto inserido com sucesso!`);
        
        console.log(`> ID: ${novoId}, Descrição: ${produtoNovo.descricao}, Categoria: ${produtoNovo.categoria}, Valor: ${produtoNovo.valor}, Criado Por: ${produtoNovo.criado_por}`);
        
        console.log("----------------------------------------------------");

        // --- 5. SELECTS NA RÉPLICA (REQUISITO 3) ---
        console.log(`[RÉPLICA] Realizando 10 selects individuais dos IDs anteriores...`);

        for (let i = 1; i <= 10; i++) {
            const idParaBuscar = novoId - i;

            if (idParaBuscar > 0) {
                const produtoEncontrado = await selecionarProdutoPorId(idParaBuscar);
                
                // --- 6. PRINT DOS SELECTS (REQUISITO 4) ---
                if (produtoEncontrado) {
                    console.log(`> [RÉPLICA] SELECT ID ${idParaBuscar}:`, produtoEncontrado);
                } else {
                    console.log(`> [RÉPLICA] SELECT ID ${idParaBuscar}: (Não encontrado)`);
                }
            }
        }
        console.log("====================================================\n");

    } catch (error) {
        console.error("Ocorreu um erro no loop:", error);
    }
}

// --- 7. INÍCIO DO LOOP ---
console.log(`Iniciando loop de inserção/seleção a cada ${INTERVALO_MS}ms...`);
setInterval(mainLoop, INTERVALO_MS);