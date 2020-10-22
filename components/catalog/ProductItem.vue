<template>
  <div @click="show()" class="product"
       @mouseover="hovered = true"
       @mouseleave="hovered = false"
  >
    <div class="product-img">
      <img v-if="product.images" :src="product.images[0].imageUrl"   alt="">
        <ProductCounter
          v-show="hovered == true"
          :product="product"
        />
      </div>
    <div class="product-content">
      <div class="product-head"><h4>{{product.title}}</h4>
        <span>Вес : {{product.additional_info}}</span>
      </div>
      <div class="product-pris"><h3>{{ product.price }} ₽</h3></div>
      <p>{{product.description}}</p></div>

    <modal :name="'modal_'+ product.id"
           height="auto"
           :adaptive="true"
    >
            <ProductInfo  :info="product" @hide="hide" />
    </modal>

  </div>

</template>

<script>
import ProductCounter from "@/components/catalog/ProductCounter";
import ProductInfo from "@/components/catalog/ProductInfo";

export default {
  name: "ProductItem",
  components: {ProductCounter, ProductInfo},
  props:
    {
    product: Object
  },
  data(){
    return {
      hovered: false,
    }
  },
  methods:{
    show(){
      this.$modal.show('modal_' + this.product.id)
    },
    hide(){
      this.$modal.hide('modal_' + this.product.id)
    },
  },
  mount() {
    this.show()
  }
}
</script>

