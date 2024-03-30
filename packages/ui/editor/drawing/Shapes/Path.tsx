import React from "react"

import { TPath } from "../types"

const Path = (props:TPath) => {


    const {id, d,stroke,strokeWidth} = props

    return <path
    key={id}
    strokeWidth={strokeWidth}
    stroke={stroke}
    fill="none"
    d={d}
    strokeLinecap="round"
    
  />
}

export default Path