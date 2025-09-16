import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"

interface SearchCommandProps {
    query: string;
    onQueryChange: (value: string) => void;
    predictions: string[];
}

export function SearchCommand({ query, onQueryChange, predictions }: SearchCommandProps) {

    return (
          <Command className="w-full border-2 rounded-lg">
            <CommandInput 
                placeholder="Find apps to see who uses them..." 
                value={query} 
                onValueChange={onQueryChange}
                className="w-full h-12 px-4 text-base border-0 focus:ring-0"
            />
                    {query && (
            <CommandList>
                <CommandEmpty>Please type a command or search...</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    {predictions.map((prediction) => (
                        <CommandItem key={prediction}>
                            {prediction}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        )}
          </Command>
    )
  }
  