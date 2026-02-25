import { Router } from "express";
import { requireClerkAuth } from "../middleware/requireAuth.middleware";
import { addToCart, removeCartItem, updateCartQuantity } from "../controllers/cart.controller";

const router = Router();

router.post('/cart',addToCart)
router.delete('/cart/:cartId',requireClerkAuth,removeCartItem)
router.patch('/cart/:cartId',requireClerkAuth,updateCartQuantity)


export default router;