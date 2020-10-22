import ProductService from '@/services/ProductService'

const getNotExistingHashIds = (array, hashIdsToCheck) => {
  let notExistingHashIds = []

  for (let i = 0; i < hashIdsToCheck.length; i++) {
    let isThisGroupAlredyExist = false
    let currentHashId = hashIdsToCheck[i]
    
    for (let j = 0; j < array.length; j++) {
      let currentGroup = array[j]
      if (currentGroup.hash_id == currentHashId) {
        isThisGroupAlredyExist = true
        break
      }
    }

    if (!isThisGroupAlredyExist) {
      notExistingHashIds.push(currentHashId)
    }
  }

  return notExistingHashIds;
}

export const state = () => ({
  groups: [],
  modifiersProducts: [],
  products: [],
})

export const getters = {

}

export const mutations = {

  ADD_GROUPS: (context, groups) => {
    context.groups = context.groups.concat(groups)
  },

  ADD_MODIFIERS_PRODUCTS: (context, products) => {
    context.modifiersProducts = context.modifiersProducts.concat(products)
  },

  ADD_PRODUCT: (context, product) => {
    context.products = context.products.concat(product)
  },

  UPDATE_PRODUCT: (context, product) => {
    let products = []

    for (let i = 0; i < context.products.length; i++) {
      let currentProduct = context.products[i]

      if (currentProduct.hash_id == product.hash_id) {
        products.push(product)
      } else {
        products.push(currentProduct)
      }
    }
    context.products = products
  },

}

export const actions = {
  
  getGroupsByHashIds: (context, hashIds) => {

    let hashIdsToAdd = getNotExistingHashIds(context.state.groups, hashIds)

    if (!hashIdsToAdd.length) {
      return
    }

    return ProductService.getGroupsByHashIds(hashIdsToAdd).then(response => {
      context.commit('ADD_GROUPS', response.data)
    })
  },

  getModifiersProductsByHashIds: (context, hashIds) => {

    let hashIdsToAdd = getNotExistingHashIds(context.state.modifiersProducts, hashIds)

    if (!hashIdsToAdd.length) {
      return
    }

    return ProductService.getProductsByHashIds(hashIdsToAdd).then(response => {
      context.commit('ADD_MODIFIERS_PRODUCTS', response.data)
    })
  },

  addProduct: (context, product) => {
    return context.commit('ADD_PRODUCT', product)
  },

  updateProduct: (context, product) => {
    return context.commit('UPDATE_PRODUCT', product)
  },

}