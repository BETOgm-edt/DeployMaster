# DeployMaster v2 🚀

DeployMaster is an open-source, serverless web application that provides a VS Code-like IDE directly in your browser. It integrates seamlessly with GitHub and Vercel, allowing you to create, edit, and deploy web projects with a single click.

**🌐 View Live Project (Hosted on Vercel):** [https://deploymaster.vercel.app/](https://deploymaster.vercel.app/)

<!-- Para exibir a imagem da ferramenta, salve o seu print/screenshot como 'screenshot.png' dentro de uma pasta chamada 'assets' no seu projeto. -->
![DeployMaster Dashboard](assets/screenshot.png)


## ✨ Features

- **Built-in IDE**: Powered by Monaco Editor (the same engine as VS Code), featuring syntax highlighting, auto-completion, and a premium dark theme.
- **Nested File Explorer**: Navigate your GitHub repositories easily with a fully functional tree-view file explorer.
- **1-Click Deployments**: Instantly push code to GitHub and auto-deploy to Vercel without leaving the browser.
- **Real-time Status**: Built-in polling mechanism tracks your Vercel build status (Building, Ready, Error) in real-time.
- **Project Dashboard**: A beautiful, paginated overview of all your deployments with quick search capabilities.
- **100% Client-Side**: No backend required. Everything runs in your browser using official APIs.
- **Highly Secure**: Implements XSS protection and requires your personal API tokens stored safely in your browser's local storage.

## 🛠️ Getting Started

Since DeployMaster is a purely client-side application, you can run it entirely locally by simply opening the `index.html` file in your browser, or host it anywhere (like GitHub Pages or Vercel).

### Prerequisites

To use DeployMaster, you will need:
1. A [GitHub](https://github.com/) account and a Personal Access Token (classic) with `repo` scopes.
2. A [Vercel](https://vercel.com/) account and a Vercel API Token.
3. The **Vercel GitHub App** must be installed on your GitHub account so Vercel can auto-deploy your repositories.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/BETOgm-edt/DeployMaster.git
   ```
2. Open `splash.html` or `index.html` in your browser.
3. Click the **Settings (Gear Icon)** in the top right corner.
4. Paste your GitHub Token and Vercel Token.
5. You are ready to deploy!

## 🔐 Security Notice

DeployMaster stores your GitHub and Vercel tokens locally in your browser's `localStorage`. **Never use DeployMaster on a public or shared computer**, as anyone with access to the browser could theoretically extract your tokens.

For personal and professional use on your own machine, this approach is perfectly safe and ensures your tokens never touch a third-party server.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
