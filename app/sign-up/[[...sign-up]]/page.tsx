import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Start Learning Free</h1>
          <p className="mt-2 text-gray-600">
            Create your account to track your progress
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-gray-300",
              formButtonPrimary: "bg-[#1a472a] hover:bg-[#0d2818]",
            }
          }}
        />
      </div>
    </div>
  );
}