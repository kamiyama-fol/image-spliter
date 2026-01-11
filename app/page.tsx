"use client";

import { useState, useRef, useEffect } from "react";

type SplitMode = "horizontal" | "grid";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [splitImages, setSplitImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>("horizontal");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-process image when split mode changes
  useEffect(() => {
    if (originalImage) {
      processImage(originalImage, splitMode);
    }
  }, [splitMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalImage(result);
      processImage(result, splitMode);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageSrc: string, mode: SplitMode) => {
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
      const newImages: string[] = [];

      if (mode === "horizontal") {
        const splitHeight = height / 4;
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
      } else {
        // Grid (Cross) Split
        const splitWidth = width / 2;
        const splitHeight = height / 2;
        canvas.width = splitWidth;
        canvas.height = splitHeight;

        // Order: Top-Left, Top-Right, Bottom-Left, Bottom-Right
        const positions = [
          { x: 0, y: 0 },
          { x: splitWidth, y: 0 },
          { x: 0, y: splitHeight },
          { x: splitWidth, y: splitHeight },
        ];

        positions.forEach((pos) => {
          ctx.clearRect(0, 0, splitWidth, splitHeight);
          ctx.drawImage(
            img,
            pos.x, pos.y, splitWidth, splitHeight,
            0, 0, splitWidth, splitHeight
          );
          newImages.push(canvas.toDataURL("image/png"));
        });
      }

      setSplitImages(newImages);
      setIsProcessing(false);
    };
  };

  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `分割画像_${splitMode}_${index + 1}.png`;
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
      <main className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            X(Twitter)用 画像4分割ツール
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            画像をアップロードして、4枚の画像に分割します。<br/>
            「水平分割（縦長タップ推奨）」と「十字分割（4枚画像ネタ）」に対応。<br/>
            （先に画像をアップロードしてから分割する方法を選んでください）
          </p>
        </div>

        {/* 使い方セクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="text-blue-800 dark:text-blue-300 font-bold mb-2 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
              水平分割の使い方
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
              縦長の画像（1600x900など）を投稿し、タップして全体を見せる手法に最適です。
              画像をアップロード後、4枚の画像を上から順に保存し、Xでそのままの順番で投稿してください。
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <h3 className="text-emerald-800 dark:text-emerald-300 font-bold mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
              十字分割の使い方
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
              1枚の大きな画像を4枚のパネル（田の字）として見せる手法に最適です。
              「左上・右上・左下・右下」の順に保存し、Xの投稿画面でその順番通りに選択して投稿してください。
            </p>
          </div>
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
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                  <button
                    onClick={() => setSplitMode("horizontal")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      splitMode === "horizontal"
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    水平分割 (縦長)
                  </button>
                  <button
                    onClick={() => setSplitMode("grid")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      splitMode === "grid"
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    十字分割 (田の字)
                  </button>
                </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="font-medium text-zinc-500 dark:text-zinc-400">元の画像</h3>
                    <div className="relative w-full border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-auto object-contain max-h-[600px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-zinc-500 dark:text-zinc-400">
                      分割結果
                    </h3>
                    
                    {splitMode === "horizontal" ? (
                      // Horizontal Layout
                      <div className="space-y-4">
                        {splitImages.map((src, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700"
                          >
                            <div className="relative w-24 h-16 shrink-0 bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden">
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
                                上から {idx + 1} 番目
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
                    ) : (
                      // Grid Layout (2x2)
                      <div className="grid grid-cols-2 gap-4">
                        {splitImages.map((src, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700"
                          >
                            <div className="relative aspect-square w-full bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden">
                               {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`Part ${idx + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">
                                    {idx === 0 ? "左上" : idx === 1 ? "右上" : idx === 2 ? "左下" : "右下"}
                                </span>
                                <button
                                onClick={() => handleDownload(src, idx)}
                                className="px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                >
                                保存
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
