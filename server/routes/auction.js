import express from 'express';
import { createAuction, showAuction, auctionById, updateAuctionById, getUserAndProducts } from '../controllers/auction.controller.js';
import upload from '../middleware/multer.js';

const auctionRouter = express.Router();

auctionRouter.post('/create', upload.single('itemPhoto'), createAuction);
auctionRouter.get('/show', showAuction);
auctionRouter.get('/user/:id', getUserAndProducts);
auctionRouter.get('/:id', auctionById);
auctionRouter.post('/:id', updateAuctionById);

export default auctionRouter;
