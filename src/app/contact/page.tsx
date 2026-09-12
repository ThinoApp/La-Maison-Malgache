import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() { return <div className="site-shell py-16 sm:py-24"><div className="grid gap-12 lg:grid-cols-2"><h1 className="display text-6xl leading-[0.9] sm:text-8xl">Contact</h1><div className="max-w-xl lg:pt-4"><p className="text-lg leading-8 text-[var(--muted)]">Les coordonnées officielles et le formulaire définitif seront ajoutés une fois le canal de contact confirmé.</p></div></div></div>; }
