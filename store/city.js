import CityService from '@/services/CityService'

export const state = () => ({
  cities: [],
  selectedCity: null
});

export const getters = {

}

export const mutations = {

  SET_CITIES: (context, cities) => {
    context.cities = cities
  },

  SET_CITY: (context, city) => {

    context.selectedCity = city
  }

};

export const actions = {

  getCities: (context) => {

      if (context.state.cities.length) {
        return;
      }

      return CityService.getCities().then((response) => {
        context.commit('SET_CITIES', response.data)
        context.commit('SET_CITY', response.data[0])

      })
  },

  setCity: (context, city) => {
    context.commit('SET_CITY', city)
  }

};
