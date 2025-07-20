import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const App = () => {
  return React.createElement("div", {
    className: "min-h-screen bg-slate-900 text-emerald-100 p-8"
  }, [
    React.createElement("h1", {
      key: "title",
      className: "text-4xl font-bold text-center text-emerald-400"
    }, "Android Kernel Customizer"),
    React.createElement("p", {
      key: "status", 
      className: "text-center mt-4"
    }, "Pure React.createElement - No JSX transpilation issues!")
  ]);
};

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(App));
}