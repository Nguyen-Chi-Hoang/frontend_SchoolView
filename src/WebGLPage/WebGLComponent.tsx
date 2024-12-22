import Footer from "../Footer";
import Header from "../Header";
import { useEffect, useState } from "react";
import axios from "axios";

interface BuildingInfo {
  _id: string;
  name: string;
  photoname: string;
  info: string;
  imagesrc: string;
  location: string;
}

const MyComponent = () => {
  const [sceneName, setSceneName] = useState<string | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(true);
  const [buildingData, setBuildingData] = useState<BuildingInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get(
          "https://backend-schoolview.onrender.com/api/buildingInfo"
        );
        const buildings: BuildingInfo[] = response.data;

        // Listen for messages from Unity
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === "SCENE_NAME") {
            const matchingBuilding = buildings.find(
              (building) => building.photoname === event.data.name
            );
            if (matchingBuilding) {
              setSceneName(matchingBuilding.name);
              setBuildingData(matchingBuilding);
            } else {
              setSceneName(null);
              setBuildingData(null);
            }
          }
        };

        window.addEventListener("message", handleMessage);

        return () => {
          window.removeEventListener("message", handleMessage);
        };
      } catch (error) {
        console.error("Error fetching building information", error);
      }
    };

    fetchBuildings();
  }, []);

  const toggleInfoVisibility = () => {
    setIsInfoVisible(!isInfoVisible);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="relative flex-grow flex flex-col justify-center items-center p-5">
        <div className="absolute top-4 right-4 flex gap-4">
          <input
            type="text"
            placeholder="Search anchor points..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={toggleInfoVisibility}
            className="p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
          >
            {isInfoVisible ? "Hide Info" : "Show Info"}
          </button>
        </div>
        {sceneName && isInfoVisible && buildingData && (
          <div className="absolute z-10 top-20 left-4 m-4 p-4 bg-white text-black rounded-md shadow-md max-w-xs w-full sm:w-96">
            <img
              src={buildingData.imagesrc}
              alt="Location Thumbnail"
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <div className="font-semibold text-lg mb-1">{sceneName}</div>
            <p className="text-sm text-gray-700">{buildingData.info}</p>
            <div className="text-xs text-gray-500 mt-1">
              <span className="font-semibold">Location:</span>{" "}
              {buildingData.location}
            </div>
          </div>
        )}
        <div className="relative w-full max-w-5xl pb-[56.25%] mt-10">
          {/* 16:9 aspect ratio */}
          <iframe
            title="WebGL Demo"
            src="/WebGL_v2.0_fixbug/index.html"
            className="absolute inset-0 w-full h-full border-none shadow-lg rounded-lg"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyComponent;
