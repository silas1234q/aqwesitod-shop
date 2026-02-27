import {Router} from 'express';
import { getUploadSignature } from '../controllers/cloudinary.controller';


const router = Router()

router.get('/cloudinary-signature',getUploadSignature)

export default router;