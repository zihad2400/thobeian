import Product from "@/models/Product";

function normalizeId(value) {
  return value?.toString() || "";
}

export async function reserveOrderStock(items) {
  const reserved = [];

  try {
    for (const item of items || []) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(
          `Invalid quantity for ${item.name || "product"}`
        );
      }

      /*
       * Variant product
       */
      if (item.variantId) {
        const product = await Product.findOneAndUpdate(
          {
            _id: item.product,
            status: "published",

            variants: {
              $elemMatch: {
                _id: item.variantId,
                stock: {
                  $gte: quantity,
                },
              },
            },
          },

          {
            $inc: {
              "variants.$.stock": -quantity,
              totalStock: -quantity,
            },
          },

          {
            new: true,
          }
        );

        if (!product) {
          throw new Error(
            `${item.name || "Product"} is out of stock for the selected variant`
          );
        }

        reserved.push({
          product: normalizeId(item.product),
          variantId: normalizeId(item.variantId),
          quantity,
          name: item.name || "Product",
        });

        continue;
      }

      /*
       * Simple product
       */
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          status: "published",
          totalStock: {
            $gte: quantity,
          },
        },

        {
          $inc: {
            totalStock: -quantity,
          },
        },

        {
          new: true,
        }
      );

      if (!product) {
        throw new Error(
          `${item.name || "Product"} is out of stock`
        );
      }

      reserved.push({
        product: normalizeId(item.product),
        variantId: null,
        quantity,
        name: item.name || "Product",
      });
    }

    return reserved;
  } catch (error) {
    await releaseOrderStock(reserved);
    throw error;
  }
}

export async function releaseOrderStock(items) {
  for (const item of items || []) {
    try {
      const quantity = Number(item.quantity);

      if (
        !item.product ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        continue;
      }

      if (item.variantId) {
        await Product.findOneAndUpdate(
          {
            _id: item.product,

            variants: {
              $elemMatch: {
                _id: item.variantId,
              },
            },
          },

          {
            $inc: {
              "variants.$.stock": quantity,
              totalStock: quantity,
            },
          }
        );
      } else {
        await Product.findByIdAndUpdate(
          item.product,

          {
            $inc: {
              totalStock: quantity,
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "Stock release error:",
        error
      );
    }
  }
}

export function getStockItemsFromOrder(order) {
  return (order?.items || [])
    .filter((item) => item?.product)
    .map((item) => ({
      product: item.product,
      variantId: item.variantId || null,
      quantity: item.quantity,
      name: item.name,
    }));
}
