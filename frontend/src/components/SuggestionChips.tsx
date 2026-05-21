interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export default function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {

    const handleClick = (suggestion: string) => {
        onSelect(suggestion);
    };  
  
    return (
        <div className="suggestion-chips">
            {suggestions.map((suggestion, index) => (
                <button key={index} className="suggestion-chip" onClick={() => handleClick(suggestion)}>
                    {suggestion}
                </button>
            ))}
        </div>
    );
}