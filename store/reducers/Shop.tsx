import { SET_SHOP } from '../types/ShopType'
const initialeState =
{
    shops: null
}
const Shop =  (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_SHOP: {
      const nextState = {
        ...state,
        shops: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default Shop
