"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalImage(result);
      processImage(result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageSrc: string) => {
    setIsProcessing(true);
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      const { width, height } = img;
      const splitHeight = height / 4;
      const newImages: string[] = [];

      canvas.width = width;
      canvas.height = splitHeight;

      for (let i = 0; i < 4; i++) {
        ctx.clearRect(0, 0, width, splitHeight);
        ctx.drawImage(
          img,
          0, i * splitHeight, width, splitHeight,
          0, 0, width, splitHeight
        );
        newImages.push(canvas.toDataURL("image/png"));
      }

      setSplitImages(newImages);
      setIsProcessing(false);
    };
  };

  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `分割画像_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setOriginalImage(null);
    setSplitImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8 font-sans">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
           画面タップで4分割 画像分割ツール
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            画像をアップロードすると、高さを4等分して分割します。
            <br />
            縦向きの画像（1600x900など）を分割するのに最適です。
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
          {!originalImage ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <label className="cursor-pointer flex flex-col items-center space-y-2 w-full h-full justify-center">
                <svg
                  className="w-12 h-12 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-lg font-medium text-zinc-600 dark:text-zinc-300">
                  画像を選択またはドラッグ＆ドロップ
                </span>
                <span className="text-sm text-zinc-500">
                  対応形式: JPG, PNG, WEBP
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                  プレビューとダウンロード
                </h2>
                <button
                  onClick={reset}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  やり直す
                </button>
              </div>

              {isProcessing ? (
                <div className="text-center py-12 text-zinc-500">処理中...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="font-medium text-zinc-500 dark:text-zinc-400">元の画像</h3>
                    <div className="relative w-full h-auto border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-zinc-500 dark:text-zinc-400">
                      分割結果（上から順）
                    </h3>
                    <div className="grid gap-4">
                      {splitImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700"
                        >
                          <div className="relative w-20 h-20 shrink-0 bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={`Part ${idx + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              パート {idx + 1}
                            </p>
                            <p className="text-xs text-zinc-500">
                              高さ 1/4
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownload(src, idx)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                          >
                            保存
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
