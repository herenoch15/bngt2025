import { SET_PARTENAIRES } from '../types/PartenairesType'
const initialeState =
{
    list: null
}
const Partenaires =  (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_PARTENAIRES: {
      const nextState = {
        ...state,
        list: action.value
      }
      return nextState
    }
    default:
      return state
  }
}
export default Partenaires
