import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 
import routes from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'; 
import cors from 'cors'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const MONGO_URL = `mongodb+srv://Geek:Database123@cluster0.9m4agr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(bodyParser.json());

// Enable CORS
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

// swagger
const swaggerJsDocs = YAML.load('./api.yaml'); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

// Routes
app.use('/', routes);

// Healthy check
app.get('/ping', (req, res) => {
    res.json({ "you are": "free to go" });
});
// no request
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'check the request again' });
});

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error: ', err);
    });

export default app;
