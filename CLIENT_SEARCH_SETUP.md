# クライアント側検索機能のセットアップガイド

## 概要
このドキュメントでは、OtogeFormatterPageで新しく実装したクライアント側検索機能のセットアップ方法を説明します。

## 変更内容

### 1. プロジェクト構成の変更
- **OtogeMusicStorage** (旧OtogeUtils): 楽曲データ管理用プロジェクト
  - `functions/getAllMusic.ts` - 楽曲データを全て取得するAPI（GET）
  - GETリクエストでクエリパラメータ `?gameType=chunithm` または `?gameType=sdvx` を指定
  - 他の楽曲記録用ファイル（recordChuniMusic.ts, recordSdvxMusic.ts）

- **OtogeFormatterGAS** (新規): 表記揺れ修正API用プロジェクト
  - `findSimilarMusic.ts` - 表記揺れを修正するAPI（POST/GET）

### 2. OtogeFormatterPage (クライアント側) の変更

#### 新規追加ファイル:
- `src/services/similaritySearch.ts` - 類似度計算のロジック（GASから移植）
- `src/services/musicDataService.ts` - 楽曲データのキャッシュと管理
- `src/utils/clientCorrection.ts` - クライアント側での表記揺れ修正処理

#### 更新したファイル:
- `src/App.vue` - プリロード処理とクライアント検索の切り替え機能を追加
- `config/vite.config.ts` - 新しいAPIエンドポイント用のプロキシ設定を追加

## セットアップ手順

### 1. GASプロジェクトのデプロイ

#### OtogeMusicStorage (楽曲データ取得API)
1. Google Apps Scriptプロジェクトを作成
2. `OtogeMusicStorage/functions/getAllMusic.ts` をアップロード
3. 新しいデプロイを作成:
   - デプロイタイプ: ウェブアプリ
   - 実行ユーザー: 自分
   - アクセスできるユーザー: 全員（匿名ユーザーを含む）
4. デプロイURLをコピー

#### OtogeFormatterGAS (表記揺れ修正API - 従来のAPI)
1. 別のGoogle Apps Scriptプロジェクトを作成
2. `OtogeFormatterGAS/findSimilarMusic.ts` をアップロード
3. 同様にWebアプリとしてデプロイ
4. デプロイURLをコピー（これは従来通り使用）

### 2. OtogeFormatterPage の設定

1. `src/services/musicDataService.ts` の26-27行目を更新:
   ```typescript
   this.apiUrl = import.meta.env.DEV
     ? '/api/getallmusic'
     : 'https://script.google.com/macros/s/[実際のスクリプトID]/exec'
   ```

2. `config/vite.config.ts` の35行目を更新:
   ```typescript
   rewrite: (path) => path.replace(/^\/api\/getallmusic/, '/macros/s/[実際のスクリプトID]/exec'),
   ```

### 3. 動作確認

1. 開発サーバーを起動:
   ```bash
   npm run dev
   ```

2. ブラウザのコンソールを開いて以下のメッセージを確認:
   - `Music data preloaded successfully` - 初回ロード成功
   - `Music data reloaded for new game mode` - ゲームモード切り替え時

3. APIの直接確認（デプロイ後）:
   - `https://script.google.com/macros/s/[スクリプトID]/exec` - API情報を表示
   - `https://script.google.com/macros/s/[スクリプトID]/exec?gameType=chunithm` - CHUNITHMの楽曲データ
   - `https://script.google.com/macros/s/[スクリプトID]/exec?gameType=sdvx` - SOUND VOLTEXの楽曲データ

## 機能の特徴

### パフォーマンスの改善
- **初回ロード**: ページ読み込み時に楽曲データをまとめて取得
- **キャッシュ**: 一度取得したデータはメモリにキャッシュされる
- **高速検索**: クライアント側で検索処理を行うため、APIの往復時間が不要

### 使用方法
- デフォルトでクライアント側検索が有効
- `App.vue` の `useClientSearch` フラグで切り替え可能
- 従来のAPI (findSimilarMusic) も引き続き利用可能

## トラブルシューティング

### 楽曲データが取得できない場合
1. GASのデプロイURLが正しいか確認
2. CORSエラーがないか開発者コンソールを確認
3. Google Driveのアクセス権限を確認

### 検索結果が表示されない場合
1. 楽曲データがプリロードされているか確認
2. コンソールにエラーメッセージがないか確認
3. ネットワークタブでAPIリクエストの状態を確認

## 今後の改善案
- 楽曲データの差分更新機能
- IndexedDBを使用したローカルキャッシュ
- Web Workerを使用した検索処理の並列化