const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware para leer datos de formularios HTML y usar EJS
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Inicializar Auth0
app.use(auth(config));

// RUTA 1: Página de inicio
app.get('/', (req, res) => {
  res.render('index', { user: req.oidc.user });
});

// RUTA 2: Formulario de edición (Punto 3)
app.get('/perfil', requiresAuth(), (req, res) => {
  const metadata = req.oidc.user.user_metadata || {};
  res.render('perfil', { user: req.oidc.user, metadata: metadata, success: req.query.success });
});

// FUNCIÓN AUXILIAR: Obtener el token de la App M2M (Punto 4)
async function getManagementToken() {
  const response = await axios.post(`${process.env.M2M_DOMAIN}/oauth/token`, {
    client_id: process.env.M2M_CLIENT_ID,
    client_secret: process.env.M2M_CLIENT_SECRET,
    audience: `${process.env.M2M_DOMAIN}/api/v2/`,
    grant_type: 'client_credentials'
  });
  return response.data.access_token;
}

// RUTA 3: Procesar el formulario y guardar en la API (Punto 4)
app.post('/perfil', requiresAuth(), async (req, res) => {
  try {
    const { tipo_documento, numero_documento, direccion, telefono } = req.body;
    
    // Si no tienes las credenciales M2M configuradas, mostramos un error controlado
    if (!process.env.M2M_CLIENT_ID) {
        return res.status(500).send("Faltan las credenciales de la App M2M en el archivo .env");
    }

    const token = await getManagementToken();
    const userId = req.oidc.user.sub; 
    
    await axios.patch(`${process.env.M2M_DOMAIN}/api/v2/users/${userId}`, {
      user_metadata: {
        tipo_documento,
        numero_documento,
        direccion,
        telefono
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.redirect('/perfil?success=true');

  } catch (error) {
    console.error("Error al actualizar:", error.response ? error.response.data : error.message);
    res.status(500).send("Error al guardar los datos en Auth0. Revisa la consola.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
