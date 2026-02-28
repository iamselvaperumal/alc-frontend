const FormInput = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    options = [], // For select inputs
    rows = 3, // For textarea
    ...props
}) => {
    const baseInputClasses = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`;

    const renderInput = () => {
        if (type === 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={baseInputClasses}
                    {...props}
                >
                    <option value="">{placeholder || 'Select an option'}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    rows={rows}
                    className={baseInputClasses}
                    {...props}
                />
            );
        }

        return (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={baseInputClasses}
                {...props}
            />
        );
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {renderInput()}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default FormInput;
