"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CeteiceanContent() {
  const searchParams = useSearchParams();

  const [manifest, setManifest] = useState("");
  const [isVertical, setIsVertical] = useState(false);
  const [title, setTitle] = useState("TEI Viewer");

  useEffect(() => {
    const teiFileUrl = searchParams.get("u") || "";

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
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            {title}
          </span>
        </div>
      </nav>

      <div className="grid md:grid-cols-2 gap-4" id="main">
        <div
          style={{
            height: "100%",
            width: "100%",
            overflow: "auto",
            writingMode: isVertical ? "vertical-rl" : "horizontal-tb",
          }}
          id="TEI"
          className="p-4"
        ></div>

        <iframe
          width="100%"
          height="100%"
          src={`/tei-viewer/mirador/index.html?manifest=${manifest}`}
          title="Mirador Viewer"
          style={{ border: "none" }}
          className="hidden md:block"
        ></iframe>
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
