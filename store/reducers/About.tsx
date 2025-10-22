import { SET_ABOUT } from '../types/AboutType'

const initialeState =
{
  dataAbout: []
}
const Thematique = (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_ABOUT: {
      // await AsyncStorage.setItem('langue', action.value)
      const nextState = {
        ...state,
        dataAbout: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default Thematique
