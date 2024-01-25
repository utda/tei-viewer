"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function CeteiceanContent() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const teiFileUrl =
      searchParams.get("u") ||
      "https://kouigenjimonogatari.github.io/tei/01.xml";

    import("CETEIcean").then((CETEI) => {
      var CETEIcean = new CETEI.default();
      CETEIcean.getHTML5(teiFileUrl, function (data: any) {
        const teiElement = document.getElementById("TEI");
        if (teiElement) {
          teiElement.innerHTML = ""; // Clear existing content

          // Remove tei-facsimile elements from data
          const facsimileElements = data.querySelectorAll("tei-facsimile");
          facsimileElements.forEach((el: { remove: () => any }) => el.remove());

          teiElement.appendChild(data);
        }
      });
    });
  }, [searchParams]);

  return <div id="TEI"></div>;
}

//  style={{ height: "600px" }}
export default function Ceteicean() {
  const manifest = "https://www.dl.ndl.go.jp/api/iiif/3437686/manifest.json";
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid grid-cols-2 gap-4" style={{ height: "100vh" }}>
        <div style={{ height: "100%", overflow: "auto" }}>
          <CeteiceanContent />
        </div>

        <iframe
          width="100%"
          height="100%"
          src={`https://mirador.cultural.jp/?manifest=${manifest}`}
          title="Mirador Viewer"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </Suspense>
  );
}
