"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Clock, MapPin, Package, Truck, RotateCcw } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        orderNumber: "",
        subject: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        // For now, open the user's mail client with a pre-filled message.
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\nOrder #: ${formData.orderNumber || "—"}\n\n${formData.message}`,
        )
        const subject = encodeURIComponent(formData.subject || "Customer enquiry")
        window.location.href = `mailto:Contact@nurslibrary.com?subject=${subject}&body=${body}`
        setTimeout(() => {
            setSubmitted(true)
            setSubmitting(false)
        }, 400)
    }

    return (
        <main className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#e3fffe] via-white to-[#f2f4f6] border-b border-[#bdc9c8]">
                <div className="max-w-5xl mx-auto px-5 md:px-8 py-14 md:py-20">
                    <nav className="text-xs text-[#6e7979] mb-4" aria-label="Breadcrumb">
                        <a href="/" className="hover:text-[#006565]">Home</a>
                        <span className="mx-2">/</span>
                        <span className="text-[#3e4949]">Contact</span>
                    </nav>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#191c1e] leading-tight"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Contact NursLibrary
                    </h1>
                    <p
                        className="mt-4 text-base md:text-lg text-[#3e4949] max-w-2xl"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        Questions about your order, shipping, or a returned book? Our team replies within 1 business day, Monday–Friday.
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">
                <div className="grid md:grid-cols-5 gap-8">
                    {/* Form */}
                    <div className="md:col-span-3 bg-white rounded-2xl border border-[#bdc9c8] shadow-teal-md p-6 md:p-8">
                        <h2
                            className="text-xl md:text-2xl font-bold text-[#191c1e] mb-2"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            Send us a message
                        </h2>
                        <p className="text-sm text-[#6e7979] mb-6">
                            Have your order number ready if your enquiry is about a recent purchase.
                        </p>

                        {submitted && (
                            <div className="mb-6 p-4 rounded-lg border border-[#76d6d5] bg-[#e3fffe] text-[#005454] text-sm">
                                Your email client has been opened with your message. If nothing happened, write to us directly at <a className="underline font-medium" href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a>.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#191c1e] mb-1.5">Your name</label>
                                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-white border border-[#bdc9c8] rounded-lg text-[#191c1e] placeholder-[#9aa5a5] focus:outline-none focus:ring-2 focus:ring-[#006565] focus:border-[#006565]"
                                        placeholder="Jane Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#191c1e] mb-1.5">Email</label>
                                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-white border border-[#bdc9c8] rounded-lg text-[#191c1e] placeholder-[#9aa5a5] focus:outline-none focus:ring-2 focus:ring-[#006565] focus:border-[#006565]"
                                        placeholder="you@example.com" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="orderNumber" className="block text-sm font-medium text-[#191c1e] mb-1.5">Order number <span className="text-[#6e7979] font-normal">(optional)</span></label>
                                    <input id="orderNumber" name="orderNumber" type="text" value={formData.orderNumber} onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-white border border-[#bdc9c8] rounded-lg text-[#191c1e] placeholder-[#9aa5a5] focus:outline-none focus:ring-2 focus:ring-[#006565] focus:border-[#006565]"
                                        placeholder="NL-12345" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-[#191c1e] mb-1.5">Subject</label>
                                    <select id="subject" name="subject" required value={formData.subject} onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-white border border-[#bdc9c8] rounded-lg text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006565] focus:border-[#006565]">
                                        <option value="">Choose a topic…</option>
                                        <option>Order status / tracking</option>
                                        <option>Shipping question</option>
                                        <option>Return or refund</option>
                                        <option>Damaged book</option>
                                        <option>Digital PDF access</option>
                                        <option>Wholesale / bulk order</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-[#191c1e] mb-1.5">Message</label>
                                <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 bg-white border border-[#bdc9c8] rounded-lg text-[#191c1e] placeholder-[#9aa5a5] focus:outline-none focus:ring-2 focus:ring-[#006565] focus:border-[#006565] resize-none"
                                    placeholder="How can we help?" />
                            </div>

                            <button type="submit" disabled={submitting}
                                className="w-full px-6 py-3 bg-[#006565] text-white font-semibold rounded-lg hover:bg-[#008080] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                                {submitting ? "Opening your email…" : "Send message"}
                            </button>

                            <p className="text-xs text-[#6e7979] text-center">
                                Or write to us directly at <a className="underline font-medium text-[#006565]" href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a>
                            </p>
                        </form>
                    </div>

                    {/* Side info */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl border border-[#bdc9c8] p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-[#e3fffe] text-[#006565]"><Mail className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-semibold text-[#191c1e]">Email</h3>
                                    <p className="text-sm text-[#3e4949] mt-1"><a className="hover:text-[#006565]" href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a></p>
                                    <p className="text-xs text-[#6e7979] mt-1">Preferred contact method · We reply within 1 business day.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#bdc9c8] p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-[#e3fffe] text-[#006565]"><Clock className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-semibold text-[#191c1e]">Business hours</h3>
                                    <ul className="text-sm text-[#3e4949] mt-1 space-y-0.5">
                                        <li>Monday – Friday: 9:00 AM – 6:00 PM</li>
                                        <li>Saturday: 10:00 AM – 4:00 PM</li>
                                        <li>Sunday: Closed</li>
                                    </ul>
                                    <p className="text-xs text-[#6e7979] mt-2">All times Eastern Time (EST/EDT).</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#bdc9c8] p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-[#e3fffe] text-[#006565]"><MapPin className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-semibold text-[#191c1e]">Business details</h3>
                                    <address className="not-italic text-sm text-[#3e4949] mt-1 leading-relaxed">
                                        <strong className="text-[#191c1e]">Nurs Library</strong><br />
                                        7P64+R6J Abu Dhabi<br />
                                        Abu Dhabi 20000<br />
                                        United Arab Emirates
                                    </address>
                                    <p className="text-xs text-[#6e7979] mt-2">Returns and pre-purchase questions are answered by email; we will provide return-shipping instructions on request.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f7f9fb] rounded-2xl border border-[#bdc9c8] p-6">
                            <h3 className="font-semibold text-[#191c1e] mb-3">Common topics</h3>
                            <ul className="space-y-3 text-sm text-[#3e4949]">
                                <li className="flex items-start gap-2"><Package className="w-4 h-4 text-[#006565] mt-0.5 flex-shrink-0" /> Track your shipment — check the tracking link in your shipping-confirmation email.</li>
                                <li className="flex items-start gap-2"><Truck className="w-4 h-4 text-[#006565] mt-0.5 flex-shrink-0" /> Shipping timeframes — see the <a className="underline text-[#006565]" href="/shipping-policy">Shipping Policy</a>.</li>
                                <li className="flex items-start gap-2"><RotateCcw className="w-4 h-4 text-[#006565] mt-0.5 flex-shrink-0" /> 30-day returns — see the <a className="underline text-[#006565]" href="/refund-policy">Refund Policy</a>.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
