const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000; 

app.use(cors()); 
app.use(express.json()); 

app.post('/send-sms', async (req, res) => {
  const apiUrl = "http://api.mozesms.com/bulk_json/v2/";

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "É necessário fornecer uma lista de mensagens." });
  }

  const payload = {
    sender: "AGVIAGEM", 
    messages: messages,
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer 2275:otCWXf-5G7Ys6-DdA6Kc-WLXsW6`, 
        "Content-Type": "application/json", 
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Erro ao enviar mensagens:", error.response?.data || error.message);
    res.status(500).json({
      error: "Falha ao enviar as mensagens",
      details: error.response?.data || error.message, 
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
