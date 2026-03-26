import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Download, QrCode, Share2 } from "lucide-react";
import { AppLayout } from "../components/AppLayout";

const WEBSITE_URL = "https://paylink-services-yxv.caffeine.xyz";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(WEBSITE_URL)}&margin=16`;

export default function QRCodePage() {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vasu Communication - PayLink Services",
          text: "Hamare services ke liye yahan click karein:",
          url: WEBSITE_URL,
        });
      } catch (_) {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(WEBSITE_URL);
      alert("Link copy ho gaya!");
    }
  };

  const handleDownload = () => {
    const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(WEBSITE_URL)}&margin=20`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "vasu-communication-qr.png";
    a.target = "_blank";
    a.click();
  };

  return (
    <AppLayout>
      <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-xs">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-bold text-base leading-tight">
            Customer QR Code
          </h1>
          <p className="text-xs text-muted-foreground">
            Scan karke website seedha kholein
          </p>
        </div>
      </header>

      <div className="px-4 py-6 flex flex-col items-center gap-6">
        {/* Info banner */}
        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
          <QrCode className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Customer ke liye QR Code
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Yeh QR code print karein ya screen par dikhayein -- customer scan
              karega toh seedha website khul jaayegi.
            </p>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-border p-6 flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="text-center">
            <p className="font-bold text-lg text-foreground">
              Vasu Communication
            </p>
            <p className="text-xs text-muted-foreground">PayLink Services</p>
          </div>

          <div className="bg-white p-2 rounded-2xl border-2 border-indigo-200">
            <img
              src={QR_URL}
              alt="Website QR Code"
              width={280}
              height={280}
              className="rounded-xl"
              loading="eager"
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Scan karein ya link kholo:
            </p>
            <p className="text-xs font-medium text-indigo-600 mt-1 break-all">
              {WEBSITE_URL}
            </p>
          </div>

          <div className="w-full pt-1 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              📞 7339891179 &nbsp;|&nbsp; Airtel Official Partner
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full flex gap-3 max-w-xs">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-white text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Print tip */}
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          💡 Tip: QR code download karke print karein aur shop ke counter par
          lagayein -- customer khud scan karke booking kar sakta hai.
        </p>
      </div>
    </AppLayout>
  );
}
