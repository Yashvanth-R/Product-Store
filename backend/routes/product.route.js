import express from 'express';
import {createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', (req, res, next) => {
    req.upload.single('image')(req, res, next);
}, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
