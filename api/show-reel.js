import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

// Lista de dominios permitidos (GitHub Pages y Vercel)
const allowedOrigins = [
  'https://humbertofb.github.io/yuli-web/index.html',
  'https://yuli-web.vercel.app',
  'https://yuli-web-git-main-humbers-projects-cc0e4db8.vercel.app'
];

// Middleware CORS que gestiona solicitudes de diferentes orígenes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a las solicitudes preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No Content
  }
  
  next();
});

app.use(express.json());

// Ruta para manejar la solicitud de obtención de Reel
app.post('/api/show-reel', async (req, res) => {
  const reelUrl = req.body.reelUrl;

  // Validar el URL del reel
  if (!reelUrl.includes('facebook.com/reel/')) {
    return res.status(400).json({ videoUrl: null, error: 'Por favor, ingresa un enlace válido de Facebook Reel.' });
  }

  try {
    // Llamada al servicio externo usando Axios
    const options = {
      method: 'GET',
      url: 'https://fb-video-reels.p.rapidapi.com/v1/reel',
      params: { url: reelUrl },
      headers: {
        'X-RapidAPI-Key': 'abb70aa0e0msh885fe8fc6690657p1bceb2jsnd4604475bd70',
        'X-RapidAPI-Host': 'fb-video-reels.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const videoUrl = response.data.videoUrl;

    // Devolver el URL del video si se extrae con éxito
    if (videoUrl) {
      res.json({ videoUrl });
    } else {
      res.json({ videoUrl: null, error: 'No se pudo extraer el video. Verifica el enlace.' });
    }
  } catch (error) {
    console.error('Error al obtener el Reel:', error);
    res.status(500).json({ videoUrl: null, error: 'Ocurrió un error al procesar el enlace.' });
  }
});

export default app;
