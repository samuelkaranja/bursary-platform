"use client";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerUser } from "@/redux/features/authSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: "onChange", // enables real-time validation
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
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Create Your Account
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Set up your login credentials to track your application
      </p>

      {/* Form */}
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
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be more than 6 characters",
              },
            })}
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-2">
              {errors.password.message}
            </p>
          )}
          <span className="text-xs text-gray-500">
            Password should be more than 6 characters
          </span>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
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
