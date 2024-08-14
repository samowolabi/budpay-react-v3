export interface BudPayPaymentConfig {
    key: string;
    amount: number;
    currency: string;
    email: string;
    reference?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    callback_url?: string;
    callback?: (response: { reference: string, status: 'success' | 'failed' | 'canceled' }) => void;
    onCanceled?: (response: { reference: string, status: 'canceled' }) => void;
    custom_fields?: { [key: string]: string };
}