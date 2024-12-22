import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

interface BuildingInfo {
  _id?: string;
  name: string;
  photoname: string;
  info: string;
  imagesrc: string;
  location: string;
}

const API_BASE_URL = "https://backend-schoolview.onrender.com";

const Admin: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<BuildingInfo | null>(null);
  const [logout, setLogout] = useState(false); // State to handle logout

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/buildingInfo`);
      console.log("API Response Data:", response.data);
      console.log("Is Response an Array:", Array.isArray(response.data));
      setBuildings(response.data);
    } catch (error) {
      console.error("Error fetching building information", error);
    }
  };

  const handleOpenModal = (building?: BuildingInfo) => {
    setModalData(
      building || {
        name: "",
        photoname: "",
        info: "",
        imagesrc: "",
        location: "",
      }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (modalData) {
      setModalData({
        ...modalData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (modalData) {
          setModalData({ ...modalData, imagesrc: response.data.imagePath });
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalData?._id) {
        // Update existing building
        await axios.put(
          `${API_BASE_URL}/api/buildingInfo/${modalData._id}`,
          modalData
        );
      } else {
        // Create new building
        await axios.post(`${API_BASE_URL}/api/buildingInfo`, modalData);
      }
      fetchBuildings();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving building information", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/buildingInfo/${id}`);
      fetchBuildings(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting building information", error);
    }
  };

  const handleLogout = () => {
    // Clear any authentication data (e.g., localStorage or sessionStorage)
    localStorage.removeItem("isAdmin");
    setLogout(true);
  };

  if (logout) {
    return <Navigate to="/login" />; // Redirect to login page after logout
  }

  return (
    <div className="relative p-3 sm:p-5">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-3 right-3 px-3 py-1 text-sm font-semibold text-white bg-gray-500 rounded sm:top-5 sm:right-5 sm:px-4 sm:py-2"
      >
        Logout
      </button>

      <h2 className="text-xl font-bold mb-4 sm:text-2xl">
        Building Information Management
      </h2>
      <button
        onClick={() => handleOpenModal()}
        className="px-3 py-1 mb-4 text-sm font-semibold text-white bg-blue-500 rounded sm:px-4 sm:py-2"
      >
        Add New Information
      </button>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Photo</th>
              <th className="p-2 border">Photo Name</th>
              <th className="p-2 border">Information</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building._id}>
                <td className="p-2 border">{building.name}</td>
                <td className="p-2 border">
                  <img
                    src={building.imagesrc}
                    alt={building.photoname}
                    className="w-12 h-12 object-cover sm:w-16 sm:h-16"
                  />
                </td>
                <td className="p-2 border">{building.photoname}</td>
                <td className="p-2 border">{building.info}</td>
                <td className="p-2 border">{building.location}</td>
                <td className="p-2 border flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-2">
                  <button
                    onClick={() => handleOpenModal(building)}
                    className="px-2 py-1 text-xs text-white bg-yellow-500 rounded sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(building._id!)}
                    className="px-2 py-1 text-xs text-white bg-red-500 rounded sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full max-w-xs p-4 bg-white rounded-md shadow-md sm:max-w-sm sm:p-6">
            <h2 className="text-lg font-bold mb-4 sm:text-xl">
              {modalData?._id
                ? "Update Building Info"
                : "Create New Building Info"}
            </h2>
            <input
              name="name"
              value={modalData?.name || ""}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              name="photoname"
              value={modalData?.photoname || ""}
              onChange={handleInputChange}
              placeholder="Photo Name"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <textarea
              name="info"
              value={modalData?.info || ""}
              onChange={handleInputChange}
              placeholder="Information"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              name="location"
              value={modalData?.location || ""}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 mr-2 text-white bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                {modalData?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
