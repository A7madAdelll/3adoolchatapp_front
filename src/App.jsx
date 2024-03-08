import { RouterProvider, createBrowserRouter } from "react-router-dom";
import BasicExample from "./regester/login.jsx";
import Signup from "./signup/Signup.jsx"
import "./App.css";
import Message from "./message/Message.jsx";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      children: [
        { path: "/message", element: <Message /> },
        { path: "/login", element: <BasicExample /> }  ,
        { path: "/Signup", element: <Signup /> }  

      ],
    },

  ]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
