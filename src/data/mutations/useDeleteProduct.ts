import { api } from "@/src/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    },
    // Optimistic update: remove the product from UI immediately
    onMutate: async (productId: string) => {
      // Snapshot the previous values for rollback
      const previousAllProducts = queryClient.getQueryData(["products"]);
      const previousCategoryQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["products-by-category"] })
        .map((query) => ({
          key: query.queryKey,
          data: query.state.data,
        }));

      // Optimistically update all products list
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.filter(
            (product: any) => product.id !== parseInt(productId)
          ),
          total: old.total - 1,
        };
      });

      // Optimistically update all category queries
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["products-by-category"] })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (old: any) => {
            if (!old) return old;
            return {
              ...old,
              products: old.products.filter(
                (product: any) => product.id !== parseInt(productId)
              ),
              total: old.total - 1,
            };
          });
        });

      return { previousAllProducts, previousCategoryQueries };
    },
    onError: (context: any) => {
      if (context?.previousAllProducts) {
        queryClient.setQueryData(["products"], context.previousAllProducts);
      }
      if (context?.previousCategoryQueries) {
        context.previousCategoryQueries.forEach(
          ({ key, data }: { key: any; data: any }) => {
            queryClient.setQueryData(key, data);
          }
        );
      }
    },
    // In other scenarios where data is removed from the db, invalidate queries
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["products"] });
    // },
  });
};
