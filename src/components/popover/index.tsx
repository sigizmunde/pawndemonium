'use client';

import { ReactNode, useRef } from 'react';
import './popover.scss';

type PopoverProps = {
  x: number;
  y: number;
  children: ReactNode;
};

export default function Popover(props: PopoverProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const clientWidth = window.visualViewport?.width;
  const clientHeight = window.visualViewport?.height;

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const left = props.x + scrollX;
  const top = props.y + scrollY;

  const { width, height } = wrapperRef.current?.getBoundingClientRect() || {
    width: 100,
    height: 100,
  };
  const dX = clientWidth && 2 * props.x > clientWidth - width ? '-100%' : '0';
  const dY = clientHeight && 2 * props.y > clientHeight - height ? '-100%' : '0';

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={wrapperRef}
      className="popover-wrapper"
      style={{ position: 'absolute', left, top, transform: `translate(${dX},${dY})` }}
      onClick={stopPropagation}
    >
      {props.children}
    </div>
  );
}
