const mysql = require('mysql2/promise');

// --- 1. CONFIGURAÇÕES DE CONEXÃO ---

// --- CONFIGURAÇÃO PARA TESTE LOCAL (COM DOCKER) ---
console.log("AVISO: Rodando em modo de TESTE LOCAL (Docker).");
const primaryConfig = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'aula-db'
};

const replicaConfig = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'aula-db'
};


/*
// --- CONFIGURAÇÃO PARA A APRESENTAÇÃO (BANCO DO PROFESSOR) ---
console.log("AVISO: Rodando em modo de APRESENTAÇÃO (Banco Oficial).");
const primaryConfig = {
    host: '<<host_primario_aqui>>',
    user: '<<seu_usuario_aqui>>',
    password: '<<sua_senha_aqui>>',
    database: 'aula-db'
};

const replicaConfig = {
    host: '<<host_replica_aqui>>',
    user: '<<seu_usuario_aqui>>',
    password: '<<sua_senha_aqui>>',
    database: 'aula-db'
};
// --- FIM DA CONFIGURAÇÃO DE APRESENTAÇÃO ---
*/

// --- 2. CRIAÇÃO E EXPORTAÇÃO DOS POOLS ---
console.log("Criando pools de conexão (Primário e Réplica)...");
const primaryPool = mysql.createPool(primaryConfig);
const replicaPool = mysql.createPool(replicaConfig);

// Exporta os dois pools para serem usados em outros arquivos
module.exports = {
    primaryPool,
    replicaPool
};