import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import OrphanageView from '../views/Orphanages_view';
import Orphanage from '../models/Orphanage';

export default{

   async index(request:Request, response:Response){
      const orphangesRepository = getRepository(Orphanage);

      const orphanages = await orphangesRepository.find({
         relations:['images']
      });

      return response.status(200).json(OrphanageView.renderMany(orphanages));
   },

   async show(request:Request, response:Response){

      const {id} = request.params;

      const orphangesRepository = getRepository(Orphanage);

      const orphanage = await orphangesRepository.findOneOrFail(id, {
         relations:['images']
      });

      return response.json(OrphanageView.render(orphanage));
   },

   async create(request:Request, response:Response){

      console.log(request.files);

      const {
         name, latitude, longitude, about, instructions, opening_hours, open_on_weekends,
      } = request.body;

      const orphangesRepository = getRepository(Orphanage);

      const requestImages = request.files as Express.Multer.File[];

      const images = requestImages.map(
         images =>{
            return { path: images.filename }
         }
      )

      const data = {
         name,
         latitude,
         longitude,
         about,
         instructions,
         opening_hours,
         open_on_weekends,
         images,
      };

      const schema = Yup.object().shape({
         name: Yup.string().required('Nome é obrigatório'),
         latitude: Yup.number().required('Latitude é obrigatório'),
         longitude: Yup.number().required('Longitude é obrigatória'),
         about: Yup.string().required('About é obrigatório').max(300),
         instructions: Yup.string().required('As instruções são obrigatórias'),
         opening_hours: Yup.string().required('Horário de Funcionamento é obrigatório'),
         open_on_weekends: Yup.boolean().required('A informação de abertura aos fins de semana é obrigatória'),
         images: Yup.array(Yup.object().shape({
            path: Yup.string().required('O nome do arquivo é obrigatório'),
         }))
      });

      await schema.validate(data, {
         // Faz retornar todos os erros de uma só vez
         abortEarly:false,
      });

      const orphanage = orphangesRepository.create(data);

      await orphangesRepository.save(orphanage);

      return response.status(201).json(orphanage);
   }

};
