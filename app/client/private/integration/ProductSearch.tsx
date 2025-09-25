import { useEffect, useState } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"

const apps = [
    "Slack",
    "Google Drive",
    "Google Calendar",
    "Google Docs",
    "Google Sheets",
    "Google Slides",
    "Google Forms",
    "Notion",
    "Trello",
    "Asana",
    "Jira",
    "Monday",
    "Basecamp",
    "Trello",
]

export const ProductSearch = () => {
    const [predictions, setPredictions] = useState<string[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setPredictions(apps.filter((app) => app.toLowerCase().includes(query.toLowerCase())));
    }, [query]);

    return (
      <Command>
        <CommandInput 
            placeholder="Type a command or search..." 
            value={query} 
            onValueChange={setQuery} />
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
  