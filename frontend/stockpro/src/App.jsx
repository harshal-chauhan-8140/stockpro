import { Header } from "./components";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="min-h-[85vh] bg-gray-50 p-6">
        <Outlet />
      </main>
    </>
  );
}

export default App;
