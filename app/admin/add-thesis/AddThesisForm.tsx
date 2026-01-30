"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  code: string;
}

interface AddThesisFormProps {
  categories: Category[];
}

const AddThesisForm: React.FC<AddThesisFormProps> = ({ categories }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      abstract: "",
      authorName: "",
      authorEmail: "",
      studentId: "",
      advisorName: "",
      coAdvisorName: "",
      committeeMembers: "",
      department: "",
      program: "",
      university: "State University",
      degreeLevel: "MASTER",
      categoryId: "",
      keywords: "",
      language: "English",
      submissionDate: "",
      defenseDate: "",
      status: "APPROVED",
      authors: [""],
      // Chapter content fields
      chapter1: "",
      chapter2: "",
      chapter3: "",
      chapter4: "",
      chapter5: "",
      referencesText: "",
      appendices: "",
    },
  });

  const { fields: authorFields, append: appendAuthor, remove: removeAuthor } = useFieldArray({
    control,
    name: "authors",
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      // Process authors array
      const authors = data.authors
        .filter((author: string) => author.trim().length > 0)
        .map((author: string) => author.trim());

      if (authors.length === 0) {
        toast.error("At least one author is required");
        setIsLoading(false);
        return;
      }

      const authorName = authors.join(", ");

      // Process committee members and keywords
      const committeeMembers = data.committeeMembers
        ? data.committeeMembers
            .split(",")
            .map((member: string) => member.trim())
            .filter((member: string) => member.length > 0)
        : [];

      const keywords = data.keywords
        ? data.keywords
            .split(",")
            .map((keyword: string) => keyword.trim())
            .filter((keyword: string) => keyword.length > 0)
        : [];

      const thesisData = {
        title: data.title,
        abstract: data.abstract,
        authorName,
        authorEmail: data.authorEmail,
        studentId: data.studentId,
        advisorName: data.advisorName,
        coAdvisorName: data.coAdvisorName,
        committeeMembers,
        department: data.department,
        program: data.program,
        university: data.university,
        degreeLevel: data.degreeLevel,
        categoryId: data.categoryId,
        keywords,
        language: data.language,
        submissionDate: new Date(data.submissionDate).toISOString(),
        defenseDate: data.defenseDate ? new Date(data.defenseDate).toISOString() : null,
        status: data.status,
        // Include chapter content
        chapter1: data.chapter1,
        chapter2: data.chapter2,
        chapter3: data.chapter3,
        chapter4: data.chapter4,
        chapter5: data.chapter5,
        references: data.referencesText,
        appendices: data.appendices,
      };

      // Submit to API
      const response = await fetch("/api/admin/thesis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thesisData),
      });

      if (response.ok) {
        toast.success("Thesis added successfully!");
        reset();
        router.push("/admin/manage-thesis");
      } else {
        const error = await response.json();
        console.error("API Error:", error);
        toast.error(error.message || error.error || "Failed to add thesis");
      }
    } catch (error) {
      console.error("Error adding thesis:", error);
      toast.error("An error occurred while adding the thesis");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information" },
    { id: "academic", label: "Academic Details" },
    { id: "chapters", label: "Thesis Chapters" },
    { id: "publish", label: "Publish Settings" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        {/* <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Thesis</h2>
          <p className="text-gray-600">Create a new thesis entry with complete academic content</p>
        </div> */}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thesis Title *
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter the complete thesis title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
                )}
              </div>

              {/* Author Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Authors *
                  </label>
                  <button
                    type="button"
                    onClick={() => appendAuthor("")}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    title="Add Author"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {authorFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
                      <input
                        {...register(`authors.${index}`, { 
                          required: index === 0 ? "At least one author is required" : false 
                        })}
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Author full name"
                      />
                      {authorFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAuthor(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Remove Author"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                                  {errors.authors && Array.isArray(errors.authors) && errors.authors[0]?.message && (
                    <p className="text-sm text-red-600 mt-2">
                      {String(errors.authors[0].message)}
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Email
                  </label>
                  <input
                    {...register("authorEmail")}
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="author@university.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    {...register("studentId")}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="TUPM-XX-XXXX"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract *
                </label>
                <textarea
                  {...register("abstract", { required: "Abstract is required" })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter the thesis abstract (summary of the research work)"
                />
                {errors.abstract && (
                  <p className="mt-1 text-sm text-red-600">{errors.abstract.message as string}</p>
                )}
              </div>
            </div>
          )}

          {/* Academic Details Tab */}
          {activeTab === "academic" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Advisor *
                  </label>
                  <input
                    {...register("advisorName", { required: "Advisor name is required" })}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Dr. John Smith"
                  />
                  {errors.advisorName && (
                    <p className="mt-1 text-sm text-red-600">{errors.advisorName.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Co-Advisor
                  </label>
                  <input
                    {...register("coAdvisorName")}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Dr. Jane Doe (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    {...register("department", { required: "Department is required" })}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Computer Studies"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program *
                  </label>
                  <input
                    {...register("program", { required: "Program is required" })}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Bachelor of Science in Computer Science"
                  />
                  {errors.program && (
                    <p className="mt-1 text-sm text-red-600">{errors.program.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University
                  </label>
                  <input
                    {...register("university")}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="State University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree Level *
                  </label>
                  <select
                    {...register("degreeLevel", { required: "Degree level is required" })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="BACHELOR">Bachelor's Degree</option>
                    <option value="MASTER">Master's Degree</option>
                    <option value="DOCTORATE">Doctorate (PhD)</option>
                  </select>
                  {errors.degreeLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.degreeLevel.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register("categoryId", { required: "Category is required" })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.code})
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    {...register("language")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="English">English</option>
                    <option value="Filipino">Filipino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Committee Members
                  </label>
                  <input
                    {...register("committeeMembers")}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Dr. Smith, Dr. Johnson, Dr. Williams"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate names with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    {...register("keywords")}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="machine learning, healthcare, AI"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Date *
                  </label>
                  <input
                    {...register("submissionDate", { required: "Submission date is required" })}
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.submissionDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.submissionDate.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Defense Date
                  </label>
                  <input
                    {...register("defenseDate")}
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Thesis Chapters Tab - NEW */}
          {activeTab === "chapters" && (
            <div className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Thesis Content Guidelines</h4>
                    <p className="text-sm text-blue-800">
                      Enter the full content for each chapter of the thesis. You can paste text or type directly into each field.
                      All chapters are optional but recommended for a complete thesis archive.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapter 1: Introduction */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chapter 1: Introduction
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Background of the study, statement of the problem, objectives, significance, scope and limitations
                </p>
                <textarea
                  {...register("chapter1")}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter Chapter 1 content..."
                />
              </div>

              {/* Chapter 2: Review of Related Literature */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chapter 2: Review of Related Literature
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Theoretical framework, conceptual framework, related studies and literature
                </p>
                <textarea
                  {...register("chapter2")}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter Chapter 2 content..."
                />
              </div>

              {/* Chapter 3: Methodology */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chapter 3: Methodology
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Research design, population and sampling, instrumentation, data gathering procedures, statistical treatment
                </p>
                <textarea
                  {...register("chapter3")}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter Chapter 3 content..."
                />
              </div>

              {/* Chapter 4: Results and Discussion */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chapter 4: Results and Discussion
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Presentation, analysis and interpretation of data
                </p>
                <textarea
                  {...register("chapter4")}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter Chapter 4 content..."
                />
              </div>

              {/* Chapter 5: Summary, Conclusion and Recommendations */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chapter 5: Summary, Conclusion and Recommendations
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Summary of findings, conclusions, recommendations
                </p>
                <textarea
                  {...register("chapter5")}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter Chapter 5 content..."
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  References / Bibliography
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  List all references cited in the thesis (APA, MLA, or other format)
                </p>
                <textarea
                  {...register("referencesText")}
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter references..."
                />
              </div>

              {/* Appendices */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Appendices (Optional)
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Additional materials, questionnaires, raw data, documentation
                </p>
                <textarea
                  {...register("appendices")}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Enter appendices content..."
                />
              </div>
            </div>
          )}

          {/* Publish Settings Tab */}
          {activeTab === "publish" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Publish Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Status *
                </label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="APPROVED">Approved (Published)</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Review Your Thesis</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Title:</strong> {watch("title") || "Not entered"}</p>
                  <p><strong>Authors:</strong> {watch("authors")?.filter((a: string) => a).join(", ") || "Not entered"}</p>
                  <p><strong>Department:</strong> {watch("department") || "Not entered"}</p>
                  <p><strong>Program:</strong> {watch("program") || "Not entered"}</p>
                  <p><strong>Status:</strong> {watch("status")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id);
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {activeTab !== "publish" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id);
                    }
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {activeTab === "publish" && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating Thesis...
                    </div>
                  ) : (
                    "Create Thesis"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddThesisForm;