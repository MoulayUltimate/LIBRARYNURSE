import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About LibraryNurse</h1>
          <p className="text-lg text-muted-foreground">
            Providing quality medical education resources for healthcare professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
            <p className="text-foreground">
              To make high-quality medical education accessible to healthcare professionals worldwide. We partner with
              leading experts to create comprehensive, evidence-based resources that advance clinical knowledge and
              practice.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">Expert Authors</h2>
            <p className="text-foreground">
              Our eBooks are written by experienced clinicians and researchers with deep expertise in their fields. Each
              publication undergoes rigorous review to ensure accuracy and clinical relevance.
            </p>
          </Card>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose LibraryNurse?</h2>
          <ul className="space-y-4 text-foreground">
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Evidence-based content from leading medical professionals</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Comprehensive coverage of clinical topics</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>PDF format for offline access and easy reference</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Regular updates with latest clinical guidelines</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Secure instant delivery of your purchases</span>
            </li>
          </ul>
        </Card>
      </main>
      <Footer />
    </>
  )
}
