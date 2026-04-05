"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { ShoppingBag, UserPlus, ArrowRight } from "lucide-react";

import { signUpSchema } from "@/lib/validations/auth.validation";
import { useSignUp } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

export default function SignUpPage() {
  const signUpMutation = useSignUp();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      signUpMutation.mutate(values);
    },
  });

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-accent via-[#00b8b3] to-[#009e9a]">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Shopping Hub</span>
          </div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold leading-tight"
            >
              Start your shopping
              <br />
              journey today
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-white/70 max-w-md"
            >
              Create an account to unlock personalised recommendations, order tracking, and exclusive member deals.
            </motion.p>
          </div>

          <p className="text-sm text-white/40">© 2026 Shopping Hub. All rights reserved.</p>
        </div>
      </div>

      {/* Right — Sign Up Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">Shopping Hub</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark">Create your account</h2>
            <p className="mt-2 text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Sign in
                <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            <FormField
              label="Full name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formik.values.name}
              error={formik.errors.name}
              touched={formik.touched.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <FormField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formik.values.email}
              error={formik.errors.email}
              touched={formik.touched.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              error={formik.errors.password}
              touched={formik.touched.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <FormField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={signUpMutation.isPending}
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By creating an account, you agree to our{" "}
            <span className="text-gray-500">Terms of Service</span> and{" "}
            <span className="text-gray-500">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
