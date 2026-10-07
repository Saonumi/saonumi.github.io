# Phát triển & deploy portfolio

Tài liệu kỹ thuật cho website của Nguyễn Ngọc Sáng / Saonumi. Phần giới thiệu cá nhân nằm trong [README](../README.md).

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | Vue 3, TypeScript, Vite |
| Đồ họa | Three.js, WebGL, GLSL |
| Chuyển động | GSAP, ScrollTrigger, Lenis |
| Giao diện | SCSS, Urbanist, Be Vietnam Pro |
| Deploy | GitHub Actions, GitHub Pages |

## Chạy tại máy

Yêu cầu **Node.js 22.12 trở lên trong nhánh 22.x** và npm.

```sh
npm ci
npm run dev
```

Mở `http://127.0.0.1:5174`.

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Chạy server phát triển. |
| `npm run typecheck` | Kiểm tra TypeScript. |
| `npm run build` | Kiểm tra TypeScript và tạo bản production trong `dist/`. |
| `npm run preview` | Xem bản production tại máy sau khi build. |

## Chỉnh nội dung

| Đường dẫn | Nội dung |
| --- | --- |
| `src/content/saonumi.ts` | Thông tin cá nhân, dự án, kỹ năng. |
| `src/content/social.ts` | Liên kết liên hệ. |
| `src/i18n/messages/namespaces/common/` | Bản dịch giao diện Việt–Anh. |
| `src/features/home/components/` | Hero, About, Projects, Skills, Contact. |
| `src/three/` | Scene, shader và hiệu ứng 3D. |
| `public/` | Font, favicon và model 3D. |
| `.github/workflows/deploy.yml` | Workflow build và deploy GitHub Pages. |

## Cập nhật repository

Repository: [Saonumi/saonumi.github.io](https://github.com/Saonumi/saonumi.github.io), nhánh `main`.

Đặt `README.md`, `package.json`, `src/`, `public/`, `docs/` và `.github/` ngay ở gốc repository. Giữ `.git` của bản clone để cập nhật đúng repository và lịch sử.

Sau khi chép các thay đổi vào bản clone tại `E:\saonumi-publish`, dùng PowerShell:

```powershell
Set-Location E:\saonumi-publish
git status --short
git add .
git commit -m "Update personal portfolio"
git push origin main
```

Push bằng tài khoản có quyền ghi vào repository. Clone repository public không cấp quyền push.

Không upload `node_modules/`, `dist/`, file `.env` hay file tạm. `.gitignore` đã loại các mục này. Dùng Git để push vì một số tài nguyên lớn hơn giới hạn 25 MiB/file của tính năng upload trên trang GitHub. Các file hiện tại đều dưới giới hạn 100 MiB của Git push, nên không cần Git LFS. [Giới hạn upload của GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## Bật GitHub Pages

1. Trong repository, vào **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Push lên `main`. Workflow sẽ chạy hai job `build` và `deploy`.
3. Kiểm tra kết quả trong **Actions**. Địa chỉ web xuất hiện trong **Settings → Pages** và phần deployment của workflow.

Nếu lần chạy đầu bị lỗi vì Pages chưa được bật, vào **Actions → Deploy portfolio to GitHub Pages → Run workflow**, chọn `main` và chạy lại.

Repository có `CNAME` trỏ tới `saonumi.io.vn`; kiểm tra mục **Custom domain** trong Settings → Pages khi dùng tên miền riêng. Địa chỉ mặc định là `https://saonumi.github.io/`.

Workflow tự lấy đường dẫn GitHub Pages, hỗ trợ cả repository cá nhân ở địa chỉ gốc và repository dự án ở dạng `/ten-repo/`. Mỗi lần push lên `main`, workflow tự build và cập nhật website. Không cần đưa `dist/` vào Git hoặc thêm token riêng cho workflow.

Tham khảo: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [Deploy Vite lên GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).
