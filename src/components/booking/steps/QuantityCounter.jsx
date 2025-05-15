const QuantityCounter = ({ id, value, onChange, min, max, label, helpText }) => {
  return (
    <div>
      <label htmlFor={`${id}-display`} className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <button 
          type="button" 
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-700"
          onClick={() => value > min && onChange(value - 1)}
          aria-label={`Diminuer le nombre de ${label.toLowerCase()}`}
          aria-controls={`${id}-display`}
          disabled={value <= min}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <span 
          id={`${id}-display`} 
          className="flex-1 text-center py-2 font-medium text-lg" 
          aria-live="polite" 
          role="status"
        >
          {value}
        </span>
        <button 
          type="button" 
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-700"
          onClick={() => value < max && onChange(value + 1)}
          aria-label={`Augmenter le nombre de ${label.toLowerCase()}`}
          aria-controls={`${id}-display`}
          disabled={value >= max}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {helpText && (
        <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default QuantityCounter;