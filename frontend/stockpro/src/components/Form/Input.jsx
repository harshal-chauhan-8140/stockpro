import React, { useId } from "react"

function Input({
    type = 'text',
    label,
    className = "",
    ...props
}, ref) {
    const id = useId()

    return (
        <div className={`${className}`}>
            {label && <label htmlFor={id} className="block">
                {label}
            </label>
            }
            <input type={type} ref={ref} id={id} className={`border-1 w-full`} {...props} />
        </div >
    )
}

export default React.forwardRef(Input)