import { useState } from 'react';
import Sidebar from '../../component/sidebar/SideBar';
import Header from '../../component/header/Header';
import { PrivateRouting } from "../../routing/private/PrivateRouting"
const PrivateWrap = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (Drawer for small screens, Static for large screens) */}
      <div
        className={`h-full bg-white overflow-y-auto z-50 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 lg:w-64' : 'lg:w-0 -translate-x-full fixed lg:relative lg:translate-x-0'}
          fixed top-0 left-0 w-64 lg:sticky`}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      {/* Overlay for small screens only */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#d9d9d9] bg-opacity-75 blur-xl z-40 sm:block lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content with Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          <PrivateRouting />
        </div>
      </div>
    </div>
  );
};

export default PrivateWrap;
