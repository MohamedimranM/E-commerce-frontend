"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { ShoppingBag, LogIn, ArrowRight } from "lucide-react";

import { signInSchema } from "@/lib/validations/auth.validation";
import { useSignIn } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

export default function SignInPage() {
  const signInMutation = useSignIn();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,
    onSubmit: (values) => {
      signInMutation.mutate(values);
    },
  });

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary via-[#0770c2] to-[#065a9e]">
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
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
              Welcome back to
              <br />
              your favourite store
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-white/70 max-w-md"
            >
              Discover amazing products, exclusive deals, and a seamless shopping experience.
            </motion.p>
          </div>

          <p className="text-sm text-white/40">© 2026 Shopping Hub. All rights reserved.</p>
        </div>
      </div>

      {/* Right — Sign In Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">Shopping Hub</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark">Sign in to your account</h2>
            <p className="mt-2 text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Create one
                <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={signInMutation.isPending}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Secure login
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Your data is protected with industry-standard encryption.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
