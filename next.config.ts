import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pagesのサブディレクトリ（リポジトリ名）用に入れていた設定があれば、
  // カスタムドメイン（ルート運用）の場合は削除するか、条件分岐させます。
  // basePath: process.env.NODE_ENV === 'production' ? '' : '', 
  
  // 静的ファイル（画像やCSS）の参照先を指定する設定
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',

  output: 'export', // 静的書き出しを有効にしている場合
};

export default nextConfig;
