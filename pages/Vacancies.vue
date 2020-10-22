<template>
  <div>
    <Loading v-if="loading" />

    <div v-if="!loading">
    
      <FullPageError v-if="!areThereAnyVacanciesInCity()" text="В выбранном городе нет вакансий" />

      <div v-for="restaurant in restaurants" :key="restaurant.id">
        <div v-if="shouldRenderRestourant(restaurant)" class="wrap">
          <div class="vac-city">
            {{ restaurant.name }} ({{ selectedCity.title }})
          </div>
          <div v-for="vacancy in vacancies" :key="vacancy.id">
            <div v-if="vacancy.restaurant_id == restaurant.id" class="vac-flex">
              <div class="vac-left">
                <h2>{{ vacancy.name }}</h2>
                <p>{{ vacancy.schedule }}</p>
              </div>
              <div class="vac-right">
                <div class="vac-item">
                  <div class="vac-img">
                    <img :src='vacancy.image.public_path' alt="">
                  </div>
                  <div class="vac-content">
                    <div class="vac-col">
                      <div class="vac-group">
                        <h4>Опыт работы:</h4>
                        <p>{{ vacancy.work_experience }}</p>
                      </div>
                      <div class="vac-group">
                        <h4>Обязанности:</h4>
                        <p>{{ vacancy.duties }}</p>
                      </div>
                      <div class="vac-group">
                        <h4>Контакты:</h4>
                        <p>{{ selectedCity.title }}, {{ restaurant.address }}.
                          {{ vacancy.contacts }}</p>
                      </div>
                    </div>
                    <div class="vac-col">

                      <div class="vac-group">
                        <h4>Требования:</h4>
                        <p>{{ vacancy.requirements }}</p>
                      </div>

                      <div class="vac-group">
                        <h4>Условия:</h4>
                        <p>{{ vacancy.terms }}</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import FullPageError from '@/components/FullPageError'
import Loading from '@/components/Loading'

export default {
  name: 'Vacancies',

  data() {
    return {
      loading: false
    }
  },

  components: {
    FullPageError,
    Loading
  },

  computed: {

    selectedCity() {
      return this.$store.state.city.selectedCity
    },

    restaurants() {
      return this.$store.state.vacancy.restaurants
    },

    vacancies() {
      return this.$store.state.vacancy.vacancies
    },

  },

  async fetch() {
    await this.getEntities()
  },

  watch: {
    selectedCity() {
      this.getEntities()
    }
  },

  methods: {

    shouldRenderRestourant(restaurant) {

      if (restaurant.city_id != this.selectedCity.id) {
        return false
      }

      for (let i = 0; i < this.vacancies.length; i++) {
        if (this.vacancies[i].restaurant_id == restaurant.id) {
          return true
        }
      }

      return false
    },

    areThereAnyVacanciesInCity() {

      for (let i = 0; i < this.restaurants.length; i++) {
        if (this.shouldRenderRestourant(this.restaurants[i])) {
          return true
        }
      }

      return false
    },

    async getEntities() {
      this.loading = true;
      await Promise.all([
        this.$store.dispatch('vacancy/getRestaurantsByCityId', this.selectedCity.id),
        this.$store.dispatch('vacancy/getVacanciesByCityId', this.selectedCity.id)
      ]);
      this.loading = false;
    }

  }
}
</script>