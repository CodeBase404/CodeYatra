import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaBrain,
  FaTrash,
  FaPaperPlane,
  FaEdit,
  FaRocket,
  FaMagic,
} from "react-icons/fa";
import { BiBook } from "react-icons/bi";
import { useForm, useFieldArray } from "react-hook-form";
import { FaPlusCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Resume from "../components/ui/Resume";
import axiosClient from "../utils/axiosClient";

const GenerateResume = () => {
  const [data, setData] = useState({
    personalInformation: {
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      linkedIn: "",
      gitHub: "",
      portfolio: "",
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
    interests: [],
    achievements: [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  });

  const description = watch("description");

  const [currentStep, setCurrentStep] = useState("input");
  const [loading, setLoading] = useState(false);

  // Field arrays for form
  const experienceFields = useFieldArray({ control, name: "experience" });
  const educationFields = useFieldArray({ control, name: "education" });
  const certificationsFields = useFieldArray({
    control,
    name: "certifications",
  });
  const projectsFields = useFieldArray({ control, name: "projects" });
  const languagesFields = useFieldArray({ control, name: "languages" });
  const interestsFields = useFieldArray({ control, name: "interests" });
  const skillsFields = useFieldArray({ control, name: "skills" });
  const achievementsFields = useFieldArray({ control, name: "achievements" });

  const onSubmit = (formData) => {
    setData(formData);
    setCurrentStep("preview");
    toast.success("Resume updated successfully!", {
      duration: 3000,
      position: "top-center",
    });
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description!");
      return;
    }

    try {
      setLoading(true);
      const responseData = await axiosClient.post("/chat/resume/generate", {
        description,
      });
      console.log("responseData", responseData);

      const jsonString =
        responseData.data.response.candidates[0].content.parts[0].text;
      console.log("jsonString", jsonString);

      const cleanText = jsonString
        .replace(/```json\n?/, "")
        .replace(/```$/, "");
      console.log("cleanText", cleanText);

      const parsedData = JSON.parse(cleanText);
      console.log("parsedData", parsedData);

      reset(parsedData);
      setData(parsedData);
      setCurrentStep("form");
      toast.success("Resume generated successfully!", {
        duration: 3000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error generating resume!");
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    out: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const renderInput = (name, label, type = "text", placeholder = "") => (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text font-medium text-base-content dark:text-white pb-1.5">
          {label}
        </span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="input input-bordered input-info dark:border-none! placeholder:text-gray-400 text-black dark:text-blue-300 w-full bg-base-100 dark:bg-white/20 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
      />
    </div>
  );

  const renderTextarea = (name, label, rows = 3, placeholder = "") => (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text font-medium text-base-content dark:text-white pb-1.5">
          {label}
        </span>
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className="textarea textarea-bordered textarea-info w-full bg-base-100 dark:bg-white/10 placeholder:text-gray-400 dark:border-none! focus:ring-2 focus:ring-primary/20 transition-all duration-200"
      />
    </div>
  );

  const renderFieldArray = (fields, label, name, fieldKeys) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="form-control w-full mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <FaMagic className="text-primary" />
        <h3 className="text-xl font-bold text-base-content dark:text-white">
          {label}
        </h3>
      </div>

      <AnimatePresence>
        {fields.fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`card dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-md p-4 mb-4`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldKeys.map((key) => {
                if (key === "technologiesUsed") {
                  return renderTextarea(
                    `${name}.${index}.${key}`,
                    "Technologies Used (comma-separated)",
                    2,
                    "React, Node.js, MongoDB..."
                  );
                }
                return renderInput(
                  `${name}.${index}.${key}`,
                  key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1"),
                  key.includes("email")
                    ? "email"
                    : key.includes("phone")
                    ? "tel"
                    : key.includes("link") ||
                      key.includes("Link") ||
                      key.includes("hub")
                    ? "url"
                    : "text",
                  getPlaceholder(key)
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => fields.remove(index)}
              className="btn btn-error text-white btn-sm mt-3 gap-2"
            >
              <FaTrash />
              Remove {label.slice(0, -1)}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={() =>
          fields.append(
            fieldKeys.reduce((acc, key) => ({ ...acc, [key]: "" }), {})
          )
        }
        className="btn btn-dash btn-primary btn-outline gap-2"
      >
        <FaPlusCircle />
        Add {label.slice(0, -1)}
      </button>
    </motion.div>
  );

  const getPlaceholder = (key) => {
    const placeholders = {
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedIn: "https://linkedin.com/in/johndoe",
      gitHub: "https://github.com/johndoe",
      portfolio: "https://johndoe.dev",
      jobTitle: "Senior Software Developer",
      company: "Tech Company Inc.",
      duration: "2021 - Present",
      degree: "Bachelor of Computer Science",
      university: "Stanford University",
      graduationYear: "2019",
      title: "Project/Certification Title",
      name: "English (Native)",
      level: "Expert",
    };
    return placeholders[key] || "";
  };

  const InputStep = () => (
    <motion.div
      key="input"
      initial="initial"
      animate="in"
      exit="out"
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="card w-full max-w-2xl bg-base-100 dark:bg-purple-500/20 shadow-2xl">
        <div className="card-body text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 border border-white/10">
              <FaBrain className="text-4xl text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">
              AI Resume Generator
            </h1>
            <p className="text-lg opacity-70 dark:text-white">
              Tell us about yourself and let AI create your professional resume
            </p>
          </div>

          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            disabled={loading}
            className="textarea textarea-bordered textarea-success bg-white dark:bg-purple-500/50 w-full h-48 mb-6 resize-none text-base dark:text-white"
            placeholder="I am a software developer with 5 years of experience in React and Node.js. I have worked at several startups and built e-commerce platforms. I have a degree in Computer Science from Stanford University..."
            autoFocus
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              disabled={loading}
              onClick={handleGenerate}
              className="btn btn-primary btn-lg gap-2 min-w-48"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : (
                <>
                  <FaMagic />
                  Generate Resume
                </>
              )}
            </button>

            <button
              onClick={() => reset({ description: "" })}
              className="btn btn-ghost btn-lg border-black/20 dark:border-white/20 dark:hover:text-black dark:text-white gap-2"
              disabled={loading}
            >
              <FaTrash />
              Clear
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const FormStep = () => (
    <motion.div
      key="form"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="relative z-50 min-h-screen p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-secondary/10 dark:bg-white/10 rounded-full mb-4">
            <BiBook className="text-4xl text-secondary dark:text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2 dark:text-green-500">Review & Edit Your Resume</h1>
          <p className="text-lg opacity-70 dark:text-gray-300">
            Fine-tune the generated information before creating your final
            resume
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="card bg-base-100 dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-lg">
            <div className="card-body">
              <h2 className="card-title dark:text-white text-2xl mb-4 flex items-center gap-2">
                <FaMagic className="text-primary" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "personalInformation.fullName",
                  "Full Name",
                  "text",
                  "John Doe"
                )}
                {renderInput(
                  "personalInformation.email",
                  "Email",
                  "email",
                  "john@example.com"
                )}
                {renderInput(
                  "personalInformation.phoneNumber",
                  "Phone",
                  "tel",
                  "+1 (555) 123-4567"
                )}
                {renderInput(
                  "personalInformation.location",
                  "Location",
                  "text",
                  "San Francisco, CA"
                )}
                {renderInput(
                  "personalInformation.linkedIn",
                  "LinkedIn",
                  "url",
                  "https://linkedin.com/in/johndoe"
                )}
                {renderInput(
                  "personalInformation.gitHub",
                  "GitHub",
                  "url",
                  "https://github.com/johndoe"
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="card bg-base-100 dark:bg-white/15 border border-black/10 dark:border-white/10  shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl text-black dark:text-white mb-4 flex items-center gap-2">
                <FaMagic className="text-primary" />
                Professional Summary
              </h2>
              {renderTextarea(
                "summary",
                "Summary",
                4,
                "Brief overview of your professional background and goals..."
              )}
            </div>
          </div>

          {/* Dynamic Sections */}
          <div className="space-y-6">
            {renderFieldArray(skillsFields, "Skills", "skills", [
              "title",
              "level",
            ])}
            {renderFieldArray(experienceFields, "Experience", "experience", [
              "jobTitle",
              "company",
              "location",
              "duration",
              "responsibility",
            ])}
            {renderFieldArray(educationFields, "Education", "education", [
              "degree",
              "university",
              "location",
              "graduationYear",
            ])}
            {renderFieldArray(
              certificationsFields,
              "Certifications",
              "certifications",
              ["title", "issuingOrganization", "year"]
            )}
            {renderFieldArray(projectsFields, "Projects", "projects", [
              "title",
              "description",
              "technologiesUsed",
              "githubLink",
            ])}
            {renderFieldArray(
              achievementsFields,
              "Achievements",
              "achievements",
              ["title", "year", "extraInformation"]
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {renderFieldArray(languagesFields, "Languages", "languages", [
                "name",
              ])}
              {renderFieldArray(interestsFields, "Interests", "interests", [
                "name",
              ])}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep("input")}
              className="btn btn-ghost border border-black/20 dark:border-white/20  dark:text-white dark:hover:text-black btn-lg gap-2"
            >
              <FaTrash />
              Start Over
            </button>
            <button
              type="submit"
              className="btn btn-soft btn-primary btn-lg gap-2 min-w-48"
            >
              <FaRocket />
              Generate Resume
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );

  const PreviewStep = () => (
    <motion.div
      key="preview"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen p-4 relative z-50"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 dark:text-yellow-500">Your Professional Resume</h1>
        <p className="text-lg opacity-70 dark:text-gray-300">
          Here's your beautifully crafted resume ready for download
        </p>
      </div>

      <Resume data={data} />

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setCurrentStep("input")}
          className="btn btn-ghost btn-lg border border-black/10 dark:border-white/30 dark:text-white dark:hover:text-black gap-2"
        >
          <FaMagic />
          Generate New
        </button>
        <button
          onClick={() => setCurrentStep("form")}
          className="btn btn-soft btn-secondary btn-lg gap-2"
        >
          <FaEdit />
          Edit Resume
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen pt-15">
      <div className="absolute overflow-hidden h-full w-full hidden dark:block dark:bg-black">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--fallback-b1,oklch(var(--b1)))",
            color: "var(--fallback-bc,oklch(var(--bc)))",
          },
        }}
      />

      <AnimatePresence mode="wait">
        {currentStep === "input" && <InputStep />}
        {currentStep === "form" && <FormStep />}
        {currentStep === "preview" && <PreviewStep />}
      </AnimatePresence>
    </div>
  );
};

export default GenerateResume;
