"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, QrCode } from "lucide-react";

export default function QRCodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  type LegacyNavigator = Navigator & {
    getUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: unknown) => void
    ) => void;
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: unknown) => void
    ) => void;
    mozGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: unknown) => void
    ) => void;
    msGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: unknown) => void
    ) => void;
  };

  // Support check (modern + legacy) + mobile detection
  useEffect(() => {
    const checkSupport = () => {
      // Počkáme na navigator
      if (typeof navigator === "undefined") return;

      const hasModern = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );

      const hasLegacy =
        !!(navigator as LegacyNavigator).getUserMedia ||
        !!(navigator as LegacyNavigator).webkitGetUserMedia ||
        !!(navigator as LegacyNavigator).mozGetUserMedia ||
        !!(navigator as LegacyNavigator).msGetUserMedia;

      setIsSupported(Boolean(hasModern || hasLegacy));

      // Detekce mobilního zařízení
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
    };

    // Okamžitá kontrola
    checkSupport();

    // Fallback pro Android - někdy navigator není hned dostupný
    const timer1 = setTimeout(checkSupport, 100);
    const timer2 = setTimeout(checkSupport, 500);
    const timer3 = setTimeout(checkSupport, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const attachVideoElement = () => {
    if (!containerRef.current || videoRef.current) return;

    const vid = document.createElement("video");
    vid.setAttribute("playsinline", "true"); // iOS: no fullscreen
    vid.playsInline = true;
    vid.setAttribute("muted", "true"); // kvůli autoplay po kliknutí
    vid.muted = true;
    vid.autoplay = true;

    // Android Chrome specifické nastavení
    if (isMobile) {
      vid.setAttribute("webkit-playsinline", "true");
      vid.setAttribute("x-webkit-airplay", "allow");
    }

    vid.style.width = "100%";
    vid.style.height = "100%";
    vid.style.objectFit = "cover";
    vid.style.display = "block";
    vid.style.borderRadius = "0.5rem";

    videoRef.current = vid;
    containerRef.current.appendChild(vid);

    const markReady = () => setIsVideoReady(true);
    vid.addEventListener("loadedmetadata", markReady, { once: true });
    vid.addEventListener("canplay", markReady, { once: true });
    vid.addEventListener("playing", markReady, { once: true });
    vid.onerror = () => setError("Nepodařilo se přehrát video stream.");
  };

  const startCamera = async () => {
    // Fallback kontrola pro Android - někdy se detekce nepovede
    if (!isSupported) {
      console.log("Fallback kontrola - navigator:", typeof navigator);
      console.log("navigator.mediaDevices:", navigator?.mediaDevices);
      console.log(
        "navigator.getUserMedia:",
        (navigator as LegacyNavigator)?.getUserMedia
      );

      // Zkusíme ještě jednou zkontrolovat podporu
      const hasModern = !!(
        navigator?.mediaDevices && navigator.mediaDevices.getUserMedia
      );
      const hasLegacy =
        !!(navigator as LegacyNavigator)?.getUserMedia ||
        !!(navigator as LegacyNavigator)?.webkitGetUserMedia ||
        !!(navigator as LegacyNavigator)?.mozGetUserMedia ||
        !!(navigator as LegacyNavigator)?.msGetUserMedia;

      console.log("hasModern:", hasModern, "hasLegacy:", hasLegacy);

      if (!hasModern && !hasLegacy) {
        // Zkusíme ještě jednou s delším timeoutem pro Android
        console.log("Zkouším delayed check pro Android...");
        await new Promise((resolve) => setTimeout(resolve, 200));

        const hasModernDelayed = !!(
          navigator?.mediaDevices && navigator.mediaDevices.getUserMedia
        );
        const hasLegacyDelayed =
          !!(navigator as LegacyNavigator)?.getUserMedia ||
          !!(navigator as LegacyNavigator)?.webkitGetUserMedia ||
          !!(navigator as LegacyNavigator)?.mozGetUserMedia ||
          !!(navigator as LegacyNavigator)?.msGetUserMedia;

        console.log(
          "Delayed check - hasModern:",
          hasModernDelayed,
          "hasLegacy:",
          hasLegacyDelayed
        );

        if (!hasModernDelayed && !hasLegacyDelayed) {
          setError("Přístup ke kameře není podporován.");
          setIsVideoReady(false);
          return;
        }
      }
      // Pokud jsme našli podporu, pokračujeme
      console.log("Fallback kontrola úspěšná, pokračujeme...");
    }

    // Ukážeme kontejner a resetneme stav ještě před žádostí o stream
    setError(null);
    setIsVideoReady(false);
    setIsScanning(true);

    try {
      // Android Chrome specifické nastavení
      const constraints = {
        video: {
          facingMode: { ideal: "environment" }, // zadní kamera, pokud je
          width: isMobile
            ? { ideal: 640, min: 320 }
            : { ideal: 1280, min: 640 },
          height: isMobile
            ? { ideal: 480, min: 240 }
            : { ideal: 720, min: 480 },
          // Android Chrome specifické
          frameRate: { ideal: 30, min: 15 },
        },
        audio: false,
      };

      // Zkusíme moderní API, pokud selže, zkusíme legacy
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (modernError) {
        console.log("Modern API selhal, zkouším legacy:", modernError);
        // Fallback na legacy API pro Android
        if ((navigator as LegacyNavigator).getUserMedia) {
          stream = await new Promise<MediaStream>((resolve, reject) => {
            (navigator as LegacyNavigator).getUserMedia!(
              constraints,
              resolve,
              reject
            );
          });
        } else if ((navigator as LegacyNavigator).webkitGetUserMedia) {
          stream = await new Promise<MediaStream>((resolve, reject) => {
            (navigator as LegacyNavigator).webkitGetUserMedia!(
              constraints,
              resolve,
              reject
            );
          });
        } else {
          throw modernError;
        }
      }

      streamRef.current = stream;

      // Až po získání streamu připojíme video element
      attachVideoElement();

      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;

        // Počkáme (pokud je třeba) na metadata, pak play
        if (v.readyState < 2) {
          await new Promise<void>((resolve) => {
            const onMeta = () => resolve();
            v.addEventListener("loadedmetadata", onMeta, { once: true });
          });
        }

        await v.play();
        // jistota, že overlay zmizí i kdyby eventy zlobily
        setIsVideoReady(true);
      }
    } catch (e: unknown) {
      console.error(e);
      // typické chyby + HTTPS mimo localhost
      if (e instanceof DOMException && e.name === "NotAllowedError") {
        setError("Přístup ke kameře byl zamítnut v prohlížeči.");
      } else if (e instanceof DOMException && e.name === "NotFoundError") {
        setError("Nebyla nalezena žádná kamera.");
      } else if (
        location.protocol !== "https:" &&
        location.hostname !== "localhost"
      ) {
        setError("Pro přístup ke kameře je nutné HTTPS (mimo localhost).");
      } else {
        setError("Nepodařilo se spustit kameru. Zkontrolujte oprávnění.");
      }
      // uklid + skrytí kontejneru
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch {}
      videoRef.current.remove();
      videoRef.current = null;
    }
    setIsVideoReady(false);
    setIsScanning(false);
  };

  // Úklid při odmountování
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            Skenování QR kódů
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupported ? (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 mx-auto text-subtle mb-4" />
              <p className="text-muted">
                Tento prohlížeč nepodporuje přístup ke kameře.
              </p>
              {isMobile && (
                <p className="text-sm text-subtle mt-2">
                  Detekováno mobilní zařízení. Zkuste kliknout na &quot;Spustit
                  kameru&quot; pro fallback kontrolu.
                </p>
              )}
              <Button onClick={startCamera} size="lg" className="mt-4">
                <Camera className="w-4 h-4 mr-2" />
                Zkusit spustit kameru
              </Button>
            </div>
          ) : !isScanning ? (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 mx-auto text-subtle mb-4" />
              <p className="text-muted mb-4">
                Kliknutím níže spustíš kameru.
              </p>
              <Button onClick={startCamera} size="lg">
                <Camera className="w-4 h-4 mr-2" />
                Spustit kameru
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* TADY SE VYKRESLÍ KAMERA DO DIVU */}
              <div
                ref={containerRef}
                className="relative w-full rounded-lg border bg-black"
                style={{ aspectRatio: "3 / 2", overflow: "hidden" }}
              >
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-dim">
                    Načítání kamery…
                  </div>
                )}
                {/* Overlay zaměřovač */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-foreground/50 border-dashed w-64 h-64 rounded-lg" />
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={stopCamera}>
                  Zastavit kameru
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

