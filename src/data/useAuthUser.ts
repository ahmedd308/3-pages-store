import { api } from "@/src/services/api";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
    enabled,
  });
};
