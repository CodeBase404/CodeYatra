import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Mail,
  Shield,
  Calendar,
  Edit3,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  ShieldAlert,
} from "lucide-react";
import Modal from "./Modal";
import ProfileUpload from "./ProfileUpload";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";
import {
  deleteAccount,
  fetchUserProfile,
  logoutUser,
} from "../../features/auth/authThunks";
import AccountVerification from "./AccountVerification";
import { setShowCreateModal } from "../../features/ui/uiSlice";
import DeleteMyAccount from "./DeleteMyAccount";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showCreateModal } = useSelector((state) => state.ui);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      gender: user?.gender,
      age: user?.age,
      location: user?.location,
      birthday: user?.birthday?.substring(0, 10), // format for input[type=date]
      summary: user?.summary,
      github: user?.github,
      linkedin: user?.linkedin,
      role: user?.role,
      skills: user?.skills || [],
      experience: user?.experience || [],
      education: user?.education || [],
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    control,
    watch,
  } = useForm();
  const {
    fields: experienceFields,
    append: addExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });
  const {
    fields: eduFields,
    append: addEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const newPassword = watch("newPassword");

  const onProfileSubmit = async (data) => {
    try {
      const res = await axiosClient.put("/user/update-profile", {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        age: data.age,
        location: data.location,
        birthday: data.birthday,
        summary: data.summary,
        skills: data.skills.split(",").map((s) => s.trim()),
        github: data.github,
        linkedin: data.linkedin,
        role: data.role,
      });
      dispatch(fetchUserProfile());
      alert(res.data.message || "Profile updated successfully");
      setIsEditing(false);
      resetProfile(data);
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const response = await axiosClient.post("/user/update-password", {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      alert(response.data.message || "Password updated successfully");
      setIsChangingPassword(false);
      resetPassword();
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      alert(msg);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile();
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-[100vh] w-full bg-gradient-to-br from-blue-50 dark:from-neutral to-indigo-100 dark:to-neutral p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 dark:from-gray-900 to-indigo-600 dark:to-gray-900 px-8 py-6">
          <div className="flex items-center space-x-4">
            <ProfileUpload profilePic={user?.profileImage?.secureUrl} />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName}
              </h1>
              <p className="text-blue-100 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user?.role}</span>
                {user?.isAccountVerified ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => dispatch(setShowCreateModal(true))}
                    className="btn btn-error h-8 animate-pulse text-white px-2 py-1 rounded-full text-xs font-medium"
                  >
                    <ShieldAlert className="h-5 w-5" /> Pending Verification
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-neutral">
          {/* Profile Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      {...registerProfile("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your first name"
                    />
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      {...registerProfile("lastName")}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Enter your last name"
                    />
                  </div>
                  {user?.role === "admin" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        {...registerProfile("role", {
                          required: "Role is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                      {profileErrors.role && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.role.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      {...registerProfile("gender")}
                      className="w-full px-4 py-3 border rounded-lg"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      {...registerProfile("age")}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      {...registerProfile("location")}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Enter your location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthday
                    </label>
                    <input
                      type="date"
                      {...registerProfile("birthday")}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Summary
                    </label>
                    <textarea
                      {...registerProfile("summary")}
                      className="w-full px-4 py-3 border rounded-lg"
                      rows={4}
                      placeholder="Write a short summary about yourself"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills (comma-separated)
                    </label>
                    <input
                      {...registerProfile("skills")}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="e.g. JavaScript, React, MongoDB"
                    />
                  </div>

                  <div>
                    <h3 className="text-md font-semibold">Experience</h3>
                    {experienceFields.map((exp, index) => (
                      <div key={exp.id} className="border p-4 rounded-lg mb-4">
                        <input
                          {...registerProfile(`experience.${index}.company`)}
                          className="w-full mb-2 p-2 border"
                          placeholder="Company"
                        />
                        <input
                          {...registerProfile(`experience.${index}.position`)}
                          className="w-full mb-2 p-2 border"
                          placeholder="Position"
                        />
                        <input
                          type="date"
                          {...registerProfile(`experience.${index}.startDate`)}
                          className="w-full mb-2 p-2 border"
                        />
                        <input
                          type="date"
                          {...registerProfile(`experience.${index}.endDate`)}
                          className="w-full mb-2 p-2 border"
                        />
                        <textarea
                          {...registerProfile(
                            `experience.${index}.description`
                          )}
                          className="w-full p-2 border"
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={() => removeExp(index)}
                          className="text-red-500 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addExp({})}
                      className="btn btn-sm mt-2"
                    >
                      + Add Experience
                    </button>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold">Education</h3>
                    {eduFields.map((edu, index) => (
                      <div key={edu.id} className="border p-4 rounded-lg mb-4">
                        <input
                          {...registerProfile(`education.${index}.school`)}
                          className="w-full mb-2 p-2 border"
                          placeholder="School"
                        />
                        <input
                          {...registerProfile(`education.${index}.degree`)}
                          className="w-full mb-2 p-2 border"
                          placeholder="Degree"
                        />
                        <input
                          {...registerProfile(
                            `education.${index}.fieldOfStudy`
                          )}
                          className="w-full mb-2 p-2 border"
                          placeholder="Field of Study"
                        />
                        <input
                          type="date"
                          {...registerProfile(`education.${index}.startDate`)}
                          className="w-full mb-2 p-2 border"
                        />
                        <input
                          type="date"
                          {...registerProfile(`education.${index}.endDate`)}
                          className="w-full mb-2 p-2 border"
                        />
                        <textarea
                          {...registerProfile(`education.${index}.description`)}
                          className="w-full p-2 border"
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={() => removeEdu(index)}
                          className="text-red-500 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addEdu({})}
                      className="btn btn-sm mt-2"
                    >
                      + Add Education
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      {...registerProfile("github")}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      {...registerProfile("linkedin")}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    First Name
                  </label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {user?.firstName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">Last Name</label>
                  <p className="text-lg text-gray-800">
                    {user?.lastName || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {user?.emailId || user?.email}
                    </p>
                    <span className="text-xs text-gray-500">(Immutable)</span>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <div className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Role
                    </label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                      {user?.role}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="text-lg text-gray-800 capitalize">
                    {user?.gender || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">Age</label>
                  <p className="text-lg text-gray-800">{user?.age || "—"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="text-lg text-gray-800">
                    {user?.location || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">Birthday</label>
                  <p className="text-lg text-gray-800">
                    {user?.birthday ? formatDate(user.birthday) : "—"}
                  </p>
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">Summary</label>
                  <p className="text-lg text-gray-800">
                    {user?.summary || "—"}
                  </p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Skills</h2>
                  <ul className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, idx) => (
                      <li
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  {user?.experience?.map((exp, idx) => (
                    <div key={idx} className="mt-2 border-b pb-2">
                      <p className="font-medium">
                        {exp.position} @ {exp.company}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </p>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Education</h3>
                  {user?.education?.map((edu, idx) => (
                    <div key={idx} className="mt-2 border-b pb-2">
                      <p className="font-medium">
                        {edu.degree} in {edu.fieldOfStudy}
                      </p>
                      <p className="text-sm text-gray-500">{edu.school}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                      <p>{edu.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">GitHub</label>
                  <a
                    href={user?.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user?.github || "—"}
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500">LinkedIn</label>
                  <a
                    href={user?.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user?.linkedin || "—"}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Account Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50  dark:bg-white/5 border border-white/10  p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Account Created
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50  dark:bg-white/5 border border-white/10  p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formatDate(user?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Password & Security
              </h2>
              <div className="flex items-center gap-3">
                  <NavLink to="/forgot-password"
                  className=" cursor-pointer font-semibold text-[16px] btn btn-dash btn-primary"
                >
                  Forgot password?
                </NavLink>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 btn btn-dash btn-error hover:text-white dark:text-white rounded-lg transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              )}
              </div>
            </div>

            {isChangingPassword ? (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6 w-[50%] mx-auto"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                        type={showCurrentPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message:
                              "Password must contain at least one uppercase, lowercase, number, and special character",
                          },
                        })}
                        type={showNewPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your new password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50  dark:bg-white/5 border border-white/10  p-4 rounded-lg">
                <p className="text-gray-600 dark:text-white/80">
                  Your password is securely encrypted. Click "Change Password"
                  to update your password.
                </p>
              </div>
            )}
          </div>
          <DeleteMyAccount
            onDeleteAccount={() => dispatch(deleteAccount())}
            onLogout={() => dispatch(logoutUser())}
            onNavigate={navigate}
          />
        </div>
      </div>
      <Modal
        isOpen={!!showCreateModal}
        onClose={() => dispatch(setShowCreateModal(false))}
        title="Account Verification"
        size="xl"
      >
        {showCreateModal && (
          <AccountVerification
            userEmail={user?.email || user?.emailId}
            verificationOtpSend={true}
            onVerificationSuccess={() => {
              dispatch(setShowCreateModal(false));
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Profile;
