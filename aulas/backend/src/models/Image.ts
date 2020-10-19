import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { createOrphanages1602989264221 } from '../database/migrations/1602989264221-create_orphanages';
import Orphanage from './Orphanage';

@Entity('images')
export default class Image{
   @PrimaryGeneratedColumn('increment')
   id:number;

   @Column()
   path: string;

   @ManyToOne(() => Orphanage, orphanage => orphanage.images)
   @JoinColumn({name: 'orphanage_id'})
   orphanage: Orphanage;
}
