import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default function PrivacyPolicy() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <a onClick={() => {navigate("/")}} className="cursor-pointer flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">QueryAmie</span>
          </a>
          <a onClick={() => {navigate("/")}}>
            <Button variant="ghost">Back to Home</Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us when you:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact our customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p>This information may include your name, email address, and any other information you choose to provide.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, offers, promotions, and events</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Changes to this Policy</h2>
          <p className="mb-4">We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at: queryamiee@gmail.com</p>
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