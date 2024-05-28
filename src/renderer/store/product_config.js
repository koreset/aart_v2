import { defineStore } from 'pinia'

export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    product: {
      product_name: '',
      product_code: '',
      product_family: 0,
      product_transition_states: [],
      product_transitions: [],
      product_features: []
    }
  }),
  getters: {
    getProduct: (state) => state.product,
    getProductName: (state) => state.product.product_name,
    getProductCode: (state) => state.product.product_code,
    getProductFamily: (state) => state.product.product_family,
    getProductTransitionStates: (state) => state.product.product_transition_states,
    getProductTransitions: (state) => state.product.product_transitions
  },
  actions: {
    setProductName(name) {
      this.product.product_name = name
    },
    setProductCode(code) {
      this.product.product_code = code
    },
    setProductFamily(family) {
      this.product.product_family = family
    },
    setProductTransitionStates(states) {
      this.product.product_transition_states = states
    },
    addToTransitions(transitions) {
      this.product.product_transitions.push(transitions)
    },
    removeFromTransitions(item) {
      console.log('Item:', item)
      this.product.product_transitions = this.product.product_transitions.filter(
        (transition) => transition !== item
      )
    },
    setProductFeatures(features) {
      this.product.product_features = features
    }
  }
})
