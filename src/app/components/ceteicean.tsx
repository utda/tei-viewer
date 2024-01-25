"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CeteiceanContent() {
  const searchParams = useSearchParams();

  const [manifest, setManifest] = useState(
    "https://www.dl.ndl.go.jp/api/iiif/3437686/manifest.json"
  );

  const [isVertical, setIsVertical] = useState(false);

  const [title, setTile] = useState("TEI Viewer");

  useEffect(() => {
    const teiFileUrl =
      searchParams.get("u") ||
      "https://kouigenjimonogatari.github.io/tei/01.xml";

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
            setTile(title.textContent || "");
          }

          teiElement.appendChild(data);
        }
      });
    });

    if (isVertical) {
      document.getElementById("TEI")?.addEventListener(
        "wheel",
        function (event) {
          // 横スクロールの量を設定
          var scrollAmount = -30;

          // マウスホイールの移動方向に基づいて横スクロール
          if (event.deltaY > 0) this.scrollLeft += scrollAmount;
          else this.scrollLeft -= scrollAmount;

          // デフォルトのスクロール動作を防止
          event.preventDefault();
        },
        { passive: false }
      );
    }

    window.onload = () => {
      const navHeight = document.querySelector("nav")?.offsetHeight;
      const main = document.getElementById("main");
      if (main) {
        main.style.height = `calc(100vh - ${navHeight}px)`;
        main.style.overflow = "auto"; // コンテンツが多すぎる場合はスクロール可能に
      }
    };
  }, []);

  return (
    <>
      <nav className="bg-gray-900">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            {title}
          </span>
        </div>
      </nav>

      <div
        className="grid md:grid-cols-2 gap-4 grid-cols-1"
        style={{ height: "100%" }}
        id="main"
      >
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
