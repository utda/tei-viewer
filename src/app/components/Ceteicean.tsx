"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import NavBar from "./NavBar";
import MiradorViewer from "./MiradorViewer";
import TEIViewer from "./TEIViewer";

function CeteiceanContent() {
  const searchParams = useSearchParams();

  const [teiFileUrl, setTeiFileUrl] = useState("");
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

  const extractManifest = (data: any) => {
    const selectors = [
      { tag: "tei-surfaceGrp", attr: "facs" },
      { tag: "tei-facsimile", attr: "source" },
      { tag: "tei-facsimile", attr: "sameAs" },
    ];

    for (const { tag, attr } of selectors) {
      const element = data.querySelector(tag);
      if (element && element.hasAttribute(attr)) {
        return element.getAttribute(attr) || "";
      }
    }

    return "";
  };

  useEffect(() => {
    const teiFileUrl = searchParams.get("u") || "";
    setTeiFileUrl(teiFileUrl);

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

          const manifest = extractManifest(data);
          if (manifest) {
            setManifest(manifest);
          }

          const pbs = data.querySelectorAll("tei-pb");
          for (const pb of pbs) {
            if (!pb.hasAttribute("n")) continue;

            const br = document.createElement("br");
            pb.parentNode.insertBefore(br, pb);

            // n属性の値を取得
            const pageNumber = pb.getAttribute("n");
            // 表示用の段落を作成
            const pbDisplay = document.createElement("span");
            pbDisplay.classList.add("text-gray-400");
            pbDisplay.classList.add("horizontal-in-vertical");
            pbDisplay.textContent = `[${pageNumber}]`;
            // 段落をtei-pb要素の直前に挿入
            pb.parentNode.insertBefore(pbDisplay, pb);
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
      <NavBar
        title={title}
        teiFileUrl={teiFileUrl}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
      />
      {teiFileUrl && (
        <div className="grid md:grid-cols-2 gap-4" id="main">
          <TEIViewer isVertical={isVertical} fontSize={fontSize} />

          {manifest && <MiradorViewer manifest={manifest} />}
        </div>
      )}
      {!teiFileUrl && (
        <p className="p-4">
          Usage{" "}
          <a
            href="https://github.com/utda/tei-viewer?tab=readme-ov-file"
            className="text-blue-700"
          >
            https://github.com/utda/tei-viewer?tab=readme-ov-file
          </a>
        </p>
      )}
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
