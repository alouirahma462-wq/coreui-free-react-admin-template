import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

/**
 * Root reducer
 */
const changeState = (state = initialState, action = {}) => {
  const { type, ...rest } = action

  switch (type) {
    case 'set':
      return { ...state, ...rest }

    default:
      return state
  }
}

const store = createStore(changeState)

export default store

