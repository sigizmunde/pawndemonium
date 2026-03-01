'use client';

import { isValidElement, MouseEventHandler, ReactNode } from 'react';
import './modal.scss';

/**
 * No need to pass onClose to Modal separately if the child component already has it, pass this prop only if you want to override the child's onClose behavior or if the child doesn't have onClose at all.
 */
type ModalProps = {
  onClose?: MouseEventHandler;
  children: ReactNode;
};

export default function Modal({ onClose = undefined, children }: ModalProps) {
  const childElement = isValidElement(children) ? children : null;
  const childOnClose = childElement ? (childElement.props as any).onClose : undefined;
  const resolvedOnClose: MouseEventHandler | undefined =
    onClose ?? (typeof childOnClose === 'function' ? childOnClose : undefined);

  return (
    <div className="modal-offscreen" onClick={resolvedOnClose}>
      <div
        className="modal-wrapper"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}
