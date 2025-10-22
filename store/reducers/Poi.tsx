import {
  SET_LIST_POI,
  SET_LIST_POI_EN,
  SET_LIST_POI_FR,
  SET_CURRENT_LISTPOI_BT,
  SET_CURRENT_LISTPOI_BT_SAVE,
  SET_POPUP_BT } from '../types/PoiType'
const initialeState = {
  listPoi: [],
  listPoiEn: [],
  listPoiFr: [],
  currentListPoiBT: [],
  currentListPoiBTsave: [],
  currentPopupBT: false
}
const Poi = (state = initialeState, action: any) => {
  switch (action.type) {
    case SET_LIST_POI: {
      const nextState = {
        ...state,
        listPoi: action.value
      }
      return nextState
    }
    case SET_LIST_POI_EN: {
      const nextState = {
        ...state,
        listPoiEn: action.value
      }
      return nextState
    }
    case SET_LIST_POI_FR: {
      const nextState = {
        ...state,
        listPoiFr: action.value
      }
      return nextState
    }
    case SET_CURRENT_LISTPOI_BT: {
      const nextState = {
        ...state,
        currentListPoiBT: action.value
      }
      return nextState
    }
    case SET_CURRENT_LISTPOI_BT_SAVE: {
      const nextState = {
        ...state,
        currentListPoiBTsave: action.value
      }
      return nextState
    }
    case SET_POPUP_BT: {
      const nextState = {
        ...state,
        currentPopupBT: action.value
      }
      return nextState
    }


    default:
      return state
  }
}
export default Poi
