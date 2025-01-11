import express from 'express';
import { createBlog, getBlogs, getBlogById } from '../controllers/blogController.js';
    
const router = express.Router();

router.route('/create').post(createBlog);
router.route('/get-blogs').get(getBlogs);
router.route('/:id').get(getBlogById);

export default router;