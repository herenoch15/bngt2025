import { SET_PRESENTATION } from '../types/PresentationType'
const initialeState =
{
  presentation: null
}
const Presentation =  (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_PRESENTATION: {
      const nextState = {
        ...state,
        presentation: action.value
      }
      return nextState
    }
    default:
      return state
  }
}
export default Presentation
