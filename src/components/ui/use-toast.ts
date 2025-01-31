interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast(props: ToastProps) {
  const toastElement = document.createElement("div")
  toastElement.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
    props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background"
  }`
  
  const titleElement = document.createElement("div")
  titleElement.className = "font-semibold"
  titleElement.textContent = props.title
  toastElement.appendChild(titleElement)

  if (props.description) {
    const descriptionElement = document.createElement("div")
    descriptionElement.className = "text-sm opacity-90"
    descriptionElement.textContent = props.description
    toastElement.appendChild(descriptionElement)
  }

  document.body.appendChild(toastElement)

  setTimeout(() => {
    toastElement.classList.add("opacity-0", "transition-opacity")
    setTimeout(() => {
      document.body.removeChild(toastElement)
    }, 300)
  }, 3000)
} 