import AsyncStorage from '@react-native-async-storage/async-storage'
import { SET_ITEM_VISIT, SET_VISIT } from '../types/VisitType'

const initialeState =
{
  dataVisit: [],
  item:null
}
const Visit = (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_VISIT: {
      const nextState = {
        ...state,
        dataVisit: action.value
      }
      return nextState
    }
    case SET_ITEM_VISIT: {
      const nextState = {
        ...state,
        item: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default Visit
