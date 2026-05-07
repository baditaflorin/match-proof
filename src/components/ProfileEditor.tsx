import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { aliceProfile, bobProfile } from '../features/profile/defaultProfiles'
import {
  attributeKindLabels,
  attributeKinds,
  createAttribute,
  type AttributeKind,
  type LocalProfile,
} from '../features/profile/schema'

interface ProfileEditorProps {
  profile: LocalProfile
  onChange: (profile: LocalProfile) => void
}

export function ProfileEditor({ profile, onChange }: ProfileEditorProps) {
  function updateProfile(update: Partial<LocalProfile>) {
    onChange({ ...profile, ...update })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Local profile</h2>
          <p className="text-sm text-slate-600">Saved in this browser only.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:border-slate-500"
            type="button"
            onClick={() => onChange({ ...aliceProfile, id: crypto.randomUUID() })}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Alice
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:border-slate-500"
            type="button"
            onClick={() => onChange({ ...bobProfile, id: crypto.randomUUID() })}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Bob
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Display name
          <input
            className="rounded-md border border-slate-300 px-3 py-2 font-normal"
            value={profile.displayName}
            onChange={(event) => updateProfile({ displayName: event.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Headline
          <input
            className="rounded-md border border-slate-300 px-3 py-2 font-normal"
            value={profile.headline}
            onChange={(event) => updateProfile({ headline: event.target.value })}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3">
        {profile.attributes.map((attribute) => (
          <div
            className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[150px_1fr_1fr_auto]"
            key={attribute.id}
          >
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-normal text-slate-500">
              Kind
              <select
                className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm font-normal normal-case text-slate-950"
                value={attribute.kind}
                onChange={(event) =>
                  updateAttribute(profile, attribute.id, { kind: event.target.value as AttributeKind }, onChange)
                }
              >
                {attributeKinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {attributeKindLabels[kind]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-normal text-slate-500">
              Label
              <input
                className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm font-normal normal-case text-slate-950"
                value={attribute.label}
                onChange={(event) => updateAttribute(profile, attribute.id, { label: event.target.value }, onChange)}
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-normal text-slate-500">
              Private value
              <input
                className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm font-normal normal-case text-slate-950"
                value={attribute.value}
                onChange={(event) => updateAttribute(profile, attribute.id, { value: event.target.value }, onChange)}
              />
            </label>
            <button
              className="inline-flex size-10 items-center justify-center self-end rounded-md border border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:text-red-700"
              type="button"
              aria-label={`Remove ${attribute.label}`}
              onClick={() =>
                updateProfile({
                  attributes: profile.attributes.filter((candidate) => candidate.id !== attribute.id),
                })
              }
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <button
        className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        type="button"
        onClick={() => updateProfile({ attributes: [...profile.attributes, createAttribute()] })}
      >
        <Plus className="size-4" aria-hidden="true" />
        Add attribute
      </button>
    </section>
  )
}

function updateAttribute(
  profile: LocalProfile,
  attributeId: string,
  update: Partial<LocalProfile['attributes'][number]>,
  onChange: (profile: LocalProfile) => void,
) {
  onChange({
    ...profile,
    attributes: profile.attributes.map((attribute) =>
      attribute.id === attributeId ? { ...attribute, ...update } : attribute,
    ),
  })
}
