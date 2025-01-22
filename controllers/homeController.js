const Product=require('../models/HomeModel.js');

const addGame=async(req,res)=>{
    try {
        const { game_name, users, short_description, category_name, description, product_image,banner_image } = req.body;
    
        // Create a new product instance
        const newProduct = new Product({
          game_name,
          users,
          short_description,
          category_name,
          description,
          product_image,
          banner_image
        });
    
        // Save the product to the database
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: savedProduct });
      } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
      }
}

const getGame = async (req, res) => {
    try {
      const groupedProducts = await Product.aggregate([
        {
          $group: {
            _id: { category_name: "$category_name" },
            products: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            category_id: "$_id.category_id",
            category_name: "$_id.category_name",
            products: 1,
            _id: 0,
          },
        },
      ]);
  
      if (groupedProducts.length === 0) {
        return res.status(404).json({ message: 'No products found' });
      }
  
      res.status(200).json(groupedProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};
module.exports={addGame,getGame}