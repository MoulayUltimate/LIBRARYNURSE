"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { getAllProducts, getCollections } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Users,
  Award,
  Globe,
  Download,
  CheckCircle,
  Stethoscope,
  HeartCrack as Heartbeat,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BenefitsTicker } from "@/components/benefits-ticker"

export default function StorePage() {
  const products = getAllProducts()
  const collections = getCollections()
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const filteredProducts = selectedCollection ? products.filter((p) => p.collection === selectedCollection) : products

  return (
    <>
      <Header />
      <main>
        <div className="relative w-full h-96 md:h-[500px] bg-cover bg-center overflow-hidden">
          <Image
            src="/nurse-hero-banner.png"
            alt="Professional nursing healthcare professionals"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div className="text-center max-w-3xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-1 w-8 bg-accent"></div>
                <Heartbeat className="w-6 h-6 text-accent" />
                <div className="h-1 w-8 bg-accent"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Premium Nursing Education Resources
              </h1>
              <p className="text-lg md:text-xl text-white/95 mb-8 font-light drop-shadow-md">
                Access comprehensive evidence-based eBooks from leading nursing experts
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Explore Collections
              </Button>
            </div>
          </div>
        </div>

        <BenefitsTicker />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-16 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why Choose LibraryNurse?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-xl border border-border hover:border-primary hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-50">
                <Stethoscope className="w-14 h-14 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Expert-Written Content</h3>
                <p className="text-muted-foreground">
                  All eBooks authored by experienced nursing professionals with extensive clinical practice expertise.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl border border-border hover:border-primary hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-50">
                <Globe className="w-14 h-14 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Instant Global Access</h3>
                <p className="text-muted-foreground">
                  Download your resources instantly and access them anywhere in the world, anytime.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl border border-border hover:border-primary hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-50">
                <Award className="w-14 h-14 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Latest Evidence</h3>
                <p className="text-muted-foreground">
                  Stay current with the latest nursing research and evidence-based clinical practice standards.
                </p>
              </div>
            </div>
          </section>

          <section className="py-16 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 border-b-2 border-primary pb-3 inline-block">
              Nursing Specialties
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
              {collections.slice(0, 6).map((collection) => (
                <Link
                  key={collection.id}
                  href={`#collections`}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedCollection(collection.slug)
                    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group relative h-40 md:h-48 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-70 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative h-full flex items-end justify-start p-4">
                    <div>
                      <h3 className="font-semibold text-white text-sm md:text-base">{collection.name}</h3>
                      <div className="flex items-center gap-1 text-white/90 text-xs md:text-sm mt-2">
                        Browse{" "}
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-12" id="collections">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-6">
                Browse by Specialty
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCollection === null ? "default" : "outline"}
                  className={selectedCollection === null ? "bg-primary hover:bg-primary/90" : ""}
                  onClick={() => setSelectedCollection(null)}
                >
                  All Collections
                </Button>
                {collections.map((collection) => (
                  <Button
                    key={collection.id}
                    variant={selectedCollection === collection.slug ? "default" : "outline"}
                    className={selectedCollection === collection.slug ? "bg-primary hover:bg-primary/90" : ""}
                    onClick={() => setSelectedCollection(collection.slug)}
                  >
                    {collection.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {selectedCollection
                  ? `${collections.find((c) => c.slug === selectedCollection)?.name} eBooks`
                  : "Featured Resources"}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "resource" : "resources"} available
              </p>
            </div>
            <ProductGrid products={filteredProducts} />
          </section>

          <section className="py-16 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 border-b-2 border-accent pb-3 inline-block">
              Specialty Areas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
              {collections.slice(6, 12).map((collection) => (
                <Link
                  key={collection.id}
                  href={`#collections`}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedCollection(collection.slug)
                    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group relative h-40 md:h-48 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary opacity-70 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative h-full flex items-end justify-start p-4">
                    <div>
                      <h3 className="font-semibold text-white text-sm md:text-base">{collection.name}</h3>
                      <div className="flex items-center gap-1 text-white/90 text-xs md:text-sm mt-2">
                        Browse{" "}
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="py-16 mb-12 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl border border-border p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Curated Collections</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Explore our hand-picked collections of nursing eBooks, organized by specialty and clinical area of focus.
            </p>
            <ProductGrid products={products.slice(0, 3)} />
          </section>

          {/* Why Nurses Trust LibraryNurse */}
          <section className="py-16 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why Nurses Trust LibraryNurse
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-border rounded-xl p-8 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-teal-50 hover:border-primary">
                <Download className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Instant Digital Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download your eBooks immediately after purchase. No delays, no waiting. Access your resources offline
                  on any device.
                </p>
              </div>
              <div className="border border-border rounded-xl p-8 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-teal-50 hover:border-primary">
                <CheckCircle className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Verified & Secure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All content verified by healthcare professionals. Your data encrypted and transactions secure. Shop
                  with confidence.
                </p>
              </div>
              <div className="border border-border rounded-xl p-8 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-teal-50 hover:border-primary">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Join Our Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with thousands of nurses globally. Access exclusive updates and professional development
                  resources.
                </p>
              </div>
              <div className="border border-border rounded-xl p-8 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-teal-50 hover:border-primary">
                <Award className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Quality Assured</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every eBook meets rigorous quality standards for accuracy, completeness, and educational excellence.
                </p>
              </div>
            </div>
          </section>

          <section className="py-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Popular Resources</h2>
            <ProductGrid products={products.slice(3, 6)} />
          </section>

          {/* About LibraryNurse */}
          <section className="py-16 mb-12 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-2xl border border-border p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <Stethoscope className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About LibraryNurse</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                LibraryNurse is a trusted provider of premium nursing education and clinical resources. We're committed
                to advancing nursing practice through high-quality, evidence-based learning materials.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our curated collection spans all major nursing specialties and clinical domains, providing comprehensive
                resources written by experienced nurses and healthcare educators.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're a student, practicing nurse, or educator, LibraryNurse supports your professional growth
                and clinical excellence.
              </p>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="py-16 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "How do I access my purchased eBooks?",
                  a: "After purchase, you'll receive a download link via email. Download immediately and access on any PDF-compatible device.",
                },
                {
                  q: "Can I use eBooks for continuing education credits?",
                  a: "Check your nursing board requirements. Many eBooks can be used for professional development. Refer to Terms of Service for licensing details.",
                },
                {
                  q: "What devices can I use to read the eBooks?",
                  a: "eBooks are PDF files compatible with all devices: tablets, phones, computers, and e-readers. Read online or offline.",
                },
                {
                  q: "Is there a money-back guarantee?",
                  a: "Yes! We offer a 30-day refund guarantee. Contact support if unsatisfied. Full details in our Refund Policy.",
                },
                {
                  q: "How often are resources updated?",
                  a: "We regularly update our collection with latest nursing research and clinical guidelines to ensure current information.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group border border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors bg-white hover:bg-blue-50"
                >
                  <summary className="font-semibold text-foreground flex items-center gap-3 select-none">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold group-open:hidden">
                      +
                    </span>
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold hidden group-open:flex">
                      −
                    </span>
                    {faq.q}
                  </summary>
                  <p className="text-muted-foreground mt-4 ml-9 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
