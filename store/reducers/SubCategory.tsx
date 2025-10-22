import AsyncStorage from '@react-native-async-storage/async-storage'
import { SET_LIST_SUB_CATEGORY } from '../types/SubCategoryType'

const initialeState =
{
  listSubCategory:[]
}
const SubCategory =  (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_LIST_SUB_CATEGORY: {
       // await AsyncStorage.setItem('langue', action.value)
      const nextState = {
        ...state,
        listSubCategory: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default SubCategory
