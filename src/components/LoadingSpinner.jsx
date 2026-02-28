const LoadingSpinner = ({ size = 'md', fullPage = false, message = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
            {message && <p className="text-gray-600 text-sm">{message}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default LoadingSpinner;
