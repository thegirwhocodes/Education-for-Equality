import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Start Learning Free</h1>
          <p className="mt-2 text-gray-600">
            Create your account to track your progress
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-lg w-full max-w-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-gray-300 py-3 text-base",
              formButtonPrimary: "bg-[var(--primary-darker)] hover:bg-[#0d2818] py-3 text-base",
              formFieldInput: "py-3 text-base",
              footerAction: "text-base",
            }
          }}
        />
      </div>
    </div>
  );
}