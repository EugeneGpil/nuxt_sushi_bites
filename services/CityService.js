import apiClient from './apiClient';

export default {

  getCities() {
    return apiClient.get(`/city/list`);
  },

  getRelated(id, relation) {
    return apiClient.get(`/city/${id}/${relation}`)
  }

}
