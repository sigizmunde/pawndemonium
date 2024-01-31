'use client'

import { Cell, Color, Role } from "@/types";
import React, { FunctionComponent, MouseEventHandler } from "react";

type PersProps = {
    id: string,
    color: Color,
    role: Role,
    onClick: MouseEventHandler,
    cell: Cell,
}

const persMap = {
    [Role.PAWN]: 'i',
    [Role.KNIGHT]: 'S',
    [Role.BISHOP]: 'I',
    [Role.ROOK]: 'T',
    [Role.QUEEN]: 'W',
    [Role.KING]: '$',
}

export const Pers: FunctionComponent<PersProps> = ({ id, color, role, onClick, cell }) => {
    const pers = persMap[role];
    const hexColor = color === Color.BLACK ? '#111' : '#DDD';
    const coordX = cell[1] * 100 / 8;
    const coordY = cell[0] * 100 / 8;

    return <div
        className="pers"
        style={{
            position: 'absolute',
            left: `${coordX}%`,
            bottom: `${coordY}%`,
            width: '6.25vh',
            height: '6.25vh',
        }}>
        <button type="button" className="pers-button" style={{ color: hexColor }} onClick={onClick}>
            {pers}
        </button>
    </div>
}