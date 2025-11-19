import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { Input } from '@renderer/components/ui/input'
import { useSettings, useAutoSaveSettings } from '@renderer/hooks/use-settings'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { Check, Loader2, AlertCircle } from 'lucide-react'

// Client-side validation schema
const settingsFormSchema = z.object({
  preferredName: z.string().min(1, 'Preferred name is required').max(100),
  apiKey: z.string().min(1).max(500).nullable(),
  apiKeyType: z.enum(['Openrouter', 'Anthropic']).nullable()
})

type SettingsForm = z.infer<typeof settingsFormSchema>
type FieldErrors = Partial<Record<keyof SettingsForm, string>>

export function SettingsPage() {
  useTitlebar({ title: 'Kel — Settings' })

  const { settings, isLoading } = useSettings()
  const { mutate, saveStatus } = useAutoSaveSettings()

  const [formData, setFormData] = useState<SettingsForm>({
    preferredName: '',
    apiKey: null,
    apiKeyType: null
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        preferredName: settings.preferredName || '',
        apiKey: settings.apiKey || null,
        apiKeyType: settings.apiKeyType || null
      })
    }
  }, [settings])

  const validateAndSave = (field: keyof SettingsForm, value: string | null) => {
    const newData = { ...formData, [field]: value || null }
    setFormData(newData)

    // Validate
    const result = settingsFormSchema.safeParse(newData)

    if (result.success) {
      // Clear error for this field
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      // Save to backend
      mutate({ [field]: value || null })
    } else {
      // Set errors
      const fieldError = result.error.issues.find((e) => e.path[0] === field)
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [field]: fieldError.message }))
      }
    }
  }

  if (isLoading) {
    return (
      <>
        <div className="h-20"></div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="h-20"></div>
      <div className="px-6 py-4 space-y-6">
        {/* Header with save indicator */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <SaveIndicator status={saveStatus} />
        </div>

        {/* Preferred Name */}
        <div className="space-y-1.5">
          <label htmlFor="preferredName" className="text-sm font-medium">
            Preferred Name
          </label>
          <Input
            id="preferredName"
            value={formData.preferredName}
            onChange={(e) => validateAndSave('preferredName', e.target.value)}
            placeholder="Enter your name"
            aria-invalid={!!errors.preferredName}
          />
          {errors.preferredName && (
            <p className="text-xs text-destructive">{errors.preferredName}</p>
          )}
        </div>

        {/* API Key Type */}
        <div className="space-y-1.5">
          <label htmlFor="apiKeyType" className="text-sm font-medium">
            API Provider
          </label>
          <select
            id="apiKeyType"
            value={formData.apiKeyType || ''}
            onChange={(e) => validateAndSave('apiKeyType', e.target.value || null)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select provider</option>
            <option value="Openrouter">Openrouter</option>
            <option value="Anthropic">Anthropic</option>
          </select>
        </div>

        {/* API Key */}
        <div className="space-y-1.5">
          <label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={formData.apiKey || ''}
            onChange={(e) => validateAndSave('apiKey', e.target.value)}
            placeholder="Enter your API key"
            aria-invalid={!!errors.apiKey}
          />
          {errors.apiKey && <p className="text-xs text-destructive">{errors.apiKey}</p>}
        </div>
      </div>
    </>
  )
}

function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null

  const config = {
    saving: { icon: Loader2, text: 'Saving...', className: 'text-muted-foreground', animate: true },
    saved: { icon: Check, text: 'Saved', className: 'text-green-600', animate: false },
    error: {
      icon: AlertCircle,
      text: 'Error saving',
      className: 'text-destructive',
      animate: false
    }
  }

  const { icon: Icon, text, className, animate } = config[status]

  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${animate ? 'animate-spin' : ''}`} />
      <span>{text}</span>
    </div>
  )
}
