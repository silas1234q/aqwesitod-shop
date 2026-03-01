import { Router } from "express";
import { createCategory, deleteCategory, updateCategory } from "../controllers/category.controller";
import { requireRole } from "../middleware/requireRole.middleware";

const router =  Router();

router.post('/',requireRole('ADMIN'),createCategory);

router.delete('/:categoryId',requireRole('ADMIN'),deleteCategory);

router.patch('/:categoryId',requireRole('ADMIN'),updateCategory);

export default router;