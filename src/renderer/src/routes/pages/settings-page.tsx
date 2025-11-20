import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { useSettings, useAutoSaveSettings } from '@renderer/hooks/use-settings'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Input } from '@renderer/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { updateSettingsSchema } from '@shared/schemas'

type SettingsForm = z.infer<typeof updateSettingsSchema>

export function SettingsPage() {
  useTitlebar({ title: 'Kel — Settings' })

  const { settings, isLoading } = useSettings()
  const { mutate, saveStatus } = useAutoSaveSettings()

  const form = useForm<SettingsForm>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      preferredName: '',
      apiKey: null,
      apiKeyType: null
    }
  })

  // Initialize form when settings load
  useEffect(() => {
    if (settings) {
      form.reset({
        preferredName: settings.preferredName || '',
        apiKey: settings.apiKey || null,
        apiKeyType: settings.apiKeyType || null
      })
    }
  }, [settings, form])

  const handleFieldChange = (field: keyof SettingsForm, value: string | null) => {
    mutate({ [field]: value || null })
  }

  if (isLoading) {
    return (
      <div className="h-20">
        <div className="px-6 py-4 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="h-32"></div>
      <div className="px-4 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
          >
            {' '}
            <path
              d="M4 5h16v2H4V5zm0 12H2V7h2v10zm16 0v2H4v-2h16zm0 0h2V7h-2v10zm-2-8h-4v6h4V9z"
              fill="currentColor"
            />{' '}
          </svg>
          <SaveIndicator status={saveStatus} />
        </div>

        <Form {...form}>
          <div className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="preferredName"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="text-xs">Preferred Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        handleFieldChange('preferredName', e.target.value)
                      }}
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKeyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">API Provider</FormLabel>
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value || null)
                      handleFieldChange('apiKeyType', value || null)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">API Key</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      handleFieldChange('apiKey', e.target.value)
                    }}
                    placeholder="Enter your API key"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>
    </div>
  )
}

function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null

  if (status === 'saved') {
    return <div className="text-xs text-muted-foreground">Saved</div>
  }

  const config = {
    saving: { icon: Loader2, text: 'Saving...', className: 'text-muted-foreground', animate: true },
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
