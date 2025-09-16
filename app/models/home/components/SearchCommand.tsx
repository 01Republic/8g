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

export function SearchCommand() {
    const [predictions, setPredictions] = useState<string[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setPredictions(apps.filter((app) => app.toLowerCase().includes(query.toLowerCase())));
    }, [query]);

    return (
          <Command className="w-full border-2 rounded-lg">
            <CommandInput 
                placeholder="Find apps to see who uses them..." 
                value={query} 
                onValueChange={setQuery}
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
  