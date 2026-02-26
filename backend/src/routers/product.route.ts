import { Router } from "express";
import { deleteProduct } from "../controllers/product.controller";
import { requireRole } from "../middleware/requireRole.middleware";


const router = Router();

router.delete("/:productId", requireRole('ADMIN'), deleteProduct);

export default router;