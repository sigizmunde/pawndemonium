'use client'

import React, { FunctionComponent, ReactNode } from "react"

type FieldProps = {
    id: string,
    children?: ReactNode,
}

export const Field: FunctionComponent<FieldProps> = ({ id, children }) => {
    return <div className="field">
        {Array(8).fill(1).map((_, x) =>
            <div key={x} className="field-row">
                {Array(8).fill(1).map((__, y) =>
                    <div key={x + '' + y} className="field-cell" style={{ backgroundColor: (x + y) % 2 ? "#aaa" : "#eee" }} />)
                }
            </div>)}
        {children}
    </div>
}