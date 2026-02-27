import { Router } from "express";
import { addProduct, deleteProduct, updateProduct } from "../controllers/product.controller";
import { requireRole } from "../middleware/requireRole.middleware";


const router = Router();

router.delete("/:productId", requireRole('ADMIN'), deleteProduct);

router.post("/", requireRole('ADMIN'), addProduct);

router.put("/:productId", requireRole('ADMIN'), updateProduct);

export default router;