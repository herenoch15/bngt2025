import AsyncStorage from '@react-native-async-storage/async-storage'
import { SET_LIST_THEMATIQUE } from '../types/ThematiqueType'

const initialeState =
{
  listThematique: []
}
const Thematique = (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_LIST_THEMATIQUE: {
      // await AsyncStorage.setItem('langue', action.value)
      const nextState = {
        ...state,
        listThematique: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default Thematique
