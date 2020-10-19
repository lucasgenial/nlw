import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Orphanage from '../models/Orphanage';

export default{

   async index(request:Request, response:Response){
      const orphangesRepository = getRepository(Orphanage);

      const orphanages = await orphangesRepository.find({
         relations:['images']
      });

      return response.status(200).json(orphanages);
   },

   async show(request:Request, response:Response){

      const {id} = request.params;

      const orphangesRepository = getRepository(Orphanage);

      const orphanage = await orphangesRepository.findOneOrFail(id, {
         relations:['images']
      });

      return response.json(orphanage);
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

      const orphanage = orphangesRepository.create({
         name, latitude, longitude, about, instructions, opening_hours, open_on_weekends, images
      });

      await orphangesRepository.save(orphanage);

      return response.status(201).json(orphanage);
   }

};
