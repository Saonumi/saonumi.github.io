# Saonumi · Nguyễn Ngọc Sáng

**AI Researcher / Engineer**

Portfolio cá nhân về AI, kỹ thuật và nghiên cứu. Tập trung vào NLP / RAG, Speech AI và AI Security, với giao diện song ngữ Việt–Anh và nhân vật 3D tương tác.

[GitHub](https://github.com/Saonumi) · [LinkedIn](https://www.linkedin.com/in/saonumi) · [Email](mailto:sang3172005@gmail.com)

## Dự án & nghiên cứu

| Dự án | Trọng tâm | Mã nguồn |
| --- | --- | --- |
| **Doctor Chatbot** | Trợ lý tra cứu cho phòng khám Đông y, kết hợp Agentic RAG, Text-to-SQL và Vision AI. | [Public](https://github.com/Saonumi/doctor-chatbot) |
| **BASTION** | Multi-Agent AI hỗ trợ SOC phân tích email, cloud logs và tổng hợp báo cáo có bằng chứng. | [Public · Dự án nhóm](https://github.com/longriver293/BASTION) |
| **SAOVoice** | Text-to-Speech cho long-context, nghiên cứu duy trì mạch cảm xúc bằng LLM, SLERP và VAD. | Private · Nghiên cứu & pilot |

## Trải nghiệm

- Giao diện tiếng Việt và tiếng Anh, font được lưu cùng dự án.
- Avatar 3D tự xoay; giữ và kéo để điều khiển góc nhìn.
- Hiệu ứng hologram trong phần giới thiệu, trang trí theo chủ đề AI.
- Danh sách dự án, nhóm kỹ năng và liên kết liên hệ.
- Bố cục responsive; thanh điều hướng cập nhật theo phần đang xem.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | Vue 3, TypeScript, Vite |
| Đồ họa | Three.js, WebGL, GLSL |
| Chuyển động | GSAP, ScrollTrigger, Lenis |
| Giao diện | SCSS, Urbanist, Be Vietnam Pro |
| Deploy | GitHub Actions, GitHub Pages |

## Phát triển tại máy

Yêu cầu **Node.js 22.12 trở lên trong nhánh 22.x** và npm.

```sh
npm ci
npm run dev
```

Mở **http://127.0.0.1:5174**.

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Chạy server phát triển. |
| `npm run typecheck` | Kiểm tra TypeScript. |
| `npm run build` | Kiểm tra TypeScript và tạo bản production trong `dist/`. |
| `npm run preview` | Xem bản production tại máy sau khi build. |

## Cấu trúc mã nguồn

```text
.github/workflows/deploy.yml   # Build và deploy GitHub Pages
public/                       # Font, favicon và model 3D
src/
  assets/                     # Ảnh, styles và tài nguyên đồ họa
  content/saonumi.ts           # Thông tin cá nhân, dự án, kỹ năng
  content/social.ts           # Liên kết liên hệ
  features/home/components/   # Hero, About, Projects, Skills, Contact
  i18n/                       # Nội dung giao diện Việt–Anh
  three/                      # Scene, shader và các hiệu ứng 3D
index.html
package.json
vite.config.ts
```

Chỉnh nội dung chính trong `src/content/saonumi.ts`, liên hệ trong `src/content/social.ts` và bản dịch trong `src/i18n/messages/namespaces/common/`.

## Đưa lên GitHub và deploy

README, `package.json`, `src/`, `public/` và `.github/` phải nằm **ngay ở gốc repository**. Đưa nội dung của thư mục dự án lên repo, không bọc thêm một thư mục bên ngoài.

### 1. Cập nhật repo hiện có

Repo của portfolio là [Saonumi/saonumi.github.io](https://github.com/Saonumi/saonumi.github.io), nhánh `main`. Clone repo rồi chép mã nguồn vào để giữ lịch sử hiện có.

Ví dụ dưới đây dùng PowerShell, với mã nguồn tại `E:\Saonumi_porfolio` và thư mục clone mới tại `E:\saonumi-publish`:

```powershell
git clone https://github.com/Saonumi/saonumi.github.io.git E:\saonumi-publish

Get-ChildItem E:\Saonumi_porfolio -Force |
  Where-Object { $_.Name -notin @('.git', 'node_modules', 'dist') } |
  Copy-Item -Destination E:\saonumi-publish -Recurse -Force

Set-Location E:\saonumi-publish
git status --short
git add .
git commit -m "Update personal portfolio"
git push origin main
```

Repo hiện có file `CNAME` trỏ tới `saonumi.io.vn`. Cách chép trên giữ file này; kiểm tra mục **Custom domain** trong Settings → Pages nếu tiếp tục dùng tên miền riêng. Địa chỉ mặc định của repo là `https://saonumi.github.io/`.

Workflow tự lấy đường dẫn GitHub Pages, hỗ trợ cả repo cá nhân ở địa chỉ gốc và repo dự án ở dạng `/ten-repo/`.

**Dùng Git để push toàn bộ dự án.** Repo có tài nguyên lớn hơn giới hạn 25 MiB/file của tính năng upload trên trang GitHub. Các file hiện tại đều dưới giới hạn 100 MiB của Git push, nên không cần Git LFS. Xem [giới hạn upload của GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

### 2. Bật GitHub Pages

Trong repo, vào **Settings → Pages → Build and deployment → Source → GitHub Actions**.

Nếu lần chạy đầu xảy ra trước khi bật Pages và bị lỗi, vào **Actions → Deploy portfolio to GitHub Pages → Run workflow**, chọn `main` và chạy lại.

### 3. Kiểm tra bản deploy

Đợi hai job `build` và `deploy` hoàn tất. Địa chỉ web xuất hiện trong **Settings → Pages** và phần deployment của workflow. Từ đó, mỗi lần push lên `main`, GitHub Actions sẽ tự build và cập nhật website.

Không cần upload `dist/`, `node_modules/` hay thêm token riêng cho workflow. `.gitignore` đã loại dependencies, build output, file `.env`, log và file tạm.

Tham khảo: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [Deploy Vite lên GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

## Ghi công và giấy phép

Nội dung cá nhân và bản tùy chỉnh portfolio thuộc **Nguyễn Ngọc Sáng / Saonumi**. Nền tảng scene 3D và scanner About dựa trên [David Heckhoff](https://david-hckh.com/) ([mã nguồn gốc](https://github.com/davidhckh/portfolio-2025)). Bố cục dự án và kỹ năng tham khảo [Moncy Yohannan](https://github.com/MoncyDev/Portfolio-Website).

Giấy phép của mã nền được giữ trong [license.md](license.md). Giấy phép Be Vietnam Pro nằm tại `public/fonts/be-vietnam-pro/OFL.txt`. Model cá nhân do chủ portfolio cung cấp; ảnh minh họa dự án được tạo cho website này.

<details>
<summary>Ghi công được giữ nguyên từ mã nền</summary>

## Credits & Attribution

This project was created and designed by David Heckhoff.

If you use this project or substantial parts of its source code as a base for your own portfolio or work, attribution must be preserved.

Please keep:

- existing credit comments in the source code
- this attribution section in the README
- a visible reference to the original project/repository in derivative works

Original portfolio:
-> https://david-hckh.com

Commercial reuse or redistribution of substantial portions of this project without permission is prohibited.

</details>
