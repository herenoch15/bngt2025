
import { SET_LIST_CATEGORY } from '../types/CategoryType'
const initialeState =
{
  listCategory:[]
}
const Category =  (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_LIST_CATEGORY: {
      const nextState = {
        ...state,
        listCategory: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default Category
