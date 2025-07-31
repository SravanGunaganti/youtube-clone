import icon from "../src/assets/youtube-icons/yt_red.png";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="bg-[#ffd199] border-b border-yellow-300 text-[#663800] p-4 flex items-center justify-center gap-3 shadow-sm">
        <img src={icon} alt="YouTube icon" className="w-12" />
        <div className="text-sm sm:text-base text-center">
          <strong>Note:</strong> This YouTube Clone project is{" "}
          <span className="font-semibold">under active development</span>.
        </div>
      </div>

      <main className="flex flex-col items-center justify-center text-center p-10">
        <img
          src="../src/assets/youtube-logos/yt_red_black.png"
          alt="YouTube Logo"
          className="w-40 mt-10 opacity-80"
        />

        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 mb-4">
          YouTube Clone
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Built using the MERN stack (MongoDB, Express, React, Node). Stay tuned
          for full video experience and features like authentication, comments,
          search, and more!
        </p>
      </main>
    </div>
  );
}

export default App;
