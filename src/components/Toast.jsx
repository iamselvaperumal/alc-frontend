import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        success: {
            bg: 'bg-green-50 border-green-500',
            text: 'text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-500" />
        },
        error: {
            bg: 'bg-red-50 border-red-500',
            text: 'text-red-800',
            icon: <XCircle className="w-5 h-5 text-red-500" />
        },
        warning: {
            bg: 'bg-yellow-50 border-yellow-500',
            text: 'text-yellow-800',
            icon: <AlertCircle className="w-5 h-5 text-yellow-500" />
        },
        info: {
            bg: 'bg-blue-50 border-blue-500',
            text: 'text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-500" />
        }
    };

    const variant = variants[type];

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-md animate-slide-in-right`}>
            <div className={`${variant.bg} border-l-4 p-4 rounded-lg shadow-lg flex items-start gap-3`}>
                {variant.icon}
                <p className={`${variant.text} flex-1 font-medium`}>{message}</p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${variant.text} hover:opacity-70 transition-opacity`}
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toast;
