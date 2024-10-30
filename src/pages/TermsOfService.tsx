import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default function TermsOfService() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <a onClick={() => {navigate("/")}} className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">QueryAmie</span>
          </a>
          <a onClick={() => {navigate("/")}}>
            <Button variant="ghost">Back to Home</Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using QueryAmie's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
          <p className="mb-4">You agree to use QueryAmie's services only for lawful purposes and in accordance with these Terms of Service. You are prohibited from:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Using the services in any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the service</li>
            <li>Taking any action that imposes, or may impose, an unreasonable or disproportionately large load on our infrastructure</li>
            <li>Uploading invalid data, viruses, worms, or other software agents through the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">The service and its original content, features, and functionality are and will remain the exclusive property of QueryAmie and its licensors. The service is protected by copyright, trademark, and other laws of both Ghana and foreign countries.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
          <p className="mb-4">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">In no event shall QueryAmie, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="mb-4">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>
      </main>

      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} QueryAmie. All rights reserved.
        </div>
      </footer>
    </div>
  )
}