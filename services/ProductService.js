import apiClient from './apiClient';

export default {

  getCategories() {
    return apiClient.get(`/categories`);
  },

  getProducts(params) {
    return apiClient.get(`/products?category_id=${params.category_id}&sort_field=${params.sort_field}&sort_direction=${params.sort_direction}&limit=100`);
  },

  getRecommendProducts() {
    return apiClient.get(`/products/recommend`);
  },

  getGroupsByHashIds(hashIds) {
    return apiClient.get(`/group/get_by_hash_ids?${hashIds.map((hashId, index) => `hash_ids[${index}]=${hashId}`).join('&')}`)
  },

  getProductsByHashIds(hashIds) {
    return apiClient.get(`/products/get_by_hash_ids?${hashIds.map((hashId, index) => `hash_ids[${index}]=${hashId}`).join('&')}`)
  },

}
