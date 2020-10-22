<template>

  <div>
    <div class="pmodal pmodal-type1">
      <div class="pmodal-left">
        <img v-if="info.images" :src="info.images[0].imageUrl"
            alt="" class="xs-hide">
        <img src="~/assets/static/imgs/pmodal-leftm.png"
            alt="" class="xs-show hide">
      </div>
      <div class="pmodal-content">
        <div @click="$emit('hide')" class="m-close">
          <img src="~/assets/static/imgs/close-menu.svg"
              alt="">
        </div>
        <div class="pmodal-top">
          <h3>{{info.title}}</h3>
          <p>
            Вес : {{info.additional_info}}
          </p>
          <p>
            <b>Состав :</b>
            {{info.description}}
          </p>

          <div v-if="loading">
            <VueSimpleSpinner
              :size="spinnerSize"
              :line-size="spinnerLineSize"
              :line-fg-color="spinnerColor"
              :speed="spinnerSpeed"
            />
          </div>

          <div v-if="!loading">
            <p v-for="groupModifier in product.group_modifiers" :key="groupModifier.modifierId">
              <b>{{ getByHashId('groups', groupModifier.modifierId).name }}</b>
              <section
                class="group-modifier"
                v-for="childModifier in groupModifier.childModifiers"
                :key="childModifier.modifierId"
                :class="{
                  unselected: !isChildModifierSelected(childModifier.modifierId),
                  unavailable: !isChildModifierSelected(childModifier.modifierId)
                    && !isChildModifierAvailable(childModifier.modifierId)
                }"
              >
                <label @click.prevent="toggleActive(childModifier.modifierId)">
                  <input
                    type="checkbox"
                    checked
                    :class="{invisible: !isModifierActive(childModifier.modifierId)}"
                  >
                  <input
                    type="checkbox"
                    :class="{invisible: isModifierActive(childModifier.modifierId)}"
                  >
                  {{ getByHashId('modifiersProducts', childModifier.modifierId).name }}
                </label>
                <div
                  v-if="childModifier.maxAmount > 1"
                  class="child-modifier-counter"
                  :class="{invisible: !isChildModifierSelected(childModifier.modifierId)}"
                >
                  <div
                    class="child-modifier-counter__arrow child-modifier-counter__left-arrow"
                    @click="changeModifierCount(childModifier.modifierId, -1)"
                  ><</div>
                  <div class="child-modifier-counter__number">
                    {{ product.modifiers_count[childModifier.modifierId] }}
                  </div>
                  <div
                    class="child-modifier-counter__arrow child-modifier-counter__right-arrow"
                    @click="changeModifierCount(childModifier.modifierId, 1)"
                    :class="{
                      'child-modifier-counter__right-arrow-unavailable':
                        !isChildModifierAvailable(childModifier.modifierId)
                    }"
                  >></div>
                </div>
              </section>
            </p>
          </div>

          <table>
            <tr>
              <td></td>
              <td>Белки</td>
              <td>Жиры</td>
              <td>Углеводы</td>
              <td>кКал</td>
            </tr>
            <tr>
              <td>100 гр</td>
              <td>1</td>
              <td>{{info.fiber_amount}}</td>
              <td>1,2</td>
              <td>{{info.energy_amount}}</td>
            </tr>
            <tr>
              <td>Порция</td>
              <td>1</td>
              <td>{{info.fiber_full_amount}}</td>
              <td>1,2</td>
              <td>{{info.energy_full_amount}}</td>
            </tr>
          </table>
        </div>
        <div class="pmodal-bottom">
          <div class="pmodal-pris">
            {{info.price}} ₽
          </div>
          <ProductCounter :product="product"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ProductCounter from "./ProductCounter"
import spinnerSettings from '@/settings/spinner'

export default {

  name: "productinfo",

  components:{
    ProductCounter,
    VueSimpleSpinner: () => process.browser ? import('vue-simple-spinner') : null
  },

  props: {
    info: Object,
  },

  data(){
    return{
      loading: false,
      spinnerColor: spinnerSettings.color,
      spinnerSize: spinnerSettings.small_size,
      spinnerLineSize: spinnerSettings.line_size,
      spinnerSpeed: spinnerSettings.speed,
    }
  },

  async fetch() {
    this.loading = true

    if (!this.product) {

      let product = this.info

      product.modifiers_count = {}

      for (let i = 0; i < product.group_modifiers.length; i++) {
        let currentGroupModifier = product.group_modifiers[i]
        for (let j = 0; j < currentGroupModifier.childModifiers.length; j++) {
          let currentChildModifier = currentGroupModifier.childModifiers[j]
          product.modifiers_count[currentChildModifier.modifierId] =
            currentChildModifier.defaultAmount
        }
      }

      this.$store.dispatch('productInfo/addProduct', this.info)

    }

    let groupModifiers = this.product.group_modifiers

    let groupHashIds = []
    for (let i = 0; i < groupModifiers.length; i++) {
      let currentGroupModifier = groupModifiers[i]
      groupHashIds.push(currentGroupModifier.modifierId)
    }

    let productHashIds = []
    for (let i = 0; i < groupModifiers.length; i++) {
      let currentGroupModifier = groupModifiers[i]

      if (!currentGroupModifier.childModifiers) {
        continue
      }

      for (let j = 0; j < currentGroupModifier.childModifiers.length; j++) {
        let currentChildModifier = currentGroupModifier.childModifiers[j]
        productHashIds.push(currentChildModifier.modifierId)
      }
    }

    await Promise.all([
      this.$store.dispatch('productInfo/getGroupsByHashIds', groupHashIds),
      this.$store.dispatch('productInfo/getModifiersProductsByHashIds', productHashIds),
    ])

    this.loading = false
  },

  computed: {

    groups() {
      return this.$store.state.productInfo.groups
    },

    modifiersProducts() {
      return this.$store.state.productInfo.modifiersProducts
    },

    products() {
      return this.$store.state.productInfo.products
    },

    product() {
      for (let i = 0; i < this.products.length; i++) {
        let currentProduct = this.products[i]
        if (this.info.hash_id == currentProduct.hash_id) {
          return currentProduct
        }
      }
      return null
    }

  },

  methods: {

    getByHashId(arrayName, hashId) {
      for (let i = 0; i < this[arrayName].length; i++) {
        if (this[arrayName][i].hash_id == hashId) {
          return this[arrayName][i]
        }
      }
      return null;
    },

    toggleActive(hashId) {
      if (this.product.modifiers_count[hashId] > 0) {
        this.setModifierCount(hashId, 0)
      } else {
        let modifiers = this.getGroupAndChildModifier(hashId)
        if (!modifiers) {
          return
        }
        let groupMaxModifiersAmount = modifiers.group_modifier.maxAmount
        let allModifiersInGroupCount = this.getAllModifiersInGroupCountByChildModifierHashId(hashId)
        if (allModifiersInGroupCount >= groupMaxModifiersAmount) {
          return
        }
        this.setModifierCount(hashId, 1)
      }
    },

    changeModifierCount(modifierId, changeNumber) {
      if (changeNumber != 1 && changeNumber != -1) {
        return
      }

      let modifiers = this.getGroupAndChildModifier(modifierId)
      if (!modifiers) {
        return
      }
      let groupModifier = modifiers.group_modifier
      let childModifier = modifiers.child_modifier

      let allModifiersInGroupCount =
        this.getAllModifiersInGroupCountByChildModifierHashId(
          childModifier.modifierId
        )

      let modifierCount = this.product.modifiers_count[modifierId]

      if (
        changeNumber == 1
        && (
          allModifiersInGroupCount >= groupModifier.maxAmount
          || modifierCount >= childModifier.maxAmount
        )
      ) {
        return
      }

      if (
        changeNumber == -1
        && (
          allModifiersInGroupCount <= 0
          || modifierCount <= 0
        )
      ) {
        return
      }

      this.setModifierCount(
        modifierId,
        this.product.modifiers_count[modifierId] + changeNumber
      )
    },

    getAllModifiersInGroupCountByChildModifierHashId(hashId) {
      let allModifiersInGroupCount = 0

      let modifiers = this.getGroupAndChildModifier(hashId)
      if (!modifiers) {
        return 0
      }
      let groupModifier = modifiers.group_modifier

      for (let i = 0; i < groupModifier.childModifiers.length; i++) {
        let currentChildModifierId = groupModifier.childModifiers[i].modifierId
        allModifiersInGroupCount += this.product.modifiers_count[currentChildModifierId]
      }

      return allModifiersInGroupCount
    },

    getGroupAndChildModifier(modifierId) {
      let groupModifier = null
      let childModifier = null
      for (let i = 0; i < this.product.group_modifiers.length; i++) {
        let currentGroupModifier = this.product.group_modifiers[i]
        for (let j = 0; j < currentGroupModifier.childModifiers.length; j++) {
          let currentChildModifier = currentGroupModifier.childModifiers[j]
          if (currentChildModifier.modifierId == modifierId) {
            return {
              group_modifier: currentGroupModifier,
              child_modifier: currentChildModifier,
            }
          }
        }
      }
      return null
    },

    setModifierCount(hashId, count) {
      let product = JSON.parse(JSON.stringify(this.product))
      product.modifiers_count[hashId] = count
      this.$store.dispatch('productInfo/updateProduct', product)
    },

    isModifierActive(hashId) {
      if (this.product.modifiers_count[hashId] > 0) {
        return true
      }
      return false
    },

    isChildModifierSelected(hashId) {
      return this.product.modifiers_count[hashId] > 0
    },

    isChildModifierAvailable(hashId) {
      let modifiers = this.getGroupAndChildModifier(hashId)
      if (!modifiers) {
        return false
      }
      let groupModifier = modifiers.group_modifier
      let childModifier = modifiers.child_modifier
      let allGroupModifiersCount = this.getAllModifiersInGroupCountByChildModifierHashId(hashId)

      if (
        this.product.modifiers_count[hashId] >= childModifier.maxAmount
        || allGroupModifiersCount >= groupModifier.maxAmount
      ) {
        return false
      }

      return true
    },

  }

}
</script>

<style scoped lang='scss'>
$unavailable-color: #666;
$unselected-color: #BBB;

.child-modifier-counter {
  display: flex;
  margin-left: 10px;
  margin-bottom: 5px;
  &__arrow {
    background-color: #EB812C;
    padding-left: 5px;
    padding-right: 5px;
    &:hover {
      cursor: pointer;
    }
  }
  &__left-arrow {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  &__right-arrow {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }
  &__right-arrow-unavailable {
    background-color: $unselected-color;
    color: $unavailable-color;
  }
  &__number {
    margin-left: 5px;
    margin-right: 5px;
  }
}
.group-modifier {
  display: flex;
  align-items: center;
}
.invisible {
  display: none;
}
.unselected {
  color: $unselected-color;
}
.unavailable {
  color: $unavailable-color;
  input[type='checkbox']:hover {
    background-color: $unavailable-color;
    border-color: $unavailable-color;
  }
}
</style>
