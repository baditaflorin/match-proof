import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SignalBoxProps {
  label: string
  value: string
}

export function SignalBox({ label, value }: SignalBoxProps) {
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState<string>()

  useEffect(() => {
    let active = true
    if (!value) {
      return
    }

    import('qrcode')
      .then((module) => module.toDataURL(value, { margin: 1, width: 184 }))
      .then((image) => {
        if (active) {
          setQr(image)
        }
      })
      .catch(() => setQr(undefined))

    return () => {
      active = false
    }
  }, [value])

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold" htmlFor={`${label}-signal`}>
          {label}
        </label>
        <button
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm font-medium hover:border-slate-500"
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1200)
          }}
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <textarea
        id={`${label}-signal`}
        className="min-h-28 rounded-md border border-slate-300 bg-white p-3 font-mono text-xs"
        readOnly
        value={value}
      />
      {qr ? (
        <img
          className="h-[184px] w-[184px] rounded-md border border-slate-200 bg-white p-2"
          src={qr}
          alt={`${label} QR code`}
        />
      ) : null}
    </div>
  )
}
