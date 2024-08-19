export interface BudPayPaymentConfig {
    api_key: string;
    amount: number;
    currency: string;
    reference?: string;
    customer: {
        email: string;
        first_name?: string;
        last_name?: string;
        phone?: string;
    }
    callback_url?: string;
    onComplete?: (response: { reference: string, status: 'success' | 'failed' | 'canceled' }) => void;
    onCancel?: (response: { reference: string, status: 'canceled' }) => void;
    custom_fields?: { [key: string]: any };
    debug?: boolean;
}


export interface BudPayPaymentAPIConfig {
    status: boolean
    type: 'merchant_integration';
    key: string;
    amount: string;
    currency: string;
    reference?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    callback_url?: string;
    custom_fields?: { [key: string]: any };
}