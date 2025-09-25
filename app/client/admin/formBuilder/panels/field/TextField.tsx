import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface TextFieldProps {
  id: string
  label: string
  value: string
  placeholder?: string
  type?: string
  description?: string
  onChange: (value: string) => void
}

const TextField = ({
  id,
  label,
  value,
  placeholder,
  type = 'text',
  description,
  onChange,
}: TextFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </div>
  )
}

export default TextField

