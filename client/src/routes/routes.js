import Auth from '../pages/Auth.js';
import Login from '../pages/Login.js';
import Posts from '../pages/Posts.js';
import DeleteAccount from '../pages/DeleteAccount.js';
import CreatePost from '../pages/CreatePost.js';
import MyPosts from '../pages/MyPosts.js';
import SinglePost from '../pages/SinglePost.js';
import Profile from '../pages/Profile.js';
import EditProfile from '../pages/EditProfile.js';
import UserProfile from '../pages/UserProfile.js';
import { Registration_Route, Login_Route, Posts_Route, DeleteAccount_Route, Create_Post,
    My_Posts, Post_Route, Profile_Route, EditProfile_route, UserProfile_Route
 } from '../utils/consts.js';


export const publicRouter=[
    {
        path: Registration_Route,
        element: <Auth /> 
    },
    {
        path: Login_Route,
        element: <Login /> 
    },
    {
        path: Posts_Route,
        element: <Posts /> 
    },
    {
        
    path: `${Post_Route}/:id`,
    element: <SinglePost />
  
    },
    
]

export const authRouter=[
    {
        path: DeleteAccount_Route,
        element: <DeleteAccount /> 
    },
    {
        path: Create_Post,
        element: <CreatePost /> 
    },
    {
        path: My_Posts,
        element: <MyPosts /> 
    },
    {
        path: EditProfile_route,
        element: <EditProfile /> 
    },
    {
        path: Profile_Route,
        element: <Profile /> 
    },
    {
        path: `${UserProfile_Route}/:userId`,
        element: <UserProfile /> 
    },
    
]