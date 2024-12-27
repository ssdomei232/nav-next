"use client";

import { useState, useEffect } from "react";
import RandomSeed from "@/components/tools/hash-random/RandomSeed";
import ParticipantList from "@/components/tools/hash-random/ParticipantList";
import ResultDisplay from "@/components/tools/hash-random/ResultDisplay";
import HashTable from "@/components/tools/hash-random/HashTable";
import CoreAlgorithm from "@/components/tools/hash-random/CoreAlgorithm";
import { useHashCalculation } from "@/hooks/useHashCalculation";
import DarkModeToggle from "@/components/tools/hash-random/DarkModeToggle";
import SaveLoadSelection from "@/components/tools/hash-random/SaveLoadSelection";
import Footer from "@/components/tools/hash-random/Footer";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [salt, setSalt] = useState("");
  const [count, setCount] = useState(1);
  const [participants, setParticipants] = useState<string[]>([]);
  const { sortedResults, saltHash, isCalculating } = useHashCalculation(
    salt,
    participants,
    count
  );
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-indigo-800 dark:text-indigo-200">
            哈希随机抽取
          </h1>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
        <div className="flex justify-center space-x-4 mb-12">
          <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            事前不可知
          </span>
          <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            事后可复现
          </span>
          <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            高度随机化
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <RandomSeed
              salt={salt}
              setSalt={setSalt}
              count={count}
              setCount={setCount}
            />
            <ParticipantList setParticipants={setParticipants} />
            <SaveLoadSelection
              salt={salt}
              setSalt={setSalt}
              count={count}
              setCount={setCount}
              participants={participants}
              setParticipants={setParticipants}
            />
          </div>
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-64"
                >
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResultDisplay
                    results={sortedResults.slice(0, count)}
                    saltHash={saltHash}
                  />
                  <HashTable
                    results={sortedResults.slice(0, 1000)}
                    saltHash={saltHash}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <CoreAlgorithm />
      </div>
      <Footer />
    </div>
  );
}
