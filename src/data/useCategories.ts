import { api } from "@/src/services/api";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/products/categories");
      return response.data;
    },
  });
};
