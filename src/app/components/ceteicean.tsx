"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CeteiceanContent() {
  const searchParams = useSearchParams();

  const [u, setU] = useState("");
  const [manifest, setManifest] = useState("");
  const [isVertical, setIsVertical] = useState(false);
  const [title, setTitle] = useState("TEI Viewer");

  // 文字サイズを管理するための状態変数
  const [fontSize, setFontSize] = useState(16); // 初期値を16pxに設定

  // 文字サイズを増やす関数
  const increaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize + 1);
  };

  // 文字サイズを減らす関数
  const decreaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize - 1);
  };

  useEffect(() => {
    const teiFileUrl = searchParams.get("u") || "";
    setU(teiFileUrl);

    function updateHeight() {
      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      const main = document.getElementById("main");
      if (main) {
        main.style.height = `calc(100vh - ${navHeight}px)`;
        main.style.overflow = "auto";
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);

    // 横スクロールイベントリスナーの追加
    const addWheelEventListener = () => {
      const teiElement = document.getElementById("TEI");
      if (!teiElement) return;
      const onWheel = (event: WheelEvent) => {
        var scrollAmount = -30;
        if (event.deltaY > 0) teiElement.scrollLeft += scrollAmount;
        else teiElement.scrollLeft -= scrollAmount;
        event.preventDefault();
      };

      teiElement.addEventListener("wheel", onWheel, { passive: false });
      return () => teiElement.removeEventListener("wheel", onWheel);
    };

    setIsVertical(searchParams.get("v") === "true");

    import("CETEIcean").then((CETEI) => {
      var CETEIcean = new CETEI.default();
      CETEIcean.getHTML5(teiFileUrl, function (data: any) {
        const teiElement = document.getElementById("TEI");
        if (teiElement) {
          teiElement.innerHTML = ""; // Clear existing content

          const sg = data.querySelector("tei-surfaceGrp");
          if (sg) {
            setManifest(sg.getAttribute("facs") || "");
          }

          // Remove tei-facsimile elements from data
          const facsimileElements = data.querySelectorAll("tei-facsimile");
          facsimileElements.forEach((el: { remove: () => any }) => el.remove());

          const title = data.querySelector("tei-title");
          if (title) {
            setTitle(title.textContent || "");
          }

          teiElement.appendChild(data);
        }
      });
    });

    if (isVertical && !/Mobi/i.test(navigator.userAgent)) {
      addWheelEventListener();
    }

    return () => window.removeEventListener("resize", updateHeight);
  });

  return (
    <>
      <nav className="bg-gray-900">
        <div className="flex flex-wrap items-center justify-between mx-auto p-2">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
            {title}
          </span>

          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="flex items-center">
                <button
                  onClick={increaseFontSize}
                  title="Increase Font Size"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-[20px] h-[20px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>
                </button>
              </li>
              <li className="flex items-center">
                <button
                  title="Decrease Font Size"
                  onClick={decreaseFontSize}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-[20px] h-[20px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
              </li>
              <li className="flex items-center">
                <a
                  href={u}
                  title="Download XML"
                  target="_blank"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-[20px] h-[20px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 11.1V4a1 1 0 1 0-2 0v7.1L8.8 8.4a1 1 0 1 0-1.6 1.2l4 5a1 1 0 0 0 1.6 0l4-5a1 1 0 1 0-1.6-1.2L13 11Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M9.7 15.9 7.4 13H5a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.4l-2.3 2.9a3 3 0 0 1-4.6 0Zm7.3.1a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="grid md:grid-cols-2 gap-4" id="main">
        <div
          style={{
            height: "100%",
            width: "100%",
            overflow: "auto",
            writingMode: isVertical ? "vertical-rl" : "horizontal-tb",
            fontSize: `${fontSize}px`, // スタイルにfontSizeを追加
          }}
          id="TEI"
          className="p-4"
        ></div>

        {manifest && (
          <iframe
            width="100%"
            height="100%"
            src={`/tei-viewer/mirador/index.html?manifest=${manifest}`}
            title="Mirador Viewer"
            style={{ border: "none" }}
            className="hidden md:block"
          ></iframe>
        )}
      </div>
    </>
  );
}

export default function Ceteicean() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CeteiceanContent />
    </Suspense>
  );
}
