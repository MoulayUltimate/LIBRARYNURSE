import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { getCollections } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
    Users,
    Award,
    Globe,
    Download,
    ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BenefitsTicker } from "@/components/benefits-ticker"
import { HeroSection } from "@/components/hero-section"

export const runtime = "edge"

async function getProducts() {
    try {
        const db = process.env.DB as any
        if (!db) return []

        const { results } = await db.prepare("SELECT * FROM Products").all()
        return results.map((p: any) => ({
            ...p,
            collections: p.collections ? JSON.parse(p.collections) : [],
            // Ensure price is a number
            price: Number(p.price)
        }))
    } catch (error) {
        console.error("Failed to fetch products:", error)
        return []
    }
}

export default async function StorePage() {
    const products = await getProducts()
    const collections = getCollections()

    // Select specific popular collections to feature on the homepage
    const featuredCollectionSlugs = [
        'veterinary-medicine',
        'animals',
        'todays-deals',
        'best-sellers',
        'anatomia-fisiologia-y-patologia',
        'diagnostico-y-medicina-interna',
        'dentistry-1',
        'dermatology',
        'aquatic-animals',
        'ophtalmology-1',
        'equine',
        'veterinary-surgery',
        'veterinary-radiology',
        'veterinary-epidemiology'
    ]
    const featuredCollections = collections.filter(c => featuredCollectionSlugs.includes(c.slug))

    // Fallback if specific slugs aren't found
    const displayCollections = featuredCollections.length > 0 ? featuredCollections : collections.slice(0, 5)

    return (
        <>
            <Header />
            <main>
                <HeroSection />

                <BenefitsTicker />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Categories Grid */}
                    <section className="py-16" id="categories">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Clinical Science</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            <Link href="/collections/anaesthesia" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_anesthesia_1768669710644.png"
                                        alt="Anesthesia"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Anesthesia <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/animal-behavior" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_animal_behavior_1768669725321.png"
                                        alt="Animal behavior"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Animal behavior <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/dentistry-1" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_dentistry_1768669739380.png"
                                        alt="Dentistry"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Dentistry <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/dermatology" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_dermatology_1768669756381.png"
                                        alt="Dermatology"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Dermatology <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/emergency-and-critical-care" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_emergency_1768669770998.png"
                                        alt="Emergency and Critical Care"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Emergency and Critical Care <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/veterinary-epidemiology" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_epidemiology_1768669789021.png"
                                        alt="Epidemiology"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Epidemiology <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/veterinary-medicine" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_internal_medicine_1768669814153.png"
                                        alt="Internal Medicine"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Internal Medicine <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/pharmacology" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_pharmacology_1768669827844.png"
                                        alt="Pharmacology"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Pharmacology <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/veterinary-radiology" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_radiology_1768669849328.png"
                                        alt="Radiology"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Radiology <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/veterinary-surgery" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_surgery_1768669863765.png"
                                        alt="Surgery"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Surgery <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/veterinary-anatomy" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_physical_exam_1768669876846.png"
                                        alt="Physical Examinations, Procedures and Techniques"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Physical Examinations, Procedures and Techniques <ArrowRight size={14} />
                                </p>
                            </Link>

                            <Link href="/collections/ophtalmology-1" className="group">
                                <div className="rounded-2xl overflow-hidden bg-slate-100 mb-3 aspect-square">
                                    <Image
                                        src="/category_ophthalmology_1768669890605.png"
                                        alt="Ophtalmology"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm text-foreground flex items-center gap-1">
                                    Ophtalmology <ArrowRight size={14} />
                                </p>
                            </Link>
                        </div>
                    </section>

                    {/* New Arrivals Section */}
                    <section className="py-16 border-t border-border" id="new-arrivals">
                        <div className="flex flex-col items-center justify-center mb-10 text-center">
                            <div className="flex items-center gap-2 mb-2 justify-center">
                                <span className="h-px w-8 bg-accent"></span>
                                <span className="text-accent font-medium text-sm uppercase tracking-wider">Freshly Added</span>
                                <span className="h-px w-8 bg-accent"></span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">New Arrivals</h2>
                        </div>
                        <ProductGrid products={products.slice(0, 6)} />

                        <div className="mt-10 flex justify-center">
                            <Button asChild variant="outline" className="border-2 border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-6 text-sm font-medium tracking-wide rounded-lg transition-all">
                                <Link href="/collections/todays-deals">
                                    View all
                                </Link>
                            </Button>
                        </div>
                    </section>

                    {/* Featured Collection Sections */}
                    {displayCollections.map((collection, index) => {
                        // Get products for this collection, limit to 6
                        const collectionProducts = products
                            .filter((p: any) => p.collections.includes(collection.slug))
                            .slice(0, 6)

                        if (collectionProducts.length === 0) return null

                        return (
                            <section key={collection.id} className={`py-16 ${index % 2 === 0 ? 'bg-slate-50/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8' : 'border-t border-border'}`}>
                                <div className="flex flex-col items-center justify-center mb-10 text-center">
                                    <div className="flex items-center gap-2 mb-2 justify-center">
                                        <span className="h-px w-8 bg-primary"></span>
                                        <span className="text-primary font-medium text-sm uppercase tracking-wider">Featured Collection</span>
                                        <span className="h-px w-8 bg-primary"></span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{collection.name}</h2>
                                </div>

                                <ProductGrid products={collectionProducts} />

                                <div className="mt-10 flex justify-center">
                                    <Button asChild variant="outline" className="border-2 border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-6 text-sm font-medium tracking-wide rounded-lg transition-all">
                                        <Link href={`/collections/${collection.slug}`}>
                                            View all
                                        </Link>
                                    </Button>
                                </div>
                            </section>
                        )
                    })}

                    {/* Why Choose Us */}
                    <section className="py-20 border-t border-border mt-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                    Trusted by Veterinary Professionals Worldwide
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    NursLibrary is dedicated to providing the highest quality educational resources for the veterinary and medical community. Our curated library ensures you have access to the latest evidence-based practices and clinical guidelines.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <Download className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Instant Digital Delivery</h3>
                                            <p className="text-muted-foreground">Get immediate access to your eBooks upon purchase. No waiting for shipping.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Globe className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Accessible Anywhere</h3>
                                            <p className="text-muted-foreground">Read on any device - laptop, tablet, or phone. Perfect for busy professionals.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Award className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Premium Quality</h3>
                                            <p className="text-muted-foreground">High-resolution PDFs with searchable text and clear illustrations.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/nurse-hero-banner.png"
                                    alt="Veterinary professional using tablet"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-sm">
                                        <div className="flex gap-1 text-yellow-500 mb-2">
                                            {"★".repeat(5)}
                                        </div>
                                        <p className="text-foreground font-medium italic mb-4">
                                            "An incredible resource for my veterinary studies. The quality of the eBooks is outstanding and the instant download is a lifesaver."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                                {/* Avatar placeholder */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-primary text-white font-bold">SJ</div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">Sarah Jenkins</p>
                                                <p className="text-xs text-muted-foreground">Veterinary Student</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Explore our flexible eBook solutions */}
                    <section className="py-24 bg-white border-t border-border overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl md:order-1">
                                <Image
                                    src="/ebook-formats.png"
                                    alt="Veterinarian using ultrasound with dog"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center md:order-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="h-px w-12 bg-primary"></span>
                                    <span className="text-primary font-bold text-sm uppercase tracking-widest">eBook formats</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                    Explore our flexible eBook solutions
                                </h2>
                                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                                    One purchase unlocks all eBook formats: EPUB, EPUB3, and PDF. Download instantly, no activation needed. Read on any device – phone, computer, or Kindle – with full search, copy, paste, and print functionality. Your personal watermark ensures secure access.
                                </p>
                                <div>
                                    <Button asChild variant="outline" className="border-2 border-slate-300 hover:bg-slate-50 text-slate-700 px-10 py-7 text-base font-medium tracking-wide rounded-lg transition-all">
                                        <Link href="/collections">
                                            Browse E-books
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-16 mb-12 border-t border-border">
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
