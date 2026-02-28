const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}) => {
  const colorVariants = {
    blue: {
      border: "border-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
    },
    emerald: {
      border: "border-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      gradient: "from-emerald-500 to-emerald-600",
    },
    indigo: {
      border: "border-indigo-500",
      text: "text-indigo-600",
      bg: "bg-indigo-50",
      gradient: "from-indigo-500 to-indigo-600",
    },
    purple: {
      border: "border-purple-500",
      text: "text-purple-600",
      bg: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
    },
    orange: {
      border: "border-orange-500",
      text: "text-orange-600",
      bg: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
    },
    red: {
      border: "border-red-500",
      text: "text-red-600",
      bg: "bg-red-50",
      gradient: "from-red-500 to-red-600",
    },
    green: {
      border: "border-green-500",
      text: "text-green-600",
      bg: "bg-green-50",
      gradient: "from-green-500 to-green-600",
    },
  };

  const variant = colorVariants[color];

  return (
    <div
      className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg border-l-4 ${variant.border} hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100`}
    >
      {/* Gradient Background Animation */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${variant.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-widest">
              {title}
            </h3>
            <p className="text-5xl font-black text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
              {value}
            </p>
            {subtitle && (
              <p className="text-base font-medium text-gray-600">{subtitle}</p>
            )}
            {trend && (
              <p
                className={`text-sm font-bold mt-3 ${trend.isPositive ? "text-emerald-600" : "text-red-600"}`}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={`p-4 rounded-xl bg-gradient-to-br ${variant.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 w-0 group-hover:w-full transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default StatsCard;
