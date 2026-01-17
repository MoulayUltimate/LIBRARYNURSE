import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy - LibraryNurse",
  description: "Our privacy policy explaining how we collect and protect your data.",
}

export default function PrivacyPolicy() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>

            <p className="text-lg text-foreground/80 mb-6">
              <strong>Last Updated: January 2026</strong>
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Introduction</h2>
              <p className="text-foreground/80 mb-4">
                LibraryNurse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website and
                purchase our digital medical eBooks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Information We Collect</h2>
              <p className="text-foreground/80 mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site
                includes:
              </p>
              <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                <li>
                  <strong>Personal Data:</strong> Name, email address, phone number, billing address, and payment
                  information when you make a purchase.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, operating system, pages visited, and time
                  spent on pages.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you interact with our website and products.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-foreground/80 mb-4">We use the information we collect in the following ways:</p>
              <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                <li>To process your transactions and send you related information.</li>
                <li>To deliver purchased eBooks and provide customer support.</li>
                <li>To send transactional and promotional emails (with your consent).</li>
                <li>To improve our website and services based on your feedback.</li>
                <li>To comply with legal obligations and protect our rights.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Data Security</h2>
              <p className="text-foreground/80 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
                Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Third-Party Sharing</h2>
              <p className="text-foreground/80 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information with
                service providers who assist us in operating our website and conducting our business, under strict
                confidentiality agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">6. Cookies</h2>
              <p className="text-foreground/80 mb-4">
                Our website uses cookies to enhance your experience. You can choose to disable cookies through your
                browser settings, but this may limit your access to certain features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">7. Your Rights</h2>
              <p className="text-foreground/80 mb-4">
                Depending on your location, you may have the right to access, correct, or delete your personal data. To
                exercise these rights, please contact us at contact@librarynurse.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">8. Contact Us</h2>
              <p className="text-foreground/80">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                <strong>Email:</strong> contact@librarynurse.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
