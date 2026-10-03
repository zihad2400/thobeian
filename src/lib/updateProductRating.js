import Product from "@/models/Product";
import ProductReview from "@/models/ProductReview";

/**
 * Recalculate and update a product's rating & review count
 * based on all approved reviews.
 */
export async function updateProductRating(productId) {
  try {
    const reviews = await ProductReview.find({
      product: productId,
      status: "approved",
    }).lean();

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
      return { rating: 0, reviewCount: 0 };
    }

    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    return { rating: avgRating, reviewCount: reviews.length };
  } catch (error) {
    console.error("updateProductRating error:", error);
    throw error;
  }
}

/**
 * Update all products' ratings (bulk)
 */
export async function updateAllProductRatings() {
  try {
    const products = await Product.find({}).select("_id").lean();
    const results = [];

    for (const p of products) {
      const result = await updateProductRating(p._id);
      results.push({ productId: p._id, ...result });
    }

    return results;
  } catch (error) {
    console.error("updateAllProductRatings error:", error);
    throw error;
  }
}
