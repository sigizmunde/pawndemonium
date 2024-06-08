'use client';

import { MouseEventHandler, ReactNode } from 'react';
import './modal.scss';

type ModalProps = {
  onClose: MouseEventHandler;
  children: ReactNode;
};

export default function Modal(props: ModalProps) {
  return (
    <div className="modal-offscreen" onClick={props.onClose}>
      <div
        className="modal-wrapper"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
