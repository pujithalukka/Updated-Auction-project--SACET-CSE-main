import Product from '../models/product.js';
import User from '../models/user.js';

const createAuction = async (req, res) => {
    try {
        console.log('Creating auction with data:', {
            body: req.body,
            file: req.file ? {
                path: req.file.path,
                filename: req.file.filename,
                mimetype: req.file.mimetype
            } : 'No file'
        });

        const { itemName, itemPrice, itemDescription, itemCategory, itemStartDate, itemEndDate, seller } = req.body;
        
        // Validate required fields
        if (!itemName || !itemPrice || !itemDescription || !itemCategory || !itemStartDate || !itemEndDate || !seller) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                receivedData: { itemName, itemPrice, itemDescription, itemCategory, itemStartDate, itemEndDate, seller }
            });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ 
                message: 'Image file is required',
                receivedFile: req.file || 'No file received'
            });
        }

        // Get the Cloudinary URL from multer-storage-cloudinary
        const imageUrl = req.file.path;

        // Create new auction
        const newAuction = new Product({
            itemName,
            itemPrice: Number(itemPrice),
            itemDescription,
            itemCategory,
            itemPhoto: imageUrl,
            itemStartDate: new Date(itemStartDate),
            itemEndDate: new Date(itemEndDate),
            seller,
        });

        await newAuction.save();
        console.log('Auction created successfully:', newAuction._id);
        
        res.status(201).json({ 
            message: 'Auction created successfully', 
            auction: newAuction 
        });

    } catch (error) {
        console.error('Auction creation error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            message: 'Error creating auction',
            error: error.message
        });
    }
};

const showAuction = async (req, res) => {
    try {
        const currentDate = Date.now();
        const auctions = await Product.find({ itemEndDate: { $gte: currentDate } }).sort({ createdAt: -1 }).populate('seller', '_id name');
        return res.status(200).json({ message: 'All auctions', auctions });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching auctions', error: error.message });
    }
}

const auctionById = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const auction = await Product.findById(req.params.id).populate('seller', '_id name createdAt').populate({
            path: 'bids.bidder',
            select: 'name'
        });
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        auction.bids = auction.bids.sort((a, b) => b.bid - a.bid);

        // Pagination

        const startIndex = (page - 1) * limit;
        const paginatedBids = auction.bids.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            message: 'Auction found',
            auction: {
                ...auction.toObject(),
                bids: paginatedBids,
                totalBids: auction.bids.length,
                totalPages: Math.ceil(auction.bids.length / limit),
                currentPage: parseInt(page)
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching auction', error: error.message });
    }
}

const updateAuctionById = async (req, res) => {
    try {
        const { bid, bidder } = req.body;
        const auction = await Product.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        if (auction.itemEndDate < Date.now()) {
            return res.status(400).json({ message: 'Auction has ended' });
        }
        if (auction.itemPrice >= bid) {
            return res.status(400).json({ message: 'Bid must be greater than current price' });
        }
        auction.itemPrice = bid;
        auction.bids.push({ bidder, bid, time: Date.now() });
        await auction.save();
        return res.status(200).json({ message: 'Auction updated successfully', auction });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating auction', error: error.message });
    }
};

const getUserAndProducts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's products
        const products = await Product.find({ seller: req.params.id });

        // Get bids made BY the user on other auctions (excluding their own auctions)
        const bidsMadeByUser = await Product.aggregate([
            { 
                $match: { 
                    seller: { $ne: user._id } // Exclude user's own auctions
                }
            },
            { $unwind: "$bids" },
            { 
                $match: { 
                    "bids.bidder": user._id 
                }
            },
            { $count: "count" }
        ]);

        // Get total bids received ON user's auctions
        const bidsOnUserProducts = await Product.aggregate([
            { 
                $match: { 
                    seller: user._id 
                }
            },
            { $unwind: "$bids" },
            { $count: "count" }
        ]);

        const bidStats = {
            bidsMade: bidsMadeByUser[0]?.count || 0,      // Bids made by user on other auctions
            bidsReceived: bidsOnUserProducts[0]?.count || 0  // Bids received on user's auctions
        };

        return res.status(200).json({
            message: 'User and products found',
            user: {
                ...user.toObject(),
                bidStats
            },
            products
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { createAuction, showAuction, auctionById, updateAuctionById, getUserAndProducts };




