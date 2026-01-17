export const metadata = {
  title: "Terms of Service - LibraryNurse",
  description: "The terms and conditions for using LibraryNurse and purchasing our nursing eBooks.",
}

import { Footer } from "@/components/footer"

export default function TermsOfService() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>

            <p className="text-lg text-foreground/80 mb-6">
              <strong>Last Updated: January 2026</strong>
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Agreement to Terms</h2>
              <p className="text-foreground/80 mb-4">
                By accessing and using LibraryNurse ("Website"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Use License</h2>
              <p className="text-foreground/80 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                LibraryNurse for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the Website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. Disclaimer</h2>
              <p className="text-foreground/80 mb-4">
                The materials on LibraryNurse are provided on an 'as is' basis. LibraryNurse makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Limitations</h2>
              <p className="text-foreground/80 mb-4">
                In no event shall LibraryNurse or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out of the use
                or inability to use the materials on LibraryNurse, even if LibraryNurse or an authorized representative
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Accuracy of Materials</h2>
              <p className="text-foreground/80 mb-4">
                The materials appearing on LibraryNurse could include technical, typographical, or photographic errors.
                LibraryNurse does not warrant that any of the materials on our website are accurate, complete, or
                current. LibraryNurse may make changes to the materials contained on our website at any time without
                notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">6. Links</h2>
              <p className="text-foreground/80 mb-4">
                LibraryNurse has not reviewed all of the sites linked to its website and is not responsible for the
                contents of any such linked site. The inclusion of any link does not imply endorsement by LibraryNurse
                of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">7. Modifications</h2>
              <p className="text-foreground/80 mb-4">
                LibraryNurse may revise these terms of service for our website at any time without notice. By using this
                website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">8. Governing Law</h2>
              <p className="text-foreground/80">
                These terms and conditions are governed by and construed in accordance with the laws of the United
                States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
