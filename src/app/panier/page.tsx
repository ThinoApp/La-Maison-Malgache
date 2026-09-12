import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Panier" };
export default function CartPage() { return <div className="site-shell py-16 sm:py-24"><div className="max-w-3xl"><h1 className="display text-6xl leading-[0.9] sm:text-8xl">Panier</h1><div className="mt-12 border-t border-[var(--line)] pt-8"><p className="text-lg text-[var(--muted)]">Le panier sera branché sur la solution commerce choisie. Aucun état local fictif n'est conservé dans ce socle.</p><Link href="/boutique" className="link-underline mt-7 text-sm font-medium">Retour à la boutique</Link></div></div></div>; }
