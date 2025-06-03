# CLiaBLE 

CLiaBLE es una solución inteligente para verificar la **fiabilidad de usuarios en eventos**, integrando tecnologías de verificación y análisis semántico. Su objetivo es mejorar la autenticidad de las reseñas, evitar el fraude en entradas, y ofrecer datos valiosos a los organizadores de eventos.

---

##  ¿Para qué sirve?

CLiaBLE permite:
- Validar que los usuarios han comprado entradas legítimas y han asistido físicamente al evento.
- Evitar la reventa o el acceso fraudulento.
- Generar reseñas auténticas (solo asistentes pueden opinar).
- Calcular un **índice de fiabilidad** por usuario.
- Recomendar eventos personalizados según reseñas previas.
- Proporcionar analíticas detalladas a organizadores (fiabilidad, comportamiento, segmentación).

Aplicable a:
- Conciertos, discotecas, eventos deportivos.
- Restauración, salud (citas médicas).
- Compra-venta de segunda mano.

---

##  Arquitectura

![Arquitectura General](/img/image.png)  
_Visualización de capas: integración, aplicación, datos e inteligencia._

### Tecnologías utilizadas:
- **Open Gateway APIs**: KnowYourCustomer, NumberVerification, DeviceLocationVerification.
- **MongoDB**: Almacenamiento estructurado, embeddings y analítica.
- **Embeddings + AI**: Búsqueda semántica y análisis de reseñas (OpenAI, Gemini).
- **TypeScript + REST API**: Backend y frontend de la solución.

---

##  Demo

📺 **[Ver la demo aquí](https://youtu.be/4VWXtrW9VNw)**

---

## ⚙️ Despliegue Front

### Requisitos
- Node.js >= 18
- MongoDB Atlas (o instancia local)
- API Keys de Open Gateway (KYC, Location, Number Verification)
- `.env` con claves necesarias

### Pasos
```bash
# 1. Clona el repositorio
git clone https://github.com/tu_usuario/CLiaBLE.git
cd CLiaBLE

# 2. Instala dependencias
npm install

# 3. Crea archivo .env
cp .env.example .env
# 👉 Rellena con tus API keys

# 4. Inicia el servidor
npm run dev
```

## ⚙️ Despliegue Backend

El backend principal se encuentra en `backend/src/app/main.py` y utiliza FastAPI.

#### Pasos para desplegar el backend:
```bash
# 1. Ve al directorio del backend
cd backend

# 2. Instala las dependencias (usa un entorno virtual si lo prefieres)
pip install -r requirements.txt

# 3. Inicia el servidor FastAPI
uvicorn src.app.main:app --reload
```
Esto levantará la API en `http://localhost:8000`.