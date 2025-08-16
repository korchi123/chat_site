import { Router } from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middleware.js/authMiddleware.js";
const router=new Router()

router.post('/create', authMiddleware, postController.create);
router.delete('/delete/:id', authMiddleware, postController.delete);
router.get('/allposts', postController.getAllPosts);
router.get('/getallmyposts',authMiddleware, postController.getAllMyPosts);
router.get('/search', postController.searchPosts);
router.get('/:id', postController.getOne);


// Лайки
// router.post('/:id/like', authMiddleware, postController.like);
// router.delete('/:id/like', authMiddleware, postController.unlike);



export default router
