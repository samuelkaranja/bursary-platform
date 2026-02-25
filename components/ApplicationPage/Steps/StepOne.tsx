"use client";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerUser } from "@/redux/features/authSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

interface FormValues {
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function StepOne({ nextStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await dispatch(
        registerUser({
          phone: data.phone,
          password: data.password,
        }),
      );

      if (registerUser.fulfilled.match(result)) {
        const message =
          result.payload?.detail || "Account created successfully";
        toast.success(message);

        setTimeout(() => nextStep(), 500);
      } else if (registerUser.rejected.match(result)) {
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : result.error?.message || "Registration failed";

        toast.error(errorMessage);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Create Your Account
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Set up your login credentials to track your application
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="0700 000 000"
            {...register("phone", {
              required: "Phone number is required",
              minLength: {
                value: 10,
                message: "Phone number must be at least 10 digits",
              },
            })}
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-2">{errors.phone.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            This will be your username
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-2">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-10">
          <Link
            href="/"
            className="border border-gray-300 text-black px-6 py-2 rounded-lg"
          >
            Back
          </Link>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`px-6 py-2 rounded-lg text-white transition flex items-center gap-2
              ${
                isValid && !isSubmitting
                  ? "bg-blue-900 hover:bg-blue-800"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? "Registering..." : "Next →"}
          </button>
        </div>
      </form>
    </div>
  );
}
