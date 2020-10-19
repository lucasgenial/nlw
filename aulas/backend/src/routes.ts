import { Router } from 'express';
import multer from 'multer';


import OrphanagesController from './controllers/OrphanagesController';
import uploadConfig from './config/upload';

const routes = Router();
const upload = multer(uploadConfig);

// Rota = conjunto
// Recurso = usuário
// Métodos HTTP (GET, POST, PUT, DELETE)
// Tipos de Parâmetros

// / Query Params: http://localhost:3333/users?search=lucas&page=2
// / Route Params: http://locahost:3333/users/1
// / Body : http://locahost:3333/users/ JSON

// index, show, delete,
routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routes;
