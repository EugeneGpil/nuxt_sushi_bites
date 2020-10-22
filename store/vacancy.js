import CityService from '@/services/CityService'

const mergeArraysById = (array1, array2) => {

	let res = JSON.parse(JSON.stringify(array1));

	for (let i = 0; i < array2.length; i++) {

		let isElementAdded = false;

		for (let j = 0; j < res.length; j++) {

			if (res[j].id == array2[i].id) {

				res[j] = JSON.parse(JSON.stringify(array2[i]))
				isElementAdded = true
				break
			}
		}

		if (!isElementAdded) {
			res.push(JSON.parse(JSON.stringify(array2[i])))
		}
	}

	return res;
}

export const state = () => ({
	restaurants: [],
	vacancies: []
})

export const mutations = {

	ADD_ENTITIES: (context, params) => {

		let payload = params[0]
		let relation = params[1]

		context[relation] = mergeArraysById(context[relation], payload)
	}

}

export const actions = {

	getRestaurantsByCityId(context, id) {

		for (let i = 0; i < context.state.restaurants.length; i++) {
			if (context.state.restaurants[i].city_id == id) {
				return
			}
		}

		return CityService.getRelated(id, 'restaurants').then(response => {
			context.commit('ADD_ENTITIES', [response.data, 'restaurants'])
		})
	},

	getVacanciesByCityId(context, id) {
		
		for (let i = 0; i < context.state.vacancies.length; i++) {
			let vacancy = context.state.vacancies[i]
			for (let j = 0; j < context.state.restaurants.length; j++) {
				let restaurant = context.state.restaurants[j]
				if (vacancy.restaurant_id == restaurant.id && restaurant.city_id == id) {
					return
				}
			}
		}

		return CityService.getRelated(id, 'vacancies').then(response => {
			context.commit('ADD_ENTITIES', [response.data, 'vacancies'])
		})

	}

}