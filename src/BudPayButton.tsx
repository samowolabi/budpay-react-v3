import React from 'react';
import useBudPayPayment from "./useBudPayPayment";
import { BudPayPaymentConfig } from "../types/types";

interface BudPayButtonProps extends BudPayPaymentConfig {
    text?: string;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function BudPayButton({
    text,
    className,
    disabled,
    children,
    ...config
}: BudPayButtonProps) {
    const openPaymentModal = useBudPayPayment(config);

    return (
        <button
            disabled={disabled}
            className={className}
            onClick={!disabled ? openPaymentModal : ()=>{}}
        >
            {text || children}
        </button>
    )
}