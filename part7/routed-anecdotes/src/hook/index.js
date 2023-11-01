import { useState } from 'react'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const clearField = () => {
        setValue('')
    }
    return {
        type,
        value,
        onChange,
        clearField
    }
}

export const useButton = () => {
    const [value, setButtonValue] = useState(0)

    const create = () => {
        setButtonValue(0)
    }

    const reset = () => {
        setButtonValue(1)
    }
    return {
        value,
        create,
        reset
    }
}