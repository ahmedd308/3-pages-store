import { useDeleteProduct } from "@/src/data/mutations/useDeleteProduct";
import { useCategories } from "@/src/data/useCategories";
import { useProducts } from "@/src/data/useProducts";
import {
  CategoryId,
  useProductsByCategory,
} from "@/src/data/useProductsByCategory";
import { selectIsSuperAdmin } from "@/src/store/slices/auth.slice";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Product() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null
  );

  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const { mutate: deleteProduct } = useDeleteProduct();

  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories();
  const {
    data: allProducts,
    isLoading: allProductsLoading,
    refetch: refetchAllProducts,
  } = useProducts();
  const {
    data: categoryProducts,
    isLoading: categoryProductsLoading,
    refetch: refetchCategoryProducts,
  } = useProductsByCategory({ categoryId: selectedCategory });

  const [refreshing, setRefreshing] = useState(false);

  const isLoading = selectedCategory
    ? categoryProductsLoading
    : allProductsLoading || categoriesLoading;

  const products = selectedCategory
    ? categoryProducts?.products
    : allProducts?.products;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedCategory) {
        await Promise.all([refetchAllProducts(), refetchCategoryProducts()]);
      } else {
        await Promise.all([refetchAllProducts(), refetchCategories()]);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteProduct = (productId: string, productTitle: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${productTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(productId, {
              onError: (error: any) => {
                Alert.alert(
                  "Error",
                  error?.response?.data?.message || "Failed to delete product"
                );
              },
            });
          },
        },
      ]
    );
  };

  if (categoriesLoading && !categories) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderCategoryItem = ({ item }: { item: any }) => {
    // Handle both string and object formats
    const categoryName =
      typeof item === "string" ? item : item.name || item.slug;

    // Convert category name to API format (lowercase with hyphens)
    const categorySlug = categoryName?.toLowerCase().replace(/\s+/g, "-");

    // Convert category name to display format (capitalize first letter of each word)
    const displayName = categoryName
      ?.split(/[-\s]+/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          selectedCategory === categorySlug && styles.categoryItemActive,
        ]}
        onPress={() =>
          setSelectedCategory(
            categorySlug === selectedCategory
              ? null
              : (categorySlug as CategoryId)
          )
        }
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === categorySlug && styles.categoryTextActive,
          ]}
        >
          {displayName || "Unknown"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      {isSuperAdmin && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item.id.toString(), item.title)}
        >
          <Ionicons name="trash-outline" size={22} color="#ff3b30" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Category</Text>
        {selectedCategory && (
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesList}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "grey",
    fontWeight: "600",
  },
  categoriesList: {
    maxHeight: 50,
    flexGrow: 0,
    flexShrink: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    height: 36,
    justifyContent: "center",
  },
  categoryItemActive: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  categoryTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
});
