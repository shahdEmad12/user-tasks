import {customAlphabet} from 'nanoid'

const generateUniqueString = (length)=>{
    const nanoid = customAlphabet('12345asdfgh', length)
    return nanoid()
}

export default generateUniqueString