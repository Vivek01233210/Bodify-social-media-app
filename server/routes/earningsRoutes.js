import express from 'express';
import { getAllEarnings, getUserEarnings } from '../controllers/earningController.js';
import {protect} from '../middlewares/protect.js';


const Router = express.Router();

Router.get("/", getAllEarnings);

Router.get("/my-earnings",protect, getUserEarnings);

export default Router;