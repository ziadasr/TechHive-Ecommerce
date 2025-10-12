import { Request, Response } from "express";
import Product from "../models/productModel";
import { Errors } from "../models/errorsModel";
import { Messages } from "../models/messages";
import Brand from "../models/brandmodel";
import { configDotenv } from "dotenv";
import { Op } from "sequelize";

const getAllProducts = async (req: Request, res: Response) => {
  //http://localhost:5172/?page=1&size=12&min_price=5000&brand_ids=2
  // --- 1. Extraction and Defaults ---
  const pageNumber = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.size as string) || 12;
  const offset = (pageNumber - 1) * pageSize;

  // We must use the snake_case keys used by the frontend: min_price and brand_ids
  const minPriceQuery = req.query.min_price as string;
  const maxPriceQuery = req.query.max_price as string;
  const brandIdsQuery = req.query.brand_ids as string;
  const sortByQuery = req.query.sort_by as string;

  // --- 2. Dynamic Query Construction (Sequelize Format) ---

  let orderClause: any = [["createdAt", "DESC"]]; // Default sort by creation date descending
  if (sortByQuery) {
    switch (sortByQuery) {
      case "price_asc":
        orderClause = [["price", "ASC"]];
        break;
      case "price_desc":
        orderClause = [["price", "DESC"]];
        break;
      // Add other cases as needed
      // If no match, it falls through and keeps the default 'createdAt' sort
    }
  }

  // --- 2. Dynamic Query Construction (Sequelize Format) ---

  // Initialize the Sequelize 'where' object and the parameter list
  // The 'where' object will be automatically managed by Sequelize
  const whereCondition: any = {};

  try {
    console.log("Fetching all products from database...");

    // Price Filtering (using Sequelize Op.gte and Op.lte)
    if (minPriceQuery) {
      // FIX: Ensure it is a valid number before using
      const minPrice = parseFloat(minPriceQuery);
      if (!isNaN(minPrice)) {
        //is not a number to check the validity of the number
        whereCondition.price = {
          ...(whereCondition.price || {}),
          [Op.gte]: minPrice,
        };
      }
    }

    if (maxPriceQuery) {
      const maxPrice = parseFloat(maxPriceQuery);
      if (!isNaN(maxPrice)) {
        whereCondition.price = {
          ...(whereCondition.price || {}),
          [Op.lte]: maxPrice,
        };
      }
    }

    // Brand Filtering (using Sequelize Op.in)
    if (brandIdsQuery) {
      // FIX 3: Parse the comma-separated string into an array of IDs
      const brandIds = brandIdsQuery.split(",").map((id) => id.trim());

      // Sequelize Op.in handles arrays automatically
      whereCondition.brand_id = { [Op.in]: brandIds };
    }

    // --- 4. Execute Query with Dynamic 'where' Condition ---

    // findAndCountAll is a sequelize method that combines findAll and count methods
    const result = await Product.findAndCountAll({
      limit: pageSize, // number of products to return
      offset, // number of products to skip
      order: orderClause,
      where: whereCondition, // <-- The dynamic filter is applied here
    });

    const totalPages = Math.ceil(result.count / pageSize);

    // --- 5. Return Response ---
    res.status(Messages.SUCCESS_GET_PRODUCTS.status).json({
      products: result.rows,
      totalItems: result.count,
      totalPages,
      currentPage: pageNumber,
      message: Messages.SUCCESS_GET_PRODUCTS.message,
      code: Messages.SUCCESS_GET_PRODUCTS.code,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

// const getAllProducts = async (req: Request, res: Response) => {
//   const pageNumber = parseInt(req.query.page as string) || 1;
//   const pageSize = parseInt(req.query.size as string) || 12;
//   const offset = (pageNumber - 1) * pageSize;

//   //the following params are optional for filtering would not exist all the time
//   const minPrice = req.query.minPrice;
//   const maxPrice = req.query.maxPrice;
//   const brandIds = req.query.selectedBrandIds;

//   //postman tested and works well with url http://localhost:5172/?page=1&size=3
//   //* this calculates how many products to skip based on the current page number and page size.
//   /**
//    * for example the pagenumber is 4 and the page size is 12
//    * then the offset will be (4-1)*12 = 36
//    * so the query will skip the first 36 products and return the next 12 products
//    * which total is 48 products
//    */
//   try {
//     console.log("Fetching all products from database...");
//       // Convert the "5,10" string back to a usable list/
//       // array for the database const ids = brandIdsString.split(','); whereClauses.push("brand_id IN ($3, $4, ...)"); }

//     // findAndCountAll is a sequelize method that combines findAll and count methods
//     const result = await Product.findAndCountAll({
//       limit: pageSize, //number of products to return
//       offset, //number of products to skip
//       order: [["createdAt", "DESC"]],
//     });
//     const totalPages = Math.ceil(result.count / pageSize); //calculate total pages after getting total products count
//     res.status(Messages.SUCCESS_GET_PRODUCTS.status).json({
//       products: result.rows,
//       totalItems: result.count,
//       totalPages,
//       currentPage: pageNumber,
//       message: Messages.SUCCESS_GET_PRODUCTS.message,
//       code: Messages.SUCCESS_GET_PRODUCTS.code,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(Errors.INTERNAL_ERROR.status).json({
//       error: Errors.INTERNAL_ERROR.message,
//       code: Errors.INTERNAL_ERROR.code,
//     });
//   }
// };

const addProduct = async (req: Request, res: Response) => {
  const product = req.body;
  try {
    await Product.create(product);
    res.status(Messages.NEW_PRODUCT_ADDED.status).json({
      message: Messages.NEW_PRODUCT_ADDED.message,
      code: Messages.NEW_PRODUCT_ADDED.code,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const getAllBrands = async (req: Request, res: Response) => {
  try {
    const minprice = await Product.min("price");
    const maxprice = await Product.max("price");
    const brands = await Brand.findAll({
      order: [["name", "ASC"]], // Order brands alphabetically by name
    });
    res.status(Messages.SUCCESS_GET_BRANDS.status).json({
      brands,
      maxprice,
      minprice,
      message: Messages.SUCCESS_GET_BRANDS.message,
      code: Messages.SUCCESS_GET_BRANDS.code,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export default { getAllProducts, addProduct, getAllBrands };
