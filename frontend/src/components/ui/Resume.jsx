import { useRef } from "react";
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope, FaGlobe, FaDownload } from "react-icons/fa";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);

  const handleDownloadPdf = async () => {
    try {
      const element = resumeRef.current;
      const canvas = await toPng(element, { 
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;
      
      pdf.addImage(canvas, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${data.personalInformation.fullName}_Resume.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-4xl mx-auto"
    >
      <div
        ref={resumeRef}
        className="bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {data.personalInformation.fullName}
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {data.personalInformation.location}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {data.personalInformation.email && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FaEnvelope />
                  <span>{data.personalInformation.email}</span>
                </div>
              )}
              {data.personalInformation.phoneNumber && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FaPhone />
                  <span>{data.personalInformation.phoneNumber}</span>
                </div>
              )}
              {data.personalInformation.gitHub && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FaGithub />
                  <span>GitHub</span>
                </div>
              )}
              {data.personalInformation.linkedIn && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </div>
              )}
              {data.personalInformation.portfolio && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FaGlobe />
                  <span>Portfolio</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="p-8 space-y-8">
          {/* Summary Section */}
          {data.summary && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3 rounded"></div>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </motion.section>
          )}

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-green-600 mr-3 rounded"></div>
                Technical Skills
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-800">{skill.title}</span>
                    <span className="text-sm text-gray-600 ml-2">({skill.level})</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Experience Section */}
          {data.experience.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-purple-600 mr-3 rounded"></div>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-6 pb-6">
                    <h3 className="text-xl font-bold text-gray-800">{exp.jobTitle}</h3>
                    <p className="text-blue-600 font-medium">{exp.company} • {exp.location}</p>
                    <p className="text-gray-500 text-sm mb-2">{exp.duration}</p>
                    <p className="text-gray-700 leading-relaxed">{exp.responsibility}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-indigo-600 mr-3 rounded"></div>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.university}, {edu.location}</p>
                    <p className="text-gray-500 text-sm">Graduated: {edu.graduationYear}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Projects Section */}
          {data.projects.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-orange-600 mr-3 rounded"></div>
                Key Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">{proj.title}</h3>
                    <p className="text-gray-700 mt-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {proj.technologiesUsed.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Additional Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Certifications */}
            {data.certifications.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <div className="w-1 h-5 bg-red-600 mr-3 rounded"></div>
                  Certifications
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-800">{cert.title}</h4>
                      <p className="text-gray-600 text-sm">{cert.issuingOrganization} • {cert.year}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <div className="w-1 h-5 bg-teal-600 mr-3 rounded"></div>
                  Languages
                </h2>
                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="text-gray-700">{lang.name}</div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center mt-6"
      >
        <button
          onClick={handleDownloadPdf}
          className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FaDownload />
          Download PDF
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Resume;