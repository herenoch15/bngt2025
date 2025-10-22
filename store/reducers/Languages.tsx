import {
  SET_LANGUAGES,
} from '../types/LanguagesType'
import fr from '../../configs/Locales/fr'
import en from '../../configs/Locales/en'
const initialeState =
{
  languages: fr, 
  langue:'FR'
}
const Languages =  (state = initialeState, action: any) => {

  switch (action.type) {
    
    case SET_LANGUAGES: {

      console.log('VALUE::'+action.value)
      const nextState = {
        ...state,
       
        
        languages: action.value == 'FR' ? fr : en,
        langue: action.value == 'FR' ? 'FR' : 'EN',
      }
      return nextState
    }


    default:
      return state
  }
}
export default Languages
