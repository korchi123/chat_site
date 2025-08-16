import { Router } from "express";
import userRouter from './userroutes.js'
import postsRouter from './postsroutes.js'
import commentsRouter from './commentsrouter.js'
import likerouter from './likeroutes.js'
import profileroutes from './profileroutes.js'
const router=new Router()

router.use('/user', userRouter)
router.use('/posts', postsRouter)
router.use('/comments', commentsRouter); // Добавляем отдельный роутер для комментариев
router.use('/likes', likerouter)
router.use('/profile', profileroutes)



export default router
