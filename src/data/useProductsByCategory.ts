import { api } from "@/src/services/api";
import { useQuery } from "@tanstack/react-query";

export type CategoryId =
  | "beauty"
  | "fragrances"
  | "furniture"
  | "groceries"
  | "home-decoration"
  | "kitchen-accessories"
  | "laptops"
  | "mens-shirts"
  | "mens-shoes"
  | "mens-watches"
  | "mobile-accessories"
  | "motorcycle"
  | "skin-care"
  | "smartphones"
  | "sports-accessories"
  | "sunglasses"
  | "tablets"
  | "tops"
  | "vehicle"
  | "womens-bags"
  | "womens-dresses"
  | "womens-jewellery"
  | "womens-shoes"
  | "womens-watches";

export const useProductsByCategory = ({
  categoryId,
}: {
  categoryId: CategoryId | null;
}) => {
  return useQuery({
    queryKey: ["products-by-category", categoryId],
    queryFn: async () => {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data;
    },
    staleTime: Infinity,
    enabled: !!categoryId,
  });
};
