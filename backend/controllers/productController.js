import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { upload_on_cloudinary } from "../utils/cloudinary.utils.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    // Get the main image and additional images from the request
    console.log(req.files)
    const mainImage = req.files?.['image']?.[0]?.buffer;
    const additionalImages = req.files?.['additionalImages'] || [];

    if (!name || !brand || !description || !price || !category || !quantity || !mainImage) {
      return res.status(400).json({
        error: "All fields (name, brand, description, price, category, quantity, and main image) are required."
      });
    }

    // Handle category
    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: category });
    }

    // Upload main image to Cloudinary
    const mainImageUrl = await upload_on_cloudinary(mainImage);
    if (!mainImageUrl) {
      return res.status(400).json({
        error: "Failed to upload main image to Cloudinary"
      });
    }

    // Upload additional images to Cloudinary
    const additionalImageUrls = await Promise.all(
      additionalImages.map(file => upload_on_cloudinary(file.buffer))
    );

    // Filter out any null values from failed uploads
    const validAdditionalImageUrls = additionalImageUrls.filter(url => url !== null);

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      category: categoryDoc._id,
      quantity,
      distributor: req.user._id,
      image: mainImageUrl,
      additionalImages: validAdditionalImageUrls, // Store additional image URLs
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(400).json({ error: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    const fileBuffer = req.file ? req.file.buffer : null;

    // Validation
    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: "All fields (name, brand, description, price, category, quantity) are required."
      });
    }

    // Fields to update
    let updatedFields = { name, description, price, category, quantity, brand };

    // Upload image if present
    if (fileBuffer) {
      const uploadedUrl = await upload_on_cloudinary(fileBuffer);
      updatedFields.image = uploadedUrl;
    }

    // Update product details
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.search  
      ? {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};


    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductsById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  console.log(rating, comment);
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // Calculate average rating
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'username');

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product.reviews);
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchDistributorProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ distributor: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchSimilarProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const similarProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    })
      .limit(4)
      .select('name price image rating numReviews category')
      .populate('category', 'name');

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductsById,
  fetchAllProducts,
  createProductReview,
  getProductReviews,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  fetchDistributorProducts,
  fetchSimilarProducts,
};
