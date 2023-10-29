import { createSlice } from "@reduxjs/toolkit"

// const filterReducer = (state = '', action) => {
//     console.log('state now (filter): ', state)
//     switch (action.type) {
//         case 'SET_FILTER':
//             return action.payload
//         default:
//             return state
//     }
// }

// export const searchFor = (content) => {
//     return {
//         type: 'SET_FILTER',
//         payload: content
//     }
// }


const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        searchFor(state, action) {
            return action.payload
        }
    }
})

export const { searchFor } = filterSlice.actions
export default filterSlice.reducer