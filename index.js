require('dotenv').config(); // Carrega variáveis de ambiente do .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000; // Porta definida em .env ou padrão 5000

// Configuração do middleware
app.use(cors()); // Permite todas as origens (apenas para desenvolvimento)
app.use(express.json()); // Permite lidar com JSON no corpo da requisição

// Endpoint para enviar SMS
app.post('/send-sms', async (req, res) => {
  const apiUrl = process.env.SMS_API_URL || 'http://api.mozesms.com/bulk_json/v2/'; // URL da API via variável de ambiente
  const token = process.env.SMS_API_TOKEN; // Token via variável de ambiente
  const sender = process.env.SMS_SENDER_ID || 'AGVIAGEM'; // ID do remetente via variável de ambiente

  // Verificar se o corpo da requisição contém mensagens
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "É necessário fornecer uma lista de mensagens." });
  }

  // Montando o payload com o sender e as mensagens
  const payload = {
    sender: sender,
    messages: messages,
  };

  try {
    // Envia a requisição para a API de SMS
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Adiciona o token de autenticação
        "Content-Type": "application/json", // Definir o tipo de conteúdo
      },
    });

    // Retorna a resposta para o frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Erro ao enviar mensagens:", error.response?.data || error.message);
    res.status(500).json({
      error: "Falha ao enviar as mensagens",
      details: error.response?.data || error.message, // Inclui mais detalhes sobre o erro
    });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
