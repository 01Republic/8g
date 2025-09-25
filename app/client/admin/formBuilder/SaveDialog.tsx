import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"

interface SaveDialogProps {
  open: boolean
  title: string
  message: string
  onClose: () => void
}

export const SaveDialog = (props: SaveDialogProps) => {
  const { open, title, message, onClose } = props

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end">
          <AlertDialogAction onClick={onClose}>확인</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}


