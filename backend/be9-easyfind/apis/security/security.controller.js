const SecurityItem = require('../../models/SecurityItem'); // Assuming a model for security items exists
const User = require('../../models/User');

// Get pending security items
exports.getPendingItems = async (req, res) => {
    try {
        const pendingItems = await SecurityItem.find({ status: 'pending' });
        res.status(200).json(pendingItems);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving pending items', error });
    }
};

// Verify a security item
exports.verifyItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await SecurityItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.status = 'verified';
        await item.save();
        res.status(200).json({ message: 'Item verified successfully', item });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying item', error });
    }
};

// Reject a security item
exports.rejectItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await SecurityItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.status = 'rejected';
        await item.save();
        res.status(200).json({ message: 'Item rejected successfully', item });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting item', error });
    }
};