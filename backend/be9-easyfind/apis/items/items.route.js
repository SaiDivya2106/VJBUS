const express = require('express');
const router = express.Router();
router.use(express.json());
const LostItem = require('../../models/LostItem');
const Item = require('../../models/FoundItem');
const { upload, cloudinary } = require('../../config/cloudinary')
const  auth =require('../../middlewares/auth')
const sendEmail = require("../../utils/notifications");
const stringSimilarity = require("string-similarity");

// Submit a lost item
router.post('/lost', async (req, res) => {
    try {
        const lostItem = new LostItem(req.body);
        await lostItem.save();
        console.log("submitted item with details",lostItem)
        res.status(201).json({ message: 'Lost item submitted successfully', lostItem });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting lost item', error });
    }
});



// Function to generate a random 4-character alphanumeric code
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Function to ensure the code is unique
async function generateUniqueCode() {
  let code;
  let exists = true;
  while (exists) {
      code = generateCode();
      exists = await Item.exists({ code });
  }
  return code;
}

// Submit a found item
// Create new item
router.post('/found', upload.single('image'), async (req, res) => {
  try {
      // Check if an image file was uploaded
      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: 'Image file is required'
          });
      }

      const { itemName, description, foundLocation, reporterRollNo, category,reportedDate } = req.body;

      // Validate required fields
      if (!itemName || !description || !foundLocation || !reporterRollNo) {
          return res.status(400).json({
              success: false,
              message: 'All fields (title, description, foundLocation, reporterRollNo) are required'
          });
      }

      // Generate a unique 4-character code
      const uniqueCode = await generateUniqueCode();

      // Prepare item data with default handover location
      const itemData = {
          itemName,
          description,
          foundLocation,
          reporterRollNo,
          handoverLocation: 'Security Office',
          status: 'pending',
          code: uniqueCode, // Assign the generated unique code
          image: {
              url: req.file.path,
              public_id: req.file.filename
          },
          reportedDate,
          category
      };

      console.log('Creating item with data:', itemData);

      // Save the new item to the database
      const newItem = new Item(itemData);
      const savedItem = await newItem.save();

      return res.status(201).json({
          success: true,
          item: savedItem
      });
  } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({
          success: false,
          message: error.message || 'Internal server error'
      });
  }
});





// Search for found items

router.get('/found', async (req, res) => {
  try {
      const foundItems = await Item.find().select('code itemName status image category description');

      if (!foundItems.length) {
          return res.status(404).json({ message: 'No found items available' });
      }

      res.status(200).json(foundItems);
  } catch (error) {
      console.error('Error fetching found items:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


  router.get('/reported/:id',async(req,res)=>{
    const ID=req.params.id;
    const reportedItems=await Item.find({ reporterRollNo:ID}).select('code itemName status image description foundLocation category');
    res.send(reportedItems)

  })
  router.get('/lost-items/:id',async(req,res)=>{
    try{
    const ID=req.params.id;
    const reportedItems=await LostItem.find({ email:ID});
    res.send(reportedItems)
    }catch(err){
      res.status(500).json({message:"error getting lost items"})
    }

  })
// delete the reported items that found
  router.delete("/lost/:id", async (req, res) => {
    try {
      const ID = req.params.id;
      const item = await LostItem.findById(ID);
      if (!item) return res.status(404).json({ message: "Item not found" });
      // if (item.status === "verified") return res.status(403).json({ message: "Cannot delete an verified item" });
  
      const deletedItem = await LostItem.findOneAndDelete({ _id: ID });
      res.json({ message: "Delete successful", payload: deletedItem });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // delete the items uploaded by a user that he lost
  router.delete("/reported/:id", async (req, res) => {
    try {
      const ID = req.params.id;
      const item = await Item.findById(ID);
      if (!item) return res.status(404).json({ message: "Item not found" });
      if (item.status === "approved") return res.status(403).json({ message: "Cannot delete an approved item" });
  
      const deletedItem = await Item.findOneAndDelete({ _id: ID });
      res.json({ message: "Delete successful", payload: deletedItem });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });


  /////////////////////////////////////////////// ADMIN ROUTES///////////////////////////
  // admin login
  // routes/adminAuth.js
// const express = require('express');
// const router = express.Router();
const Admin = require('../../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/admin/login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username });

    console.log("username:",admin)

    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }


    bcrypt.hash("password123", 10).then(hash => console.log(hash));


    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'password is incorrect' });
    }

    // Create a JWT payload
    const payload = { admin: { id: admin._id } };

    // Sign the JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // ensure this is defined in your environment
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        console.log("login successful")
        
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// checking if the token is valid or not
router.get('/admin/verify', auth, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});
// change password route for admin

router.post("/admin/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Admin.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" ,error:error });
  }
});

// admin found
router.get('/admin/found',auth, async (req, res) => {
  try {
    // Fetch all items without any query condition
    const foundItems = await Item.find();
    
    if (foundItems.length === 0) {
      return res.status(404).json({ message: 'No found items available' });
    }

    res.status(200).json(foundItems);
  } catch (error) {
    console.error('Error fetching found items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  // admin upload
  // const stringSimilarity = require("string-similarity");

  router.post('/admin/upload', auth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
  
      const { itemName, description, foundLocation, category, reportedDate } = req.body;
      if (!itemName || !description || !foundLocation || !category) 
        return res.status(400).json({ success: false, message: 'All fields are required' });
  
      const newItem = await Item.create({
        itemName,
        description,
        foundLocation,
        category,
        handoverLocation: 'Security Office',
        status: 'verified', // Admin uploads directly as verified
        code: await generateUniqueCode(),
        reportedDate,
        image: { url: req.file.path, public_id: req.file.filename }
      });
  
      // After uploading, check for similar lost items
      const lostItems = await LostItem.find({});
      let notified = false;
  
      for (const lostItem of lostItems) {
        const checker = [
          lostItem.itemName,
          lostItem.category,
          lostItem.location,
          lostItem.dateLost,
          lostItem.description
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
  
        const similarity = stringSimilarity.compareTwoStrings(
          description.toLowerCase(),
          checker
        );
  
        if (similarity > 0.3) { // adjust threshold if needed
          await sendEmail(
            lostItem.email,
            "Update: Lost Item Match Found!",
            `Dear user,
  
  We believe we’ve found a possible match for your lost item: "${lostItem.itemName}" based on the details you've provided. A similar item has just been verified and uploaded to our system.
  
  Please log in to your account to view more details and take further action.
  
  If you no longer want updates about this item, you can remove it from your lost item list.
  
  Best regards,  
  EasyFind-VNRVJIET`
          );
          console.log("Email sent to:", lostItem.email);
          notified = true;
        }
      }
  
      if (!notified) {
        console.log("No similar lost items found for uploaded item:", newItem.description);
      }
  
      console.log("Item created with data from admin:", newItem);
      res.status(201).json({ success: true, item: newItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

// handover items
router.put("/admin/:id/handover",auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Proof image required" });

    const { id } = req.params;
    const { contact, rollNo, name } = req.body;

    if (!contact || !rollNo || !name) {
      return res.status(400).json({ success: false, message: "All fields (contact, rollNo, name) are required" });
    }

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // Update status and store Cloudinary image details
    item.status = "claimed";
    item.claimerDetails = {
      contact,
      rollNo,
      name,
      proofs: [
        ...(item.claimerDetails?.proofs || []),
        { url: req.file.path, public_id: req.file.filename }
      ]
    };

    await item.save();
    console.log("Item handed over successfully with item details", item);
    res.json({ success: true, message: "Item handed over successfully", item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});



// Route to update item status and send the notification
// const stringSimilarity = require("string-similarity");


router.patch("/admin/updatestatus", auth, async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "Item ID and status are required" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status === "claimed" && status === "pending") {
      return res.status(400).json({ message: "Cannot change claimed item back to pending" });
    }

    await Item.updateOne({ _id: id }, { $set: { status } });

    // If the item is verified, compare with all lost items
    if (status === "verified" && item.description) {
      const lostItems = await LostItem.find({});
      let notified = false;

      for (const lostItem of lostItems) {
        // Create the checker string using lost item fields
        const checker = [
          lostItem.itemName,
          lostItem.category,
          lostItem.location,
          lostItem.dateLost,
          lostItem.description
        ]
          .filter(Boolean) // Remove undefined/null
          .join(" ")
          .toLowerCase();

        const similarity = stringSimilarity.compareTwoStrings(
          item.description.toLowerCase(),
          checker
        );

        // Adjust the threshold as needed (0.3-0.5 is common)
        if (similarity > 0.3) {
          await sendEmail(
            lostItem.email,
            "Update: Lost Item Match Found!",
            `Dear user,

We believe we’ve found a possible match for your lost item: "${lostItem.itemName}" based on the details you've provided. A similar item has just been verified in our system.

Please log in to your account to view more details and take further action.

If you no longer want updates about this item, you can remove it from your lost item list.

Best regards,  
EasyFind-VNRVJIET`
          );
          console.log("Email sent to:", lostItem.email);
          notified = true;
        }
      }

      if (!notified) {
        console.log("No similar lost items found for item description:", item.description);
      }
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


////////////////// edit the documents ex:deleting,...

// Update Found Item (Admin Route)
router.put('/admin/edit-item/:id', async (req, res) => {
  try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!updatedItem) {
          return res.status(404).json({ message: 'Item not found' });
      }

      res.status(200).json(updatedItem);
  } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete Found Item (Admin Route)
router.delete('/admin/edit-item/:id', async (req, res) => {
  try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);

      if (!deletedItem) {
          return res.status(404).json({ message: 'Item not found' });
      }

      res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;




