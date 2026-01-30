"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";

const StudentRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      studentIdYear: "",
      studentIdNumber: "",
      name: "",
      birthdate: "",
      email: "",
      password: "",
      confirmPassword: "",
      college: "",
      department: "",
      course: "",
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate Student ID parts
    if (!data.studentIdYear || data.studentIdYear.length !== 2) {
      toast.error("Year must be 2 digits (e.g., 22 for 2022)");
      return;
    }

    if (!data.studentIdNumber || data.studentIdNumber.length !== 4) {
      toast.error("Student number must be 4 digits");
      return;
    }

    // Construct full Student ID
    const fullStudentId = `TUPM-${data.studentIdYear}-${data.studentIdNumber}`;

    setIsLoading(true);

    try {
      await axios.post("/api/student/register", {
        studentId: fullStudentId,
        name: data.name,
        birthdate: data.birthdate,
        email: data.email,
        password: data.password,
        college: data.college,
        department: data.department,
        course: data.course,
      });

      toast.success("Account created! Please login.");
      router.push("/student/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const colleges = [
    "Science",
    "Fine Arts",
    "Liberal Arts",
    "Engineering",
    "Technology",
    "Industrial Education",
    "Industrial Technology",
  ];

  // Watch the Student ID fields to show preview
  const studentIdYear = watch("studentIdYear");
  const studentIdNumber = watch("studentIdNumber");
  const studentIdPreview = `TUPM-${studentIdYear || "YY"}-${studentIdNumber || "XXXX"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your student account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student ID - Split into parts */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {/* TUPM Prefix */}
                <div className="flex-shrink-0">
                  <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium">
                    TUPM-
                  </div>
                </div>

                {/* Year Input */}
                <div className="w-20">
                  <input
                    type="text"
                    maxLength={2}
                    {...register("studentIdYear", {
                      required: "Year is required",
                      pattern: {
                        value: /^[0-9]{2}$/,
                        message: "Must be 2 digits",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="22"
                    disabled={isLoading}
                  />
                </div>

                {/* Separator */}
                <div className="flex-shrink-0 text-gray-500 font-bold">-</div>

                {/* Unique Number Input */}
                <div className="w-28">
                  <input
                    type="text"
                    maxLength={4}
                    {...register("studentIdNumber", {
                      required: "Number is required",
                      pattern: {
                        value: /^[0-9]{4}$/,
                        message: "Must be 4 digits",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="1234"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-2 text-sm text-gray-600">
                Preview: <span className="font-semibold text-red-600">{studentIdPreview}</span>
              </div>

              {/* Errors */}
              {(errors.studentIdYear || errors.studentIdNumber) && (
                <p className="mt-1 text-sm text-red-600">
                  {(errors.studentIdYear?.message || errors.studentIdNumber?.message) as string}
                </p>
              )}

              {/* Helper Text */}
              <p className="mt-1 text-xs text-gray-500">
                Format: TUPM-YY-XXXX (e.g., TUPM-22-1234 for enrollment year 2022)
              </p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Juan Dela Cruz"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
              )}
            </div>

            {/* Birthdate */}
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Birthdate <span className="text-red-500">*</span>
              </label>
              <input
                id="birthdate"
                type="date"
                {...register("birthdate", { required: "Birthdate is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              />
              {errors.birthdate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthdate.message as string}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="student@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>

            {/* College */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                College <span className="text-red-500">*</span>
              </label>
              <select
                id="college"
                {...register("college", { required: "College is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              {errors.college && (
                <p className="mt-1 text-sm text-red-600">{errors.college.message as string}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                id="department"
                type="text"
                {...register("department", { required: "Department is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Computer Studies"
                disabled={isLoading}
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message as string}</p>
              )}
            </div>

            {/* Course */}
            <div className="md:col-span-2">
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Course <span className="text-red-500">*</span>
              </label>
              <input
                id="course"
                type="text"
                {...register("course", { required: "Course is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Bachelor of Science in Computer Science"
                disabled={isLoading}
              />
              {errors.course && (
                <p className="mt-1 text-sm text-red-600">{errors.course.message as string}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Student Account"}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/student/login" className="font-medium text-red-600 hover:text-red-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegisterForm;