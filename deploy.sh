#!/bin/bash

# Charger les variables d'environnement
if [ -f .env ]; then
    set -o allexport
    source .env.production
    set +o allexport
else
    echo "❌ Fichier .env introuvable."
    exit 1
fi

FILES_TO_UPLOAD=("backend" "package.json")

deploy_backend() {
    echo "🔐 Déploiement du backend via SFTP..."

    lftp -c "
    set sftp:auto-confirm yes
    set net:max-retries 2
    set net:timeout 10
    open -u $SFTP_USER,$SFTP_PASS sftp://$SFTP_HOST
    mkdir -p $REMOTE_DIR_BACK
    cd $REMOTE_DIR_BACK
    $(for file in "${FILES_TO_UPLOAD[@]}"; do
        if [ -e "$file" ]; then
            echo "echo 📂 Envoi de $file"
            if [ -d "$file" ]; then
                echo "mirror -R --delete --verbose $file $(basename $file)"
            else
                echo "put -O . $file"
            fi
        else
            echo "echo ⚠️ $file non trouvé."
        fi
    done)
    "

    echo "✅ Backend déployé avec succès via SFTP."
}

deploy_frontend() {
    echo "🔧 Construction du projet Vite..."
    npm run build || { echo "❌ Échec du build."; exit 1; }

    echo "🚀 Déploiement du frontend via FTP..."

    lftp -c "
    open -u $FTP_USER,$FTP_PASS $FTP_HOST
    mirror -R --delete --verbose --exclude-glob .htaccess $LOCAL_BUILD_DIR $REMOTE_DIR_FRONT
    "

    echo "✅ Frontend déployé avec succès via FTP."
}

# Parsing des arguments
case "$1" in
    -f) deploy_frontend ;;
    -b) deploy_backend ;;
    -a) deploy_backend; deploy_frontend ;;
    *)
        echo "❗ Utilisation : $0 [-f | -b | -a]"
        echo "  -f : déployer uniquement le frontend"
        echo "  -b : déployer uniquement le backend"
        echo "  -a : déployer le frontend et le backend"
        exit 1
        ;;
esac
