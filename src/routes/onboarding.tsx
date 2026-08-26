import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Mascot } from "@/components/Logo";
import { AUTHORS, CATEGORIES, LANGUAGES, emptyProfile, useProfile } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — Book Review" },
      {
        name: "description",
        content: "Set up your Book Review profile: tell us your details, favourite genres, authors and language.",
      },
      { property: "og:title", content: "Get started — Book Review" },
      { property: "og:description", content: "Personalise your Book Review reading feed in three quick steps." },
    ],
  }),
  component: Onboarding,
});

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "press rounded-2xl border px-3 py-2.5 text-sm font-semibold",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...emptyProfile });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (key: "categories" | "authors", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  function validateStep1() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    const age = Number(form.age);
    if (!form.age || Number.isNaN(age) || age < 5 || age > 120) e.age = "Enter an age between 5 and 120.";
    if (!form.gender) e.gender = "Please select a gender.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 0 && !validateStep1()) return;
    if (step === 1) {
      if (form.categories.length === 0) {
        setErrors({ categories: "Pick at least one category." });
        return;
      }
      setErrors({});
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  function finish() {
    saveProfile({ ...form, onboarded: true });
    navigate({ to: "/home", replace: true });
  }

  return (
    <main className="min-h-screen bg-gradient-hero px-4 pb-16 pt-8">
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center gap-2">
          <Mascot className="h-24 w-24" />
          <h1 className="font-display text-2xl font-bold">Welcome to Book Review</h1>
          <p className="text-sm text-muted-foreground">Step {step + 1} of 3</p>
        </div>

        <div className="mt-4 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-primary" : "bg-primary-soft",
              )}
            />
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-card p-5 shadow-soft">
          {step === 0 ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold">Tell us about you</h2>
              {(
                [
                  { key: "name", label: "Name", type: "text", placeholder: "Satya" },
                  { key: "age", label: "Age", type: "number", placeholder: "24" },
                  { key: "email", label: "Email ID", type: "email", placeholder: "you@mail.com" },
                ] as const
              ).map((f) => (
                <label key={f.key} className="block">
                  <span className="text-sm font-semibold">{f.label}</span>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  {errors[f.key] ? (
                    <span className="text-xs font-semibold text-destructive">{errors[f.key]}</span>
                  ) : null}
                </label>
              ))}
              <div>
                <span className="text-sm font-semibold">Gender</span>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {["Female", "Male", "Other"].map((g) => (
                    <Chip
                      key={g}
                      label={g}
                      selected={form.gender === g}
                      onClick={() => setForm((s) => ({ ...s, gender: g }))}
                    />
                  ))}
                </div>
                {errors.gender ? (
                  <span className="text-xs font-semibold text-destructive">{errors.gender}</span>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold">Favourite categories</h2>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      selected={form.categories.includes(c)}
                      onClick={() => toggle("categories", c)}
                    />
                  ))}
                </div>
                {errors.categories ? (
                  <span className="text-xs font-semibold text-destructive">{errors.categories}</span>
                ) : null}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Preferred authors</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {AUTHORS.map((a) => (
                    <Chip
                      key={a}
                      label={a}
                      selected={form.authors.includes(a)}
                      onClick={() => toggle("authors", a)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold">Choose your language</h2>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <Chip
                    key={l}
                    label={l}
                    selected={form.language === l}
                    onClick={() => setForm((s) => ({ ...s, language: l }))}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="press flex items-center gap-1 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={next}
                className="press flex items-center gap-1 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="press flex items-center gap-1 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft"
              >
                <Check className="h-4 w-4" /> Start reading
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
