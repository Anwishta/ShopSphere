import { React, useEffect, useState } from "react";
import { IoStatsChartOutline } from "react-icons/io5";
import { IoPeople } from "react-icons/io5";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { GoRepoForked } from "react-icons/go";
import { FaPeopleLine } from "react-icons/fa6";
import { PiUserCircleDashedFill } from "react-icons/pi";
import Scrollbtn from "../../components/scrollbtn";
import CertificateGenerator from "./CertificateGenerator";
import { XCircle } from "lucide-react";


function Contributors() {
  const [allcontributors, setAllContributors] = useState([]);
  const [repoData, setRepoData] = useState({});
  const [totalContributions, setTotalContributions] = useState(null);
  const [selectedContributor, setSelectedContributor] = useState(null);


  useEffect(() => {
    const fetchContributors = async () => {
      const owner = "Anwishta";
      const repo = "ShopSphere";
      const page = 1;
      const perPage = 100;

      const url = `https://api.github.com/repos/${owner}/${repo}/contributors?page=${page}&per_page=${perPage}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const contributors = await response.json();
          const totalContributionsData = contributors.reduce(
            (acc, contributor) => acc + contributor.contributions,
            0
          );
          setTotalContributions(totalContributionsData);
          setAllContributors(contributors);
        } else {
          console.error("Failed to fetch contributors");
        }

        const repoResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );
        const repoData = await repoResponse.json();
        setRepoData(repoData);
      } catch (error) {
        console.error("Error fetching contributors: ", error);
      }
    };

    fetchContributors();
  }, []);

  const handleAddCertificate = (contributor) => {
    setSelectedContributor(contributor);
  };

  return (
    <>
      <Scrollbtn />
      <div className="min-h-screen bg-white dark:bg-[#0d1321] overflow-hidden">
        <div className="outer-container mt-5 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-3xl flex gap-2 sm:text-4xl text-center font-bold text-violet-500 dark:text-violet-400">
            Project Statistics <IoStatsChartOutline className="text-gray-600 dark:text-white/40 text-4xl" />
          </h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-5 mt-5 sm:mt-10">
            {[
              {
                icon: <IoPeople className="text-6xl sm:text-8xl" />,
                label: "Contributors",
                value: allcontributors.length,
              },
              {
                icon: <FaArrowsRotate className="text-6xl sm:text-8xl" />,
                label: "Contributions",
                value: totalContributions,
              },
              {
                icon: <FaStar className="text-6xl sm:text-8xl" />,
                label: "Github Stars",
                value: repoData.stargazers_count,
              },
              {
                icon: <GoRepoForked className="text-6xl sm:text-8xl" />,
                label: "Forks",
                value: repoData.forks_count,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-4 rounded-xl bg-gray-200 dark:bg-[#1b2743] gap-2 shadow-lg transition-transform duration-300 hover:scale-105"
              >

                <img
                  src={contributor.avatar_url}
                  alt="avatar"
                  className="w-36 h-36 rounded-full object-cover border-2 border-emerald-400 shadow-md hover:border-emerald-300 transition-colors duration-300"
                />
                <div className="flex flex-col gap-2 w-full">
                  <div className="info flex items-center gap-1 text-white overflow-hidden">
                    <PiUserCircleDashedFill className="text-3xl" />
                    <span className="font-semibold text-2xl text-cyan-200 break-words">
                      {contributor.login}
                    </span>
                  </div>
                  <div className="stats flex justify-center items-center gap-4 w-full">
                    <span className="text-slate-300 truncate">
                      {contributor.contributions} Contributions
                    </span>
                    <button
                      onClick={() => window.open(contributor.html_url, "_blank")}
                      className="bg-violet-700 py-1 px-3 rounded-sm max-w-xs truncate shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      View Profile
                    </button>
                  </div>
                  <div className="stats flex justify-center items-center gap-4 w-full">
                    {/* Certificate Button */} 
                    <button
                      className="mt-4 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold py-2 px-4 rounded-lg shadow-md 
                      transition-all duration-200"
                     onClick={() => handleAddCertificate(contributor)}
                    >
                     Certificate
                    </button>
                  </div>

                {stat.icon}
                <div className="flex flex-col gap-2">
                  <span className="text-xl sm:text-2xl text-gray-800 dark:text-slate-300">
                    {stat.value}
                  </span>
                  <span className="text-sm sm:text-xl text-gray-600 dark:text-slate-400">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="All-Contributors mt-16 w-full flex flex-col justify-center items-center mb-10">
            <h1 className="text-3xl flex gap-0 sm:gap-2 sm:text-5xl font-bold text-violet-600 dark:text-violet-500 items-center">
              Meet our Contributors{" "}
              <FaPeopleLine className="hidden text-gray-600 dark:text-white/40 text-6xl sm:block" />
            </h1>

            <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5 lg:ml-14 px-4 sm:px-8">
              {allcontributors.map((contributor) => (
                <div
                  key={contributor.id}
                  className="card bg-gray-100 dark:bg-white/5 flex flex-col justify-center items-center rounded-xl gap-6 w-full max-w-xs mx-auto p-4 shadow-xl transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={contributor.avatar_url}
                    alt="avatar"
                    className="w-36 h-36 rounded-full object-cover border-2 border-emerald-500 dark:border-emerald-400 shadow-md hover:border-emerald-400 transition-colors duration-300"
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="info flex items-center gap-1 text-gray-900 dark:text-white overflow-hidden">
                      <PiUserCircleDashedFill className="text-3xl" />
                      <span className="font-semibold text-2xl text-cyan-600 dark:text-cyan-200 break-words">
                        {contributor.login}
                      </span>
                    </div>
                    <div className="stats flex justify-center items-center gap-4 w-full">
                      <span className="text-gray-700 dark:text-slate-300 truncate">
                        {contributor.contributions} Contributions
                      </span>
                      <button
                        onClick={() =>
                          window.open(contributor.html_url, "_blank")
                        }
                        className="bg-violet-600 dark:bg-violet-700 py-1 px-3 rounded-sm max-w-xs truncate shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Generator Modal */}
      {selectedContributor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-lg w-full text-center relative">
            {/* Close Button */}
            <button className="absolute top-3 right-3 text-red-500 dark:text-red-400 hover:text-gray-800 dark:hover:text-red-300 transition-all" onClick={() => setSelectedContributor(null)}>
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-yellow-400">
              Certificate for {selectedContributor.login}
            </h2>
            <CertificateGenerator username={selectedContributor.login} />
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Contributors;
