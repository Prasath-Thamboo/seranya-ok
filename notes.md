Pour afficher la Navbar sur toutes les pages sauf celles situées dans les dossiers /auth et /dashboard, j'ai créé un composant client ClientLayout.tsx qui utilise le hook usePathname de Next.js pour vérifier le chemin actuel. Si le chemin ne commence pas par /auth ou /dashboard, la Navbar est affichée. J'ai ensuite encapsulé ce composant dans le RootLayout pour appliquer cette logique à toutes les pages du projet, tout en maintenant la Navbar masquée sur les pages où elle n'est pas nécessaire.

Utilisation de Prettier pour indentation propre du code


L'erreur que vous voyez est due à une politique de sécurité appelée CORS (Cross-Origin Resource Sharing), qui empêche les requêtes provenant d'un domaine différent du serveur. Pour résoudre cette erreur, vous devez configurer le serveur backend pour autoriser les requêtes provenant de l'origine http://localhost:3000.


cd /path/to/your/backend/project
If Git is not already initialized in your project, initialize it:

bash
Copier le code
git init
2. Add the GitHub Repository as a Remote
You need to link your local project to the GitHub repository. Add the remote URL of your GitHub repository:

bash
Copier le code
git remote add origin https://github.com/AKnight95/spectralAPI.git
3. Add Your Files to the Git Index
Stage all the files in your project for the first commit:

bash
Copier le code
git add .
This command stages all files in the current directory and its subdirectories for the commit.

4. Commit Your Changes
Create an initial commit with a message describing the changes:

bash
Copier le code
git commit -m "Initial commit of backend project"
5. Push Your Code to GitHub
Push your code to the GitHub repository on the main branch:

bash
Copier le code
git push -u origin main
6. Troubleshooting
Branch Name Mismatch: If the default branch on GitHub is main but your local branch is master, you'll need to rename your local branch to main before pushing:
bash
Copier le code
git branch -M main
Then push your code:

bash
Copier le code
git push -u origin main



