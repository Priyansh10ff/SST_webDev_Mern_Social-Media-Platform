import {createSlice, CreateSlice} from "@reduxjs/toolkit"

const initialState = {
    items : []
}

const PostSlice = createSlice({
    name :'post',
    initialState,
    reducers : {
        setPost : (state, action) => {
            
        }
    }
})

export const {} = PostSlice.actions
export default PostSlice.reducer